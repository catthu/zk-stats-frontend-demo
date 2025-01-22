// API call preprocessor to switch between real API calls and mock data

import useMockData from "@/mocks";
import { NewRequest } from "@/types/request";
import { createClient } from '@supabase/supabase-js'
import { generateProverNotebook } from "./notebook";
import { Schema } from "@/types/dataset";

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

  DownloadComputationNotebook = 'download_computation_notebook',
  DownloadVerificationNotebook = 'download_verification_notebook',
  UploadNotebook = 'upload_noteobook',
  AcceptRequest = 'accept_request',
  SubmitRequestResult = 'submit_request_result',
  UploadProofAndAssets = 'upload_proof_and_assets',
  DownloadProofAndAssets = 'download_proof_and_assets',
  ApproveResult = 'accept_result',

  CheckFileExists = 'check_file_exists',
  DownloadDataCommitment = 'download_data_commitment',

  SignUp = 'signup',
  SignInWithPassword = 'siginin_with_password',
  SignOut = 'signout',
  ResetPassword = 'reset_password',
  UpdateAccountSettings = 'update_account_settings',

  DownloadDemoDataset = 'download_demo_dataset',
  GetUserWithDatasetsAndRequests = 'get_user_with_datasets_and_requests',
}

type GetDatasetOptions = {
  id: string;
}

type AddDatasetOptions = {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  schema: Schema | null;
  rows?: number;
  columns?: number;
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

type DownloadComputationNotebookOptions = {
  requestId: string;
}

type DownloadVerificationNotebookOptions = {
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
  precalWitnessFile: File,
  settingsFile: File,
}

type DownloadProofAndAssetsOptions = {
  datasetId: string;
  requestId: string;
  file: 'all' | 'proof' | 'precal' | 'settings'
}

type ApproveResultOptions = {
  requestId: string; // TODO make it so that only request sender can approve
}

type CheckFileExistsOptions = {
  bucketName: string;
  filePath: string;
  fileName: string;
}

type DownloadDataCommitmentOptions = {
  datasetId: string;
}

type UpdateAccountSettingsOptions = {
  username?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
}

type ResetPasswordOptions = {
  email: string;
}

type GetUserWithDatasetsAndRequestsOptions = {
  userId: string;
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
  | DownloadComputationNotebookOptions
  | DownloadVerificationNotebookOptions
  | SubmitRequestResultOptions
  | UploadProofAndAssetsOptions
  | DownloadProofAndAssetsOptions
  | ApproveResultOptions
  | CheckFileExistsOptions
  | DownloadDataCommitmentOptions
  | UpdateAccountSettingsOptions
  | ResetPasswordOptions
  | GetUserWithDatasetsAndRequestsOptions

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
    case APIEndPoints.DownloadComputationNotebook: return downloadComputationNotebook(options as DownloadComputationNotebookOptions);
    case APIEndPoints.DownloadVerificationNotebook: return downloadVerificationNotebook(options as DownloadVerificationNotebookOptions);
    case APIEndPoints.UploadNotebook: return uploadNotebook(options as UploadNotebookOptions);
    case APIEndPoints.AcceptRequest: return acceptRequest(options as AcceptRequestOptions);
    case APIEndPoints.SubmitRequestResult: return submitRequestResult(options as SubmitRequestResultOptions);
    case APIEndPoints.UploadProofAndAssets: return uploadProofAndAssets(options as UploadProofAndAssetsOptions);
    case APIEndPoints.DownloadProofAndAssets: return downloadProofAndAssets(options as DownloadProofAndAssetsOptions);
    case APIEndPoints.ApproveResult: return approveResult(options as ApproveResultOptions);
    // Cryptographic assets
    case APIEndPoints.CheckFileExists: return checkFileExists(options as CheckFileExistsOptions);
    case APIEndPoints.DownloadDataCommitment: return downloadDataCommitment(options as DownloadDataCommitmentOptions);
    // AUTH
    case APIEndPoints.SignUp: return signUp(options as SignUpOptions);
    case APIEndPoints.SignInWithPassword: return signInWithPassword(options as SignInWithPasswordOptions);
    case APIEndPoints.SignOut: return signOut();
    // DEMO
    case APIEndPoints.DownloadDemoDataset: return downloadDemoDataset();
    case APIEndPoints.UpdateAccountSettings: return updateAccountSettings(options as UpdateAccountSettingsOptions);
    case APIEndPoints.ResetPassword: return resetPassword(options as ResetPasswordOptions);
    case APIEndPoints.GetUserWithDatasetsAndRequests: 
      return getUserWithDatasetsAndRequests(options as GetUserWithDatasetsAndRequestsOptions);
    default: return getDatasets(); // TODO not really, default should be error
  }
};

const getDataset = async (options: GetDatasetOptions) => {
  if (!supabase) {
    return;
    // TODO throw error
  }
  const { data, error } = await supabase
    .rpc('get_dataset', { dataset_id: options.id })
  
  if (data) {
    return data[0]; // Since we expect a single result
  }
  return Promise.resolve(null)
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
      schema: options.schema,
      rows: options.rows,
      columns: options.columns
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
    .rpc('get_datasets')

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
    .rpc('get_request', { 
      id: options.requestId 
    })
  
if (data) {
  return data[0]
}
}

const addRequest = async (options: NewRequest) => {
  if (!supabase) {
    return;
    // TODO error
  }

  const uuid = crypto.randomUUID();
  const notebook = await generateProverNotebook(options.code);
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

  const { data, error } = await supabase
    .rpc('get_requests', { 
      dataset_id: options.datasetId,
      user_id: options.userId || null
    })

  if (error) {
    console.error('Supabase query error:', error);
    return [];
  }
  return data || [];
}

