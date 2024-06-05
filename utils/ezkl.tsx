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

export async function verifyProof(
  proofPath: string,
  settingsPath: string,
  verificationKeyPath: string,
  srsPath: string,
) {
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
  //await initialize();

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
      jsonData = JSON.parse(fileContent);
  } catch (error) {
      console.error('Error parsing JSON:', error);
      return;
  }

  // dataJSON is `{"x": [1.2, 3.4], "y": [5.6, 7.8}`
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
  // res is `{"0": {"x": "9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03", "y": "9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03"}, "1": {"x": "9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03", "y": "9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03"}}`
  return res;
}


function generateDataCommitmentForColumn(column: number[], scale: number) {
    // a list of string (in Uint8ClampedArray): `['"b900000000000000000000000000000000000000000000000000000000000000"','"b900000000000000000000000000000000000000000000000000000000000000"']`
    const felts = column.map((x: number) => { console.log('g x', x); return floatToFelt(x, scale)}) as Uint8ClampedArray[]
    // a string (in Uint8ClampedArray): `["b900000000000000000000000000000000000000000000000000000000000000","b900000000000000000000000000000000000000000000000000000000000000"]`
    // basically just the `felts` json stringified
    const feltsStrInBytes = feltsToPoseidonInput(felts)
    const output = poseidonHash(feltsStrInBytes)
    // [['9d0e3bc6dc4150cd8c9ff58b7b3794ade425e5c0d5f4e6f7617c38ea6d28ba03']]
    const deserializedOutput = deserialize(output)
    return deserializedOutput[0][0] as string
}
