import React, { useState } from 'react';
import Button from "@/components/common/Button";
import { FormFile } from "@/components/common/Form";
import { generateDataCommitment, initialize } from "@/utils/ezkl";

interface DataCommitmentBrowserProps {
  onFileChange: (file: File | null) => void;
}

const DataCommitmentBrowser: React.FC<DataCommitmentBrowserProps> = ({ onFileChange }) => {
  const [dataFile, setDataFile] = useState<File | null>(null);

  return (
    <div>
      Select your dataset to generate the data commitment.
      <FormFile onChange={(e) => e.target.files && setDataFile(e.target.files[0])}/>
      <Button 
        onClick={async (e) => {
          e.preventDefault();
          if (dataFile) {
            await initialize();
            const commitment = await generateDataCommitment(dataFile, Array.from(Array(20).keys()).map(x => x + 1));
            const jsonString = await JSON.stringify(commitment);
            const blob = await new Blob([jsonString], { type: 'application/json' });
            const file = await new File([blob], "data.json", { type: 'application/json' });
            onFileChange(file);
          }
        }}
      >
        Generate Data Commitment
      </Button>
    </div>
  );
};

export default DataCommitmentBrowser; 