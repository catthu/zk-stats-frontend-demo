export type DatasetPreview = {
  id: string;
  title: string;
  createdAt: string;
  description: string;
  updatedAt: string;
  dimensions?: {
    rows: number;
    features: number;
  };
}

export type Dataset = DatasetPreview & {
  schema?: []; // TODO
  testDataUrl?: string;
  sourceDescription?: string;
  acknowledgement?: string;
  history?: []; // TODO
  glossary?: []; // TODO
  ownerId?: string;
  //discussionId?: number; // No discussion id here, just make it a foreign key on the discussion table
}

export type UserDatasetRequests = Array<UserDatasetRequest>;

export type UserDatasetRequest = {
  userId: string; // TODO UUID
  datasetId: string; // TODO UUID
}

export type DatasetResponse = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  updated_at: string;
  owner_id: string;
}

export const convertDatasetResponseToDataset = (datasetResponse: DatasetResponse): Dataset => {
  return {
    id: datasetResponse.id,
    createdAt: datasetResponse.created_at,
    title: datasetResponse.title,
    description: datasetResponse.description,
    updatedAt: datasetResponse.updated_at,
    ownerId: datasetResponse.owner_id,
  }
}
