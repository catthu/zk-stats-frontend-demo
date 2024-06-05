// API call preprocessor to switch between real API calls and mock data

import useMockData from "@/mocks";
import { NewRequest } from "@/types/request";
import { createClient } from '@supabase/supabase-js'
import { generateJupyterNotebook } from "./notebook";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseApiKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

export const supabase = (supabaseUrl && supabaseApiKey) ? createClient(supabaseUrl, supabaseApiKey) : undefined;


export enum APIEndPoints {
  GetDataset = 'dataset',
  AddDataset = 'add_dataset',
  Datasets = 'datasets',
  GetRequest = 'get_request',
  AddRequest = 'add_request',
  UploadDataCommitment = 'upload_data_commitment',
  Requests = 'requests',

  DownloadNotebook = 'download_notebook',
  UploadNotebook = 'upload_noteobook',
  AcceptRequest = 'accept_request',
  SubmitRequestResult = 'submit_request_result',
  UploadProofAndAssets = 'upload_proof_and_assets',

  SignUp = 'signup',
  SignInWithPassword = 'siginin_with_password',
  SignOut = 'signout',
}

type GetDatasetOptions = {
  id: string;
}

type AddDatasetOptions = {
  id: string;
  title: string;
  description: string;
  ownerId: string;
}

type UploadDataCommitmentOptions = {
  datasetId: string;
  dataCommitmentFile: File;
}

type SignUpOptions = {
  username: string;
  email: string;
  password: string;
}

type SignInWithPasswordOptions = {
  usernameOrEmail: string;
  password: string;
}

type NewRequestOptions = {
  title: string;
  description?: string;
  code: string;
  user_id: string;
  dataset_id: string;
}

type GetRequestOptions = {
  datasetId: string;
  requestId: string;
}

type GetRequestsOptions = {
  userId?: string;
  datasetId: string;
}

type DownloadNotebookOptions = {
  requestId: string;
}

type UploadNotebookOptions = {
  requestId: string;
  code: string;
}

type AcceptRequestOptions = {
  requestId: string;
}

type SubmitRequestResultOptions = {
  requestId: string;
  result: any;
}

type UploadProofAndAssetsOptions = {
  datasetId: string;
  requestId: string;
  proofFile: File,
  vkFile: File,
  modelOnnxFile: File,
  srsFile: File,
  settingsFile: File,
}

export type Options = undefined
  | GetDatasetOptions
  | AddDatasetOptions
  | UploadDataCommitmentOptions
  | SignUpOptions
  | SignInWithPasswordOptions
  | NewRequestOptions
  | GetRequestOptions
  | GetRequestsOptions
  | DownloadNotebookOptions
  | SubmitRequestResultOptions
  | UploadProofAndAssetsOptions


export const api = async (
  endpoint: APIEndPoints,
  options: Options = undefined
): Promise<any> => {
  if (useMock) {
    return Promise.resolve(useMockData(endpoint, options));
  }
  if (!supabase) {
    // TODO throw error
  }
  switch (endpoint) {
    case APIEndPoints.GetDataset: return getDataset(options as GetDatasetOptions);
    case APIEndPoints.AddDataset: return addDataset(options as AddDatasetOptions);
    case APIEndPoints.UploadDataCommitment: return uploadDataCommitment(options as UploadDataCommitmentOptions);
    case APIEndPoints.Datasets: return getDatasets();
    case APIEndPoints.GetRequest: return getRequest(options as GetRequestOptions);
    case APIEndPoints.AddRequest: return addRequest(options as NewRequestOptions);
    case APIEndPoints.Requests: return getRequests(options as GetRequestsOptions);
    // Data owner operations
    case APIEndPoints.DownloadNotebook: return downloadNotebook(options as DownloadNotebookOptions);
    case APIEndPoints.UploadNotebook: return uploadNotebook(options as UploadNotebookOptions);
    case APIEndPoints.AcceptRequest: return acceptRequest(options as AcceptRequestOptions);
    case APIEndPoints.SubmitRequestResult: return submitRequestResult(options as SubmitRequestResultOptions);
    case APIEndPoints.UploadProofAndAssets: return uploadProofAndAssets(options as UploadProofAndAssetsOptions); // TODO options
    // AUTH
    case APIEndPoints.SignUp: return signUp(options as SignUpOptions);
    case APIEndPoints.SignInWithPassword: return signInWithPassword(options as SignInWithPasswordOptions);
    case APIEndPoints.SignOut: return signOut();
    default: return getDatasets(); // TODO not really, default should be error
  }
};

const getDataset = async (options: GetDatasetOptions) => {
  if (!supabase) {
    return;
    // TODO throw error
  }
  const { data, error } = await supabase
    .from('datasets')
    .select('*')
    .filter('id', 'eq', options.id)
  if (data) {
    return data;
  }
  return Promise.resolve([])

}

const addDataset = async (options: AddDatasetOptions) => {
  if (!supabase) {
    return;
    // TODO throw error
  }
  const { data, error } = await supabase
    .from('datasets')
    .insert({
      id: options.id,
      title: options.title,
      description: options.description,
      owner_id: options.ownerId,
    })
  if (data) {
    return data;
  }
  return;
}

const getDatasets = async () => {
  if (!supabase) {
    return;
    // TODO throw error
  }
  const { data, error } = await supabase
    .from('datasets')
    .select('*')
  if (data) {
    return data;
  }
  return Promise.resolve([])
}

const getRequest = async (options: GetRequestOptions) => {

  if (!supabase) {
    return;
    // TODO error
  }

  const { data, error } = await supabase
    .from('computations')
    .select('*')
    .filter('dataset_id', 'eq', options.datasetId)
    .filter('id', 'eq', options.requestId)
  
if (data) {
  return data
}
}

