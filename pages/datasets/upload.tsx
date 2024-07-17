import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormWrapper, { FormFile, FormInput, FormItem, FormRadioSelect, FormTextArea } from "@/components/common/Form";
import Hero from "@/components/common/Hero";
import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar";
import { Dataset, Schema } from "@/types/dataset";
import { APIEndPoints, api } from "@/utils/api";
import { generateDataCommitment, initialize } from "@/utils/ezkl";
import { useUser } from "@/utils/session";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


const downloadDataCommitmentNotebook = () => {
  const filePath = '/templates/generate_data_commitment.ipynb';

  fetch(filePath)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generate_data_commitment.ipynb';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => console.error('Error downloading file:', error));
}

enum GenerateDataCommitmentOptions {
  NOTEBOOK = 'notebook',
  BROWSER = 'browser',
}

enum SchemaOptions {
  TEXT = 'text',
  JSON_FILE = 'json_file'
}

const UploadDataset = () => {

  const [ selectedDataCommitmentOption, setSelectedDataCommitmentOption ] = useState<GenerateDataCommitmentOptions>(GenerateDataCommitmentOptions.NOTEBOOK)
  const [ schemaOption, setSchemaOption ] = useState<SchemaOptions>(SchemaOptions.TEXT);
  const [ dataFile, setDataFile ] = useState<File | null>();
  const [ dataCommitmentFile, setDataCommitmentFile ] = useState<File | null>();
  const [ redirecting, setRedirecting ] = useState<boolean>(false);
  const [ datasetId, setDatasetId ] = useState<string | null>();
  const [ schema, setSchema ] = useState<Schema | null>(null);
  
  const { register, handleSubmit, formState } = useForm<Dataset>();
  const { errors } = formState;


  const user = useUser();

  const onSubmit = async (data: Dataset) => {
    if (!user || !user.id) {
      return;
      // TODO login notice?
    }
    const id = crypto.randomUUID();
    setDatasetId(id);
    await api(APIEndPoints.AddDataset, {
      id: id,
      title: data.title,
      description: data.description,
      ownerId: user?.id,
      schema,
      rows: data.rows,
      columns: data.columns,
    })
    if (dataCommitmentFile) {
      await api(APIEndPoints.UploadDataCommitment, {
        datasetId: id,
        dataCommitmentFile,
      })
    }
    setRedirecting(true);
  }

  return (
    <div>
      <NavBar />
      <Hero 
        header="Add a Dataset"
        subheader="Have a dataset available to explore? Add information about your data here and make it visible to others."
      />
      <Layout>
      {redirecting && datasetId ? 
      // TODO NEED TO SET THE DATASET ID
      // ALSO I GUESS THIS IS MOUNTING, SO THE SETIMEOUT IS FINE
        <DatasetAdded datasetId={datasetId}/>
      :
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <Card>
          <FormItem>
            <div
              className="mb-2 text-md font-medium text-gray-900" 
            >
              Dataset Title
            </div>
            <FormInput
              errors={errors}
              errorMessage={'Just a test error'}
              {...register('title', { required: true })}
            />
          </FormItem>
          <FormItem>
            <div
                className="mb-2 text-md font-medium text-gray-900" 
              >
                Dataset Description
              </div>
            <FormTextArea
              errors={errors}
              errorMessage="text area error"
              {...register('description', { required: true })}
            />
          </FormItem>
          <FormItem>
            <div
              className="mb-2 text-md font-medium text-gray-900" 
            >
              Number of columns in this dataset
            </div>
            <FormInput
              errors={errors}
              errorMessage={'Just a test error'}
              {...register('rows', { required: false })}
            />
          </FormItem>
          <FormItem>
            <div
              className="mb-2 text-md font-medium text-gray-900" 
            >
              Number of rows in this dataset (excluding the headers)
            </div>
            <FormInput
              errors={errors}
              errorMessage={'Just a test error'}
              {...register('columns', { required: false })}
            />
          </FormItem>
          </Card>
          <Card>
          <FormItem>
            <div
              className="mb-2 text-md font-medium text-gray-900" 
            >
              Data Schema
            </div>
            <FormRadioSelect 
                  options={[
                    {
                      value: SchemaOptions.TEXT,
                      label: 'Paste the JSON schema',
                    },
                    {
                      value: SchemaOptions.JSON_FILE,
                      label: 'Upload JSON schema file',
                    },
                  ]}
                  onChange={(o) => setSchemaOption(o.value as SchemaOptions)} // TODO fix
                />
            {schemaOption === SchemaOptions.TEXT &&
              <FormTextArea
                errors={errors}
                errorMessage="text area error"
                {...register('schema', { required: true })}
              />
            }
            {schemaOption === SchemaOptions.JSON_FILE &&
              <FormFile onChange={(e) => {
                // TODO also option to copy paste
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
          <FormItem>
              <div
                className="mb-2 text-md font-medium text-gray-900" 
              >
                Generate data commitment
              </div>
              <div>
                <div>
                Some text to explain why
                </div>
                <FormRadioSelect 
                  options={[
                    {
                      value: GenerateDataCommitmentOptions.NOTEBOOK,
                      label: 'Jupyter Notebook',
                    },
                    {
                      value: GenerateDataCommitmentOptions.BROWSER,
                      label: 'In Browser',
                    },
                  ]}
                  onChange={(o) => setSelectedDataCommitmentOption(o.value as GenerateDataCommitmentOptions)} // TODO fix
                />

              </div>
              {
                selectedDataCommitmentOption === GenerateDataCommitmentOptions.BROWSER &&
                (
                  <div>
                    Select your dataset to generate the data commitment.
                    <FormFile onChange={(e) => e.target.files && setDataFile(e.target.files[0])}/>
                    <Button 
                      onClick={async (e) => {
                        e.preventDefault();
                        console.log('datafile', dataFile)
                        if (dataFile) {
                          await initialize();
                          const commitment = await generateDataCommitment(dataFile, Array.from(Array(20).keys()).map(x => x + 1));
                          const jsonString = await JSON.stringify(commitment);
                          const blob = await new Blob([jsonString], { type: 'application/json' });
                          const file = await new File([blob], "data.json", { type: 'application/json' });
                          setDataCommitmentFile(file)
                        }
                      }}
                    >
                      Generate Data Commitment
                    </Button>
                  </div>
                )
              }
              {
                selectedDataCommitmentOption === GenerateDataCommitmentOptions.NOTEBOOK &&
                (
                  <div className="flex flex-col">
                    1. Download the Jupyter Notebook and follow its instruction to generate the data commitment.
                    <Button onClick={(e) => {
                      e.preventDefault();
                      downloadDataCommitmentNotebook();
                    }}> Download</Button>
                    2. Upload the output data_commitment.json file
                    <FormFile onChange={(e) => e.target.files && setDataCommitmentFile(e.target.files[0])}/>
                  </div>
                )
              }
          </FormItem>
          </Card>
          <Button type="submit">
            Add this dataset
          </Button>
        </FormWrapper>
      }
      </Layout>
    </div>
  )
}

type DatasetAddedProps = {
  datasetId: string;
}

const DatasetAdded = ({ datasetId }: DatasetAddedProps) => {
  // TODO this needs a trigger, can't be useeffect! like onShow or onVisible or something
  useEffect(() => {
    setTimeout(() => window.location.href=`${datasetId}`, 2000)
  }, [datasetId]);
  return (
    <div>
      Your dataset has been added. You will be redirected there soon, or click <Link href={`${datasetId}`}>here</Link> to view it.
    </div>
  )
}

export default UploadDataset;