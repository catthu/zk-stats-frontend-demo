import React, { useEffect, useState, useCallback } from 'react';
import Button, { ButtonVariant } from "@/components/common/Button";
import { RawRequest, RequestPreview, RequestStatus, convertRawRequestToFullRequest } from "@/types/request";
import { APIEndPoints, api } from "@/utils/api";
import Link from "next/link";
import Layout from "../common/Layout";
import NewRequest from "./NewRequest";
import RequestSubmitted from "./RequestSubmitted";
import { FormInput } from "../common/Form";

type UserRequestsProps = {
  userId: string;
  datasetId: string;
  isDataOwner?: boolean;
}

enum ActiveView {
  RequestList = 'Request List',
  NewRequest = 'New Request',
  RequestSubmitted = 'Request Submitted',
}

export const UserRequests = ({ userId, datasetId, isDataOwner }: UserRequestsProps) => {
  const [requests, setRequests] = useState<RequestPreview[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.RequestList);
  const [filteredRequests, setFilteredRequests] = useState<RequestPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const response = await api(APIEndPoints.Requests, { 
          userId: isDataOwner ? undefined : userId,
          datasetId });
        const fullRequests = response.map((request: RawRequest) => convertRawRequestToFullRequest(request));
        setRequests(fullRequests);
        setFilteredRequests(fullRequests);
      } catch (err) {
        setError('Failed to fetch requests. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [userId, datasetId, isDataOwner]);

  const handleNewRequestSubmit = useCallback(() => {
    setActiveView(ActiveView.RequestSubmitted);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredRequests(requests.filter(request => 
      request.title.toLowerCase().includes(searchTerm) || 
      request.description?.toLowerCase().includes(searchTerm)
    ));
  }, [requests]);

  const activeRequests = requests.filter(request => !request.isCompleted);
  const processingRequests = requests.filter(request => request.isAccepted && !request.isCompleted);
  const completedRequests = requests.filter(request => request.isCompleted);

  return (
    <Layout>
      <RequestActionBar
        isDataOwner={isDataOwner}
        numberActive={activeRequests.length}
        numberProcessing={processingRequests.length}
        numberCompleted={completedRequests.length}
        onClickNewRequest={() => setActiveView(ActiveView.NewRequest)}
        onClickActive={() => {
          setActiveView(ActiveView.RequestList);
          setFilteredRequests(activeRequests);
        }}
        onClickProcessing={() => setFilteredRequests(processingRequests)}
        onClickCompleted={() => setFilteredRequests(completedRequests)}
        onSearch={handleSearch}
      />
      {isLoading && <div className="text-center my-6">Loading...</div>}
      {error && <div className="text-center my-6 text-red-500">{error}</div>}
      {!isLoading && !error && activeView === ActiveView.RequestList && (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestRow key={request.id} {...request} />
          ))}
        </div>
      )}
      {activeView === ActiveView.NewRequest && (
        <NewRequest userId={userId} datasetId={datasetId} onSubmit={handleNewRequestSubmit} />
      )}
      {activeView === ActiveView.RequestSubmitted && <RequestSubmitted />}
    </Layout>
  );
};

type RequestActionBarProps = {
  isDataOwner?: boolean;
  numberActive: number;
  numberProcessing: number;
  numberCompleted: number;
  onClickNewRequest: VoidFunction;
  onClickActive: VoidFunction;
  onClickProcessing: VoidFunction;
  onClickCompleted: VoidFunction;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RequestActionBar = ({
  isDataOwner,
  numberActive,
  numberProcessing,
  numberCompleted,
  onClickNewRequest,
  onClickActive,
  onClickProcessing,
  onClickCompleted,
  onSearch
}: RequestActionBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 my-6 items-center bg-indigo-200 p-4 rounded-lg shadow">
      {(isDataOwner !== undefined && !isDataOwner) &&
        <Button onClick={onClickNewRequest} variant={ButtonVariant.PRIMARY}>
        + New Request
      </Button>
      }
      <Button variant={ButtonVariant.QUARTERY} onClick={onClickActive}>
        Active ({numberActive})
      </Button>
      <Button variant={ButtonVariant.QUARTERY} onClick={onClickProcessing}>
        Processing ({numberProcessing})
      </Button>
      <Button variant={ButtonVariant.QUARTERY} onClick={onClickCompleted}>
        Completed ({numberCompleted})
      </Button>
      <FormInput
        placeholder="Search requests..."
        onChange={onSearch}
        className="flex-grow p-2 rounded border border-indigo-400 bg-indigo-200"
      />
    </div>
  );
};

const RequestRow = ({
  title,
  description,
  datasetId,
  id,
  isAccepted,
  isCompleted,
  resultApproved
}: RequestPreview) => {
  let statusColor = 'bg-gray-400';
  let statusText = 'Awaiting Confirmation';

  if (isAccepted) {
    statusColor = 'bg-yellow-400';
    statusText = 'Confirmed, Awaiting Results';
  }
  if (isCompleted) {
    statusColor = 'bg-green-400';
    statusText = 'Results Ready';
  }
  if (resultApproved) {
    statusColor = 'bg-green-800';
    statusText = 'Request Completed';
  }

  return (
<div className="bg-gray-50 border-1 border-gray-200 hover:bg-indigo-100 rounded-lg p-4 mb-2">
  <Link href={`/datasets/${datasetId}/requests/${id}`}>
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex items-center gap-4 w-full">
        <div className={`text-xs ${statusColor} rounded-full px-3 py-1 text-white w-1/6 flex justify-center items-center`}>
          {statusText}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 w-2/6">
          {title}
        </h3>
        <div className="text-sm text-gray-600 w-3/6">
          {description}
        </div>
      </div>
    </div>
  </Link>
</div>
  );
};