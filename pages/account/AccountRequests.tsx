import React, { useState, useEffect } from 'react';
import { APIEndPoints, api } from '@/utils/api';
import { useUser } from '@/utils/session';
import { convertRawRequestToFullRequest, FullRequest } from '@/types/request';
import { useRouter } from 'next/router';
import RequestCard from '@/components/requests/RequestCard';

const AccountRequests: React.FC = () => {
  const user = useUser();
  const [requests, setRequests] = useState<Array<FullRequest>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch all datasets first to get their IDs
    api(APIEndPoints.Datasets)
      .then(async (datasets) => {
        // For each dataset, fetch requests made by the current user
        const allRequests = await Promise.all(
          datasets.map((dataset: any) =>
            api(APIEndPoints.Requests, {
              userId: user.id,
              datasetId: dataset.id,
            })
          )
        );

        // Flatten the array of arrays into a single array of requests
        const flattenedRequests = allRequests.flat();
        const fullRequests = flattenedRequests.map(convertRawRequestToFullRequest);
        setRequests(fullRequests);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [user]);

  if (isLoading) {
    return <div>Loading requests...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading requests</div>;
  }

  if (!requests?.length) {
    return <div>You haven&apos;t made any requests yet.</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl my-6 font-bold text-indigo-900">
          Your Requests
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {requests.map((request: FullRequest) => (
            <RequestCard fullRequest={request} key={request.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountRequests;
