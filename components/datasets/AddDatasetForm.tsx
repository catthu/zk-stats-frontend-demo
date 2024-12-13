import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import FormWrapper, { FormFile, FormInput, FormItem, FormRadioSelect, FormTextArea } from "@/components/common/Form";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Dataset, Schema } from "@/types/dataset";
import DataCommitmentSection from './DataCommitmentSection';

enum SchemaOptions {
  TEXT = 'text',
  JSON_FILE = 'json_file',
}

interface AddDatasetFormProps {
  onSubmit: (data: Dataset) => void;
  initialDataset?: Partial<Dataset>;
}

const AddDatasetForm: React.FC<AddDatasetFormProps> = ({ onSubmit, initialDataset }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Dataset>({ defaultValues: initialDataset });
  const [schemaOption, setSchemaOption] = useState<SchemaOptions | null>(null);
  const [dataCommitmentFile, setDataCommitmentFile] = useState<File | null>(null);
  const [schema, setSchema] = useState<Schema | null>(null);

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <FormItem>
          <div className="mb-2 text-md font-medium text-gray-900">
            Dataset Title
          </div>
          <FormInput
            errors={errors}
            errorMessage={'Just a test error'}
            {...register('title', { required: true })}
            placeholder="Give this dataset a descriptive name"
          />
        </FormItem>
        <FormItem>
          <div className="mb-2 text-md font-medium text-gray-900">
            Dataset Description
          </div>
          <FormTextArea
            errors={errors}
            errorMessage="text area error"
            {...register('description', { required: true })}
            placeholder="Describe this dataset in as much details as possible, e.g. How was it obtained? When was data collection?"
          />
        </FormItem>
        <FormItem>
          <div className="mb-2 text-md font-medium text-gray-900">
            Number of columns in this dataset
          </div>
          <FormInput
            errors={errors}
            errorMessage={'Just a test error'}
            {...register('rows', { required: false })}
            placeholder="Number of columns"
          />
        </FormItem>
        <FormItem>
          <div className="mb-2 text-md font-medium text-gray-900">
            Number of rows in this dataset
          </div>
          <FormInput
            errors={errors}
            errorMessage={'Just a test error'}
            {...register('columns', { required: false })}
            placeholder="Number of rows, excluding the headers"
          />
        </FormItem>
      </Card>
      <Card>
        <FormItem>
          <div className="mb-2 text-md font-medium text-gray-900">
            Data Schema
          </div>
          <div className="text-xs text-gray-600">
            Please upload the schema of your data in the <Link href="/" className="underline">JSON schema format</Link>.
          </div>
          <FormRadioSelect 
            options={[
              {
                value: SchemaOptions.TEXT,
                label: 'Paste as text',
              },
              {
                value: SchemaOptions.JSON_FILE,
                label: 'Upload JSON schema file',
              },
              {
                value: '',
                label: 'Upload Later',
              },
            ]}
            onChange={(o) => setSchemaOption(o.value as SchemaOptions | null)}
          />
          {schemaOption === SchemaOptions.TEXT &&
            <FormTextArea
              errors={errors}
              errorMessage="text area error"
              {...register('schema', { required: false })}
              placeholder="Copy and paste your data schema here in the JSON schema format"
            />
          }
          {schemaOption === SchemaOptions.JSON_FILE &&
            <FormFile onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    //@ts-ignore
                    const json = JSON.parse(event.target.result);
                    setSchema(json);
                  } catch (error) {
                    console.error("Error parsing JSON:", error);
                  }
                };
                reader.readAsText(file);
              }
            }} />
          }
        </FormItem>
      </Card>
      <Card>
        <DataCommitmentSection onFileChange={setDataCommitmentFile} />
      </Card>
      <Button type="submit">
        Add this dataset
      </Button>
    </FormWrapper>
  );
};

export default AddDatasetForm;
