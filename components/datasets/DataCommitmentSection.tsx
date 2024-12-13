import React, { useState } from 'react';
import Button from "@/components/common/Button";
import { FormFile, FormItem, FormRadioSelect } from "@/components/common/Form";
import DataCommitmentBrowser from './DataCommitmentBrowser';
import DataCommitmentNotebook from './DataCommitmentNotebook';

export enum GenerateDataCommitmentOptions {
  NOTEBOOK = 'notebook',
  BROWSER = 'browser',
}

interface DataCommitmentSectionProps {
  onFileChange: (file: File | null) => void;
  showIntroText?: boolean;
  availableOptions?: GenerateDataCommitmentOptions[];
  allowUploadLater?: boolean;
}

const DataCommitmentSection: React.FC<DataCommitmentSectionProps> = ({ 
  onFileChange, 
  showIntroText = true,
  availableOptions = [GenerateDataCommitmentOptions.NOTEBOOK, GenerateDataCommitmentOptions.BROWSER],
  allowUploadLater = true
}) => {
  const [selectedDataCommitmentOption, setSelectedDataCommitmentOption] = useState<GenerateDataCommitmentOptions | null>(null);

  const downloadDataCommitmentNotebook = () => {
    // Implementation of downloadDataCommitmentNotebook function
  };

  return (
    <FormItem>
      {showIntroText && (
        <div>
          <div className="mb-2 text-md font-medium text-gray-900">
            Generate data commitment
          </div>
          <div className="text-xs text-gray-600">
            To ensure that future computation requests are run on this dataset and not a different dataset or a modified version, we will generate
            a set of commitment hash based on the data. Please select how you want to generate this data commitment.
          </div>
          <div className="text-xs text-gray-600">
            In browser generation is the most convenient option, but will require you to give your browser access to the data. The data will never be uploaded.
            For a more trustless approach, you can download a Jupyter Notebook and generate the data commitment locally.
          </div>
        </div>
      )}
      
      <FormRadioSelect 
        options={[
          ...availableOptions.map(option => ({
            value: option,
            label: option === GenerateDataCommitmentOptions.NOTEBOOK ? 'Jupyter Notebook' : 'In Browser',
          })),
          ...(allowUploadLater ? [{
            value: '',
            label: 'Upload Later',
          }] : []),
        ]}
        onChange={(o) => setSelectedDataCommitmentOption(o.value as GenerateDataCommitmentOptions | null)}
      />

      {selectedDataCommitmentOption === GenerateDataCommitmentOptions.BROWSER && (
        <DataCommitmentBrowser onFileChange={onFileChange} />
      )}
      {selectedDataCommitmentOption === GenerateDataCommitmentOptions.NOTEBOOK && (
        <DataCommitmentNotebook 
          onFileChange={onFileChange}
          downloadDataCommitmentNotebook={downloadDataCommitmentNotebook}
        />
      )}
    </FormItem>
  );
};

export default DataCommitmentSection; 