import Hero from "@/components/common/Hero";
import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar";
import AddDatasetForm from "@/components/datasets/AddDatasetForm";
import { Dataset, Schema } from "@/types/dataset";
import { APIEndPoints, api } from "@/utils/api";
import { useUser } from "@/utils/session";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


enum SchemaOptions {
  TEXT = 'text',
  JSON_FILE = 'json_file',
}

const UploadDataset = () => {

  const [ schemaOption, setSchemaOption ] = useState<SchemaOptions | null>(null);
  const [ dataCommitmentFile, setDataCommitmentFile ] = useState<File | null>();
  const [ redirecting, setRedirecting ] = useState<boolean>(false);
  const [ datasetId, setDatasetId ] = useState<string | null>();
  const [ schema, setSchema ] = useState<Schema | null>(null);
  
  const { formState } = useForm<Dataset>();


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
      //@ts-ignore
      schema: schemaOption === SchemaOptions.TEXT ? data.schema : (schemaOption === SchemaOptions.JSON_FILE ? schema : null),
      rows: data.rows || undefined,
      columns: data.columns || undefined,
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
        <AddDatasetForm onSubmit={onSubmit}/>
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
    setTimeout(() => window.location.href=`/datasets/${datasetId}`, 2000)
  }, [datasetId]);
  return (
    <div>
      Your dataset has been added. You will be redirected there soon, or click <Link href={`/datasets/${datasetId}`}>here</Link> to view it.
    </div>
  )
}

export default UploadDataset;