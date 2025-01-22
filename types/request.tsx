import { Dataset } from "./dataset";

export type RequestPreview = {
  id: string; // TODO uuid
  title: string;
  description?: string;
  updatedAt: string;
  userId: string; // TODO uuid
  datasetId: string; // TODO uuid
  isAccepted: boolean;
  isCompleted: boolean;
  resultApproved: boolean;
  username: string;
}

export type FullRequest = RequestPreview & {
  code: string; // TODO think about what type here 
  result: string; // TODO think about type here too
  dataset?: Dataset;
  createdAt: string;
  status: RequestStatus;
}

export type NewRequest = {
  title: string;
  description?: string;
  code: string;
}

export enum RequestStatus {
  Completed = 'Completed',
  AwaitingConfirmation = 'Awaiting Confirmation',
  AwaitingResults = 'Awaiting Results',
}

export type RawRequest = {
  id: string; // TODO uuid
  title: string;
  description?: string;
  updated_at: string;
  created_at: string;
  status: RequestStatus;
  user_id: string; // TODO uuid
  dataset_id: string; // TODO uuid
  is_accepted: boolean;
  is_completed: boolean;
  result_approved: boolean;
  code: string;
  result: string;
  username: string;
}

export const convertRawRequestToFullRequest = (rawRequest: RawRequest): FullRequest => {
  return {
    ...rawRequest,
    updatedAt: rawRequest.updated_at,
    createdAt: rawRequest.created_at,
    userId: rawRequest.user_id,
    datasetId: rawRequest.dataset_id,
    isAccepted: rawRequest.is_accepted,
    isCompleted: rawRequest.is_completed,
    resultApproved: rawRequest.result_approved,
    username: rawRequest.username,
    status: (rawRequest.is_completed)
    ? RequestStatus.Completed 
    : (rawRequest.is_accepted) 
      ? RequestStatus.AwaitingResults 
      : RequestStatus.AwaitingConfirmation,
  }
}

export type Breadcrumb = {
  label: string;
  href: string;
}
