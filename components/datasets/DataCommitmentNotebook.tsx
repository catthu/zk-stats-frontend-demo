import React from 'react';
import { FormFile } from "@/components/common/Form";

interface DataCommitmentNotebookProps {
  onFileChange: (file: File | null) => void;
  downloadDataCommitmentNotebook: () => void;
}

const DataCommitmentNotebook: React.FC<DataCommitmentNotebookProps> = ({ 
  onFileChange, 
  downloadDataCommitmentNotebook 
}) => {
  return (
    <div className="flex flex-col">
      <p>
        1. Download the <a
          className="cursor-pointer underline"
          onClick={(e) => {
            e.preventDefault();
            downloadDataCommitmentNotebook();
          }}
        >Jupyter Notebook</a>
      </p>
      <p>2. Follow its instruction to generate the data commitment.</p>
      <p>3. Upload the output data_commitment.json file</p>
      <FormFile onChange={(e) => e.target.files && onFileChange(e.target.files[0] || null)}/>
    </div>
  );
};

export default DataCommitmentNotebook; 