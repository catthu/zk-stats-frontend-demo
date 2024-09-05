import { Dataset, DatasetPreview } from "@/types/dataset"

export const mockDatasets: Array<DatasetPreview> = [
  {
    id: '1',
    title: 'Mice proteomics',
    description: 'Mice proteomics description',
    createdAt: '2023-11-25 00:01:02',
    updatedAt: '2023-11-25 00:01:02',
    dimensions: {
      rows: 0,
      features: 0,
    }
  },
  {
    id: '2',
    title: 'Mice metabolomics',
    description: 'Mice metabolomics description',
    createdAt: '2023-01-23 16:32:34',
    updatedAt: '2023-01-23 16:32:34',
    dimensions: {
      rows: 0,
      features: 0,
    }
  },
]

export const mockDataset: Dataset = {
  id: '1',
  title: 'Mice Proteomics',
  description: 'Mice proteomics description',
  createdAt: '2023-01-23 16:32:34',
  updatedAt: '2023-01-23 16:32:34',
  dimensions: {
    rows: 1000,
    features: 10000000,
  },
  testDataUrl: 'https://example.com',
  schema: [{}
  ],
  sourceDescription: 'Where we got this data from',
  acknowledgement: 'Thank you PSE!',  
}