const addRequest = async (options: NewRequest) => {
  if (!supabase) {
    return;
    // TODO error
  }

  const uuid = crypto.randomUUID();
  const notebook = await generateJupyterNotebook(options.code);
  const notebookBlob = new Blob([notebook], { type: 'application/x-ipynb+json' })

  const { data, error } = await supabase
    .from('computations')
    .insert({
      ...options,
      id: uuid,
    })

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('computations')
    .upload(`${uuid}.ipynb`, notebookBlob, {
      contentType: 'application/x-ipynb+json',
      //upsert: true
    })

  // TODO simulate atomicity

  if (data) {
    return data;
  }
  return Promise.resolve([]);
}

const getRequests = async(options: GetRequestsOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }
  if (options.userId) {
    const { data, error } = await supabase
      .from('computations')
      .select('*')
      .filter('user_id', 'eq', options.userId)
      .filter('dataset_id', 'eq', options.datasetId)
      if (data) {
        return data
      }
  } else {
    const { data, error } = await supabase
      .from('computations')
      .select('*')
      .filter('dataset_id', 'eq', options.datasetId)
    // TODO actual owner verification security
    if (data) {
      return data
    }
  }
}

const downloadNotebook = async ({ requestId }: DownloadNotebookOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }

  const { data } = supabase.storage
    .from('computations')
    .getPublicUrl(`${requestId}.ipynb`);

  const { publicUrl } = data;

  fetch(publicUrl)
    .then(response => {
      if (response.ok) return response.blob();
      throw new Error('Network response was not ok.');
    })
    .then(blob => {
      // Create an object URL for the blob object
      const blobUrl = URL.createObjectURL(blob);
    
      // Create a temporary anchor element
      const anchor = document.createElement('a');
    
      // Set the href to the object URL
      anchor.href = blobUrl;
      anchor.download = `${requestId}.ipynb`; // Set the download attribute with the desired file name
    
      // Append the anchor to the body to make it clickable
      document.body.appendChild(anchor);
    
      // Trigger the download by clicking the anchor
      anchor.click();
    
      // Clean up by revoking the object URL and removing the anchor element
      URL.revokeObjectURL(blobUrl);
      anchor.remove();
    })
    .catch(error => console.error('Download failed:', error));

}

const uploadNotebook = async ({ requestId, code } : UploadNotebookOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }

  const notebook = await generateJupyterNotebook(code);
  const notebookBlob = new Blob([notebook], { type: 'application/x-ipynb+json' })

  const { data, error } = await supabase.storage
    .from('computations')
    .upload(`${requestId}.ipynb`, notebookBlob, {
      contentType: 'application/x-ipynb+json',
      //upsert: true
    })

  if (data) {
    return data
  }
}

const acceptRequest = async ({ requestId }: AcceptRequestOptions) => {
  if (!supabase) {
    return {data: null, error: 'Database client not loaded.'};
    // TODO error
  }
  const { data, error } = await supabase
    .from('computations')
    .update({
      is_accepted: true,
    })
    .match({
      id: requestId
    })

  if (data) {
    return { data, error: null }
  }
}

const submitRequestResult = async ({requestId, result}: SubmitRequestResultOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }
  const { data, error } = await supabase
    .from('computations')
    .update({
      result: result,
      is_completed: true,
    })
    .match({
      id: requestId
    })

  if (data) {
    return data
  }
}

const uploadDataCommitment = async({
  datasetId,
  dataCommitmentFile
}: UploadDataCommitmentOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }

  const { data, error } = await supabase.storage
    .from('proof_assets')
    .upload(`${datasetId}/data_commitment.json`, dataCommitmentFile)

  if (error) {
    //TODO handle error
  }

  return data;
  
}

const uploadProofAndAssets = async ({ 
  datasetId,
  requestId,
  proofFile,
  vkFile,
  modelOnnxFile,
  srsFile,
  settingsFile
}: UploadProofAndAssetsOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }

  const promises = [
    supabase.storage.from('proof_assets').upload(`${datasetId}/${requestId}/model.pf`, proofFile),
    supabase.storage.from('proof_assets').upload(`${datasetId}/${requestId}/model.vk`, vkFile),
    supabase.storage.from('proof_assets').upload(`${datasetId}/${requestId}/model.onnx`, modelOnnxFile),
    //supabase.storage.from('proof_assets').upload(`${datasetId}/${requestId}/model.pf`, proofFile) // TODO ???
    supabase.storage.from('proof_assets').upload(`${datasetId}/${requestId}/settings.json`, settingsFile)
  ];
  // const { data, error } = await supabase.storage
  //   .from('proof_assets')
  //   .upload(`${datasetId}/${requestId}/testfile`, file[0]);
  // if (data) {
  //   return data
  // }
}

const signUp = async ({ username, email, password }: SignUpOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })
  const { user, session } = data;

  if (user) {
    const { data: usernameData, error: usernameError } = await supabase
      .from('users')
      .insert({
        user_id: user.id,
        username: username

      })

    if (usernameError) throw error
  }

  if (error) throw error
  return { user, session }
}

const signInWithPassword = async ({ usernameOrEmail, password}: SignInWithPasswordOptions) => {
  // TODO think about whether I need to have separate sign ins
  if (!supabase) {
    return;
    // TODO error
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameOrEmail,
    password: password,
  })

  const { user, session } = data;

  if (error) throw error
  return { user, session }
}

const signOut = async () => {
  if (!supabase) {
    return;
    // TODO error
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log('error signing out')
  }

  return { error }
}
