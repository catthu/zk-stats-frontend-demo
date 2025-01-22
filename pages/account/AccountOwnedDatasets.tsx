import React, { useState, useEffect } from 'react';
import { Dataset, DatasetResponse, convertDatasetResponseToDataset } from '@/types/dataset';
import { APIEndPoints, api } from '@/utils/api';
import { useUser } from '@/utils/session';
import { DatasetCard } from '@/components/datasets/DatasetCard';

const AccountOwnedDatasets: React.FC = () => {
  const user = useUser();
  const [datasets, setDatasets] = useState<Array<Dataset>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api(APIEndPoints.Datasets)
      .then((response) => {
        const convertedDatasets = response
          .map((dataset: DatasetResponse) => convertDatasetResponseToDataset(dataset))
          .filter((dataset: Dataset) => dataset.ownerId === user?.id);
        setDatasets(convertedDatasets);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [user]);

  if (isLoading) {
    return <div>Loading datasets...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading datasets</div>;
  }

  if (!datasets?.length) {
    return <div>You don&apos;t have any datasets yet.</div>;
  }

  return (
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-2xl my-6 font-bold text-indigo-900">
            Your Datasets
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {datasets.map((dataset) => (
              <DatasetCard dataset={dataset} key={dataset.id} />
            ))}
          </div>
        </div>
      </div>
  );
};

export default AccountOwnedDatasets;
