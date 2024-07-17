const PROVER_TEMPLATE_URL = '/templates/prover.ipynb';
const PROVER_CODE_CELL = 5;

export const generateProverNotebook = async (code: string) => {
  const splitCode = code.split("\n").map((line) => `${line}\n`);
  const response = await fetch(PROVER_TEMPLATE_URL);
  const template = await response.json();
  const codeCell = template.cells[PROVER_CODE_CELL];
  codeCell.source = splitCode;
  return JSON.stringify(template);
}

const VERIFIER_TEMPLATE_URL = '/templates/verifier.ipynb';
const VERIFIER_CODE_CELL = 5;

export const generateVerifierNotebook = async ( code: string) => {
  const splitCode = code.split("\n").map((line) => `${line}\n`);
  const response = await fetch(VERIFIER_TEMPLATE_URL);
  const template = await response.json();
  const codeCell = template.cells[VERIFIER_CODE_CELL];
  codeCell.source = splitCode;
  return JSON.stringify(template);
}

