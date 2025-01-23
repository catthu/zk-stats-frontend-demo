import init, { init_panic_hook, init_logger, verify, poseidonHash, floatToFelt, serialize, deserialize } from '@ezkljs/engine/web'

export async function initialize() {
  try {
      // Initialize the WASM module with recommended memory allocation
      await init(
          undefined,
          new WebAssembly.Memory({ initial: 20, maximum: 4096, shared: true })
      );
      // Initialize the panic hook and logger
      init_panic_hook();
      // Commented this out because it's causing a runtime unreachable error
      init_logger();
      console.log("Wasm module and logger initialized successfully");
  } catch (error) {
      console.error("Error during Wasm module initialization:", error);
      throw error;
  }
}

async function loadFileToBuffer(path: string) {
  return await fetch(path).then((res) => res.arrayBuffer());
}

export const getVerificationKey = async (
  shape: { x: string, y: string },
  computation: string,
  precalWitness: Record<string, number[]>,
  settings: Record<string, any>
) => {

  const helperURL = 'http://18.181.203.1:8000/computation_to_vk'
  const response = await fetch(helperURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data_shape: JSON.stringify(shape),
      computation: computation,
      precal_witness: JSON.stringify(precalWitness),
      settings: JSON.stringify(settings)
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data.vk;
};


export async function verifyProof(
  proofPath: string,
  settingsPath: string,
  verificationKeyPath: string,
  srsPath: string,
) {
  await initialize();
  
  const [proof, settings, verificationKey, srs] = await Promise.all([
      loadFileToBuffer(proofPath),
      loadFileToBuffer(settingsPath),
      loadFileToBuffer(verificationKeyPath),
      loadFileToBuffer(srsPath),
  ]);
  const output = verify(
      new Uint8ClampedArray(proof),
      new Uint8ClampedArray(verificationKey),
      new Uint8ClampedArray(settings),
      new Uint8ClampedArray(srs),
  );
  return output
}

function feltsToPoseidonInput(felts: Uint8ClampedArray[]): Uint8ClampedArray {
    const feltsStr = '[' + felts.map(felt => {
        return Array.from(felt).map(x => String.fromCharCode(x)).join('');
    }).join(',') + ']';
    return new Uint8ClampedArray(feltsStr.split('').map(x => x.charCodeAt(0)));
}


// Crafting this because `serialize` is not working well
export async function generateDataCommitment(dataFile: File, possible_scales: number[]) {
  const fileReader = new FileReader();

  const readFileAsText = (file: File) => {
      return new Promise<string>((resolve, reject) => {
          fileReader.onload = (event) => {
              if (event.target?.result) {
                  resolve(event.target.result as string);
              } else {
                  reject(new Error("Error reading file"));
              }
          };

          fileReader.onerror = (error) => {
              reject(error);
          };

          fileReader.readAsText(file);
      });
  };

  let jsonData;
  try {
      const fileContent = await readFileAsText(dataFile);
      // Check if file is CSV based on extension
      if (dataFile.name.toLowerCase().endsWith('.csv')) {
          // Parse CSV
          const rows = fileContent.split('\n').map(row => row.trim()).filter(row => row.length > 0);
          const headers = rows[0].split(',').map(h => h.trim());
          const data: Record<string, number[]> = {};
          
          // Initialize arrays for each column
          headers.forEach(header => {
              data[header] = [];
          });
          
          // Parse each row
          for (let i = 1; i < rows.length; i++) {
              const values = rows[i].split(',').map(v => parseFloat(v.trim()));
              headers.forEach((header, index) => {
                  if (!isNaN(values[index])) {
                      data[header].push(values[index]);
                  }
              });
          }
          jsonData = data;
      } else {
          // Parse as JSON if not CSV
          jsonData = JSON.parse(fileContent);
      }
  } catch (error) {
      console.error('Error parsing file:', error);
      return;
  }

  let res = {} as any;
  for (const scale of possible_scales) {
      const commitments = {} as any;
      for (const column in jsonData) {
          const columnData: number[] = jsonData[column];
          const commitment = generateDataCommitmentForColumn(columnData, scale);
          commitments[column] = commitment;
      }
      res[scale] = commitments;
  }
  return res;
}


function generateDataCommitmentForColumn(column: number[], scale: number) {
    // a list of string (in Uint8ClampedArray): `['"b900000000000000000000000000000000000000000000000000000000000000"','"b900000000000000000000000000000000000000000000000000000000000000"']`
    const felts = column.map((x: number) => { return floatToFelt(x, scale)}) as Uint8ClampedArray[]
    // a string (in Uint8ClampedArray): `["b900000000000000000000000000000000000000000000000000000000000000","b900000000000000000000000000000000000000000000000000000000000000"]`
    // basically just the `felts` json stringified
    const feltsStrInBytes = feltsToPoseidonInput(felts)
    const output = poseidonHash(feltsStrInBytes)
    // [['9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03']]
    const deserializedOutput = deserialize(output)
    return deserializedOutput[0][0] as string
}

export const extractResult = (proofFile: File) => {
    if (proofFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string)
          return(json['pretty_public_inputs']['rescaled_outputs'].slice(1,))
        } catch (error) {
          console.error('Error parsing JSON:', error)
          return '';
        }
      }
      reader.readAsText(proofFile)
    }
    return '';
  }
