import Button, { ButtonVariant } from "@/components/common/Button";
import { RawRequest, RequestPreview, RequestStatus, convertRawRequestToFullRequest } from "@/types/request";
import { APIEndPoints, api } from "@/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import NewRequest from "./NewRequest";
import Layout from "../common/Layout";
import RequestSubmitted from "./RequestSubmitted";

type OwnerRequestsProps = {
  datasetId: string; // TODO
}

enum ActiveView {
  RequestList = 'Request List',
  RequestSubmitted = 'Request Submitted',
}

export const OwnerRequests = (props: OwnerRequestsProps) => {
  const { datasetId } = props;
  const [ requests, setRequests ] = useState<Array<RequestPreview>>([]);
  const [ activeView, setActiveView ] = useState<ActiveView>(ActiveView.RequestList);

  useEffect(() => {
    if (datasetId) {
      api(APIEndPoints.Requests, { datasetId}).then((response) => {
        setRequests(response?.map((request: RawRequest) => convertRawRequestToFullRequest(request)));
      })
    }
  }, [datasetId, setRequests])

  const onNewRequestSubmit = () => {
    setActiveView(ActiveView.RequestSubmitted)
  }

  return (
    <Layout>
      <RequestActionBar 
        onClickAll={() => setActiveView(ActiveView.RequestList)}
      />
      {activeView === ActiveView.RequestList &&
        <div>
          {requests?.map((request) => <RequestRow key={request.id} {...request}/>)}
        </div>
      }
      {activeView === ActiveView.RequestSubmitted && <RequestSubmitted />}
    </Layout>
  )
}

type RequestActionBarProps = {
  onClickAll: VoidFunction;
}

const RequestActionBar = (props: RequestActionBarProps) => {
  const { onClickAll } = props;
  return (
    <div className="flex space-around gap-2 my-6">
      <Button
        variant={ButtonVariant.TERTIARY}
        onClick={onClickAll}
      >
        All
      </Button>
      <Button
        variant={ButtonVariant.TERTIARY}
      >
        Processing
      </Button>
      <Button
        variant={ButtonVariant.TERTIARY}
      >
        Completed
      </Button>
    </div>
  )
}

const RequestRow = (props: RequestPreview) => {
  const { title, description, datasetId, id, isAccepted, isCompleted } = props;
  let statusColor = 'bg-gray-400';
  let statusText = 'Awaiting Confirmation'
  if (isAccepted) { 
    statusColor = 'bg-yellow-400';
    statusText = 'Confirmed, Awaiting Results';
  }
  if (isCompleted) {
    statusColor = 'bg-green-400';
    statusText = 'Results Ready'
  }
  return (
    <div className="bg-blue-100 shadow-md rounded-lg p-4 mb-4 transition duration-150 ease-in-out hover:shadow-xl hover:scale-105">
      <Link href={`/datasets/${datasetId}/requests/${id}`}>
        <div
          className="flex gap-2 items-center"
        >
          <div
            className="flex items-center gap-2"
          >
            <h3
              className="text-lg font-semibold text-gray-800"
            >{ title }</h3>
            <div
              className={`text-sm ${statusColor} rounded px-2 text-white`}
            >
              {statusText}
            </div>
          </div>
        </div>
        <div
          className="text-sm text-gray-600"
        >
          { description }
        </div>
      </Link>
    </div>
  )
}