const downloadComputationNotebook = async ({ requestId }: DownloadComputationNotebookOptions) => {
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

const downloadVerificationNotebook = async ({ requestId }: DownloadVerificationNotebookOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }

  const { data } = supabase.storage
    .from('computations')
    .getPublicUrl(`${requestId}-verification.ipynb`);

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
      anchor.download = `${requestId}-verification.ipynb`; // Set the download attribute with the desired file name
    
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

  const notebook = await generateProverNotebook(code);
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
  precalWitnessFile,
  settingsFile
}: UploadProofAndAssetsOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }

  const promises = [
    supabase.storage.from('proof_assets').upload(`${datasetId}/${requestId}/model.pf`, proofFile),
    supabase.storage.from('proof_assets').upload(`${datasetId}/${requestId}/precal_witness.json`, precalWitnessFile),
    supabase.storage.from('proof_assets').upload(`${datasetId}/${requestId}/settings.json`, settingsFile)
  ];
  // const { data, error } = await supabase.storage
  //   .from('proof_assets')
  //   .upload(`${datasetId}/${requestId}/testfile`, file[0]);
  // if (data) {
  //   return data
  // }
}

const downloadProofAndAssets = async ({
  datasetId,
  requestId,
  file
}: DownloadProofAndAssetsOptions): Promise<Blob | null> => {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return null;
  }

  const getPath = (file: 'all' | 'proof' | 'precal' | 'settings') => {
    switch (file) {
      case ('all'): return `${datasetId}/${requestId}`;
      case ('proof'): return `${datasetId}/${requestId}/model.pf`;
      case ('precal'): return `${datasetId}/${requestId}/precal_witness.json`;
      case ('settings'): return `${datasetId}/${requestId}/settings.json`;
      default: return `${datasetId}/${requestId}`;
    }
  }

  const { data } = supabase.storage
    .from('proof_assets')
    .getPublicUrl(getPath(file));

  const { publicUrl } = data;

  try {
    const response = await fetch(publicUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Download failed:', error);
    return null;
  }
}

const approveResult = async ({
  requestId,
}: ApproveResultOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }
  const { data, error } = await supabase
    .from('computations')
    .update({
      result_approved: true,
    })
    .match({
      id: requestId
    })

  if (data) {
    return data
  }
}

const checkFileExists = async({
  bucketName,
  filePath,
  fileName
}: CheckFileExistsOptions) => {

  // DO I NEED BUCKET NAME HERE?

  if (!supabase) {
    return;
    // TODO error
  }

  try {

    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list(filePath)

    if (error) {
      console.error('Error listing files:', error)
      return false
    }

    return data.some(file => file.name === fileName)
  } catch (e) {
    return false
  }

}

const downloadDataCommitment = async ({
  datasetId,
}: DownloadDataCommitmentOptions) => {
  if (!supabase) {
    return;
    // TODO error
  }

  const { data } = supabase.storage
    .from('proof_assets')
    .getPublicUrl(`${datasetId}/data_commitment.json`);

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
      anchor.download = `${datasetId}-datacommitment.json`; // Set the download attribute with the desired file name
    
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

const resetPassword = async ({ email }: ResetPasswordOptions) => {
  if (!supabase) {
    return { error: 'Database client not loaded.' };
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { data, error: null };
}


const updateAccountSettings = async ({ username, email, password, repeatPassword }: UpdateAccountSettingsOptions) => {
  if (!supabase) {
    return { error: 'Database client not loaded.' };
  }

  try {
    // Get current user data
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    if (userError || !currentUser) {
      return { error: 'No user logged in.' };
    }

    let updates = [];

    // Update email/password if provided
    if (email || password) {
      if (password && password !== repeatPassword) {
        return { error: 'Passwords do not match.' };
      }

      // TODO thse calls don't work, debug
    
      const { data, error } = await supabase.auth.updateUser({
        ...(email && { email }),
        ...(password && { password })
      });

      if (error) {
        return { error: error.message };
      }
      updates.push('auth');
    }

    // Update username if provided
    if (username) {
      const { data, error } = await supabase
        .from('users')
        .update({ username })
        .eq('user_id', currentUser.id)
        .select();

      if (error) {
        return { error: error.message };
      }
      updates.push('username');
    }

    return { data: { updated: updates }, error: null };
  } catch (error) {
    return { error: 'Failed to update account settings.' };
  }
}

const downloadDemoDataset = async () => {
  if (!supabase) {
    return;
    // TODO error
  }
  const { data } = await supabase.storage
    .from('dataset_previews')
    .getPublicUrl('onboarding/world_population.csv');

  const { publicUrl } = data;

  return fetch(publicUrl)
    .then(async response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.text();  // Return the text content
    });
}

const getUserWithDatasetsAndRequests = async ({ userId }: GetUserWithDatasetsAndRequestsOptions) => {
  if (!supabase) {
    return { error: 'Database client not loaded.' };
  }

  // Get user details
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('username, created_at')
    .eq('user_id', userId)
    .single();

  if (userError) {
    return { error: userError.message };
  }

  // Get user's datasets
  const { data: datasets, error: datasetsError } = await supabase
    .from('datasets')
    .select('*')
    .eq('owner_id', userId);

  if (datasetsError) {
    return { error: datasetsError.message };
  }

  // Get user's requests
  const { data: requests, error: requestsError } = await supabase
    .from('computations')
    .select('*')
    .eq('user_id', userId);

  if (requestsError) {
    return { error: requestsError.message };
  }

  return {
    data: {
      username: userData.username,
      created_at: userData.created_at,
      datasets: datasets || [],
      requests: requests || []
    },
    error: null
  };
}
