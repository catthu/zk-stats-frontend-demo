const REQUEST_TEMPLATE_URL = '/templates/run_request.ipynb';
const CODE_CELL = 2;

export const generateJupyterNotebook = async (code: string) => {
  const splitCode = code.split("\n").map((line) => `${line}\n`);
  const response = await fetch(REQUEST_TEMPLATE_URL);
  const template = await response.json();
  const codeCell = template.cells[CODE_CELL];
  codeCell.source = splitCode;
  return JSON.stringify(template);
}