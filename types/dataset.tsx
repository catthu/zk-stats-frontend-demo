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
  subtitle?: string;
}

export type Dataset = DatasetPreview & {
  schema?: Record<string, any>;
  testDataUrl?: string;
  sourceDescription?: string;
  acknowledgement?: string;
  history?: []; // TODO
  glossary?: []; // TODO
  ownerId?: string;
  //discussionId?: number; // No discussion id here, just make it a foreign key on the discussion table
  rows?: number;
  columns?: number;
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
  schema?: Record<string, any>;
  rows?: number;
  columns?: number;
  subtitle?: string;
}

export const convertDatasetResponseToDataset = (datasetResponse: DatasetResponse): Dataset => {
  return {
    id: datasetResponse.id,
    createdAt: datasetResponse.created_at,
    title: datasetResponse.title,
    description: datasetResponse.description,
    updatedAt: datasetResponse.updated_at,
    ownerId: datasetResponse.owner_id,
    schema: datasetResponse.schema,
    rows: datasetResponse.rows,
    columns: datasetResponse.columns,
    subtitle: datasetResponse.subtitle,
  }
}

export type Schema = {
  $schema: string;
  title: string;
  type: string;
  properties: {
    [key: string]: {
      type: string;
      description?: string;
      format?: string;
    };
  };
  required: string[];
}
