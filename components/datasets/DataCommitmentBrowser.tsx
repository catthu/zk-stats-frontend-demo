import React, { useState } from 'react';
import Button from "@/components/common/Button";
import { FormFile } from "@/components/common/Form";
import { generateDataCommitment, initialize } from "@/utils/ezkl";
import { Spinner } from '../common/Spinner';

interface DataCommitmentBrowserProps {
  onFileChange: (file: File | null) => void;
  onGenerateComplete: (content: string) => void;
}

const DataCommitmentBrowser: React.FC<DataCommitmentBrowserProps> = ({ onFileChange, onGenerateComplete }) => {
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div>
      Select your dataset to generate the data commitment.
      <FormFile onChange={(e) => e.target.files && setDataFile(e.target.files[0])}/>
      <Button 
        disabled={isGenerating}
        className={`flex items-center justify-center gap-2 ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : ''}`}
        onClick={async (e) => {
          e.preventDefault();
          if (dataFile) {
            setIsGenerating(true);
            try {
              await initialize();
              const commitment = await generateDataCommitment(dataFile, Array.from(Array(20).keys()).map(x => x + 1));
              const jsonString = JSON.stringify(commitment);
              const blob = new Blob([jsonString], { type: 'application/json' });
              const file = new File([blob], "data.json", { type: 'application/json' });
              onFileChange(file);
              onGenerateComplete(jsonString);
            } catch (error) {
              console.error('Error generating commitment:', error);
            } finally {
              setIsGenerating(false);
            }
          }
        }}
      >
        {isGenerating ? (
          <div className="flex items-center gap-2"><Spinner />Generating, this may take a while...</div>
        ) : (
          'Generate Data Commitment'
        )}
      </Button>
    </div>
  );
};

export default DataCommitmentBrowser; 