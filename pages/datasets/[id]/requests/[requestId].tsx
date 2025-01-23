import Button, { ButtonVariant } from "@/components/common/Button";
import { SmallHero } from "@/components/common/Hero";
import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar";
import { Dataset, convertDatasetResponseToDataset } from "@/types/dataset";
import { Breadcrumb, FullRequest, convertRawRequestToFullRequest } from "@/types/request";
import { APIEndPoints, api } from "@/utils/api";
import { useUser } from "@/utils/session";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import SubmitResultModal from "../../../../components/requests/SubmitResultModal";
import ReviewResultModal from "@/components/requests/ReviewResultModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircle, faCircleCheck, faFileAlt, faUser, faWarning } from "@fortawesome/free-solid-svg-icons";
import { getVerificationKey, verifyProof } from "@/utils/ezkl";
import { generateVerifierNotebook } from "@/utils/notebook";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, requestId } = context.params as {
    id: string;
    requestId: string;
  };

  let dataset;
  let request;
  try {
    const datasetResponse = await api(APIEndPoints.GetDataset, { id });
    dataset = convertDatasetResponseToDataset(datasetResponse);

    const response = await api(APIEndPoints.GetRequest, {
      datasetId: id,
      requestId
    });
    request = convertRawRequestToFullRequest(response);
  } catch (error) {
    console.error('Failed to fetch dataset', error);
  }

  return {
    props: {
      dataset,
      request
    }
  }

}

type RequestDetailProps = {
  dataset: Dataset,
  request: FullRequest,
}

const RequestDetail = (props: RequestDetailProps) => {
  const { dataset, request } = props;
  const { ownerId } = dataset;
  const { isAccepted, isCompleted, resultApproved, username } = request;
  const [ isReviewResultModalOpen, setIsReviewResultModalOpen ] = useState<boolean>(false);
  const [ submitResultModalOpen, setSubmitResultModalOpen ] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const [statusColor, setStatusColor] = useState<string>("bg-gray-400");
  const [statusText, setStatusText] = useState<string>("Awaiting Confirmation")
  
  const user = useUser();
  const isDatasetOwner = ownerId === user?.id;

  useEffect(() => {
    if (resultApproved) {
      setStatusColor('bg-green-800');
      setStatusText('Request Completed');
      return;
    }
    if (isCompleted) {
      setStatusColor('bg-green-400');
      setStatusText('Results Ready');
      return;
    }
    if (isAccepted) {
      setStatusColor('bg-yellow-400 text-gray-900');
      setStatusText('Confirmed, Awaiting Results');
    } 

  }, [isCompleted, isAccepted, resultApproved])

  const onVerifierNotebookDownload = async () => {
    const notebook = await generateVerifierNotebook(request.code);
    const notebookBlob = new Blob([notebook], { type: 'application/x-ipynb+json' });
    const url = URL.createObjectURL(notebookBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'verifier.ipynb';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const breadcrumb: Array<Breadcrumb> = [{
    label: dataset.title,
    href: `/datasets/${dataset.id}`
  }]

  const onAcceptResult = async () => {
    await api(APIEndPoints.ApproveResult, { requestId: request.id });
    setIsReviewResultModalOpen(false);
    window.location.reload();
  }

  const onAcceptRequest = async () => {
    await api(APIEndPoints.AcceptRequest, { requestId: request.id })
   // setRequest(data);
   window.location.reload();
  }

  const onNotebookDownload = async () => {
    try {
      await api(APIEndPoints.DownloadComputationNotebook, { requestId: request.id });
    }
    catch (error) {
      const data = await api(APIEndPoints.UploadNotebook, {
        requestId: request.id,
        code: request.code
      })
      if (data) {
        await api(APIEndPoints.DownloadComputationNotebook, { requestId: request.id });
      }
    }
  }

  const onSubmitResult = async ({
    result,
    proofFile,
    precalWitnessFile,
    settingsFile
  }: onSubmitResultArgs) => {

    if (proofFile && precalWitnessFile && settingsFile) {
      try {
        await api(APIEndPoints.UploadProofAndAssets, {
          datasetId: dataset.id,
          requestId: request.id,
          proofFile,
          precalWitnessFile,
          settingsFile
        }).then((data) => {
          return api(APIEndPoints.SubmitRequestResult, {
            requestId: request.id,
            result,
          })
        })
        setSubmitResultModalOpen(false);
        window.location.reload();
      } catch (error) {
        console.error('Error uploading files:', error);
        // You might want to show an error message to the user here
      }
    } else {
      console.error('Missing required files');
      // You might want to show an error message to the user here
    }
  } 

  const onVerifyResult = async () => {
    setIsVerifying(true);
    setVerificationError(null);
    
    try {
      // Download necessary files
      const proofFile = await api(APIEndPoints.DownloadProofAndAssets, {
        datasetId: dataset.id,
        requestId: request.id,
        file: 'proof'
      });
      const settingsFile = await api(APIEndPoints.DownloadProofAndAssets, {
        datasetId: dataset.id,
        requestId: request.id,
        file: 'settings'
      });
      const precalWitnessFile = await api(APIEndPoints.DownloadProofAndAssets, {
        datasetId: dataset.id,
        requestId: request.id,
        file: 'precal'
      });

      // Parse the settings file to get the shape and computation
      const settings = settingsFile ? JSON.parse(await settingsFile.text()) : null;
      if (!settings) {
        throw new Error('Settings file is undefined or empty');
      }
      const shape = {
        x: dataset.columns?.toString() || '',
        y: dataset.rows?.toString()  || ''
      }
      //const computation = request.code;

      const computation = request.code
      .replace(/<[^>]*>/g, '')
      .normalize('NFKD')
      .replace(/[\u0080-\uFFFF]/g, '')
      // Ensure string doesn't start with hyphen
      .replace(/^-/, '_');

      // Parse the precal witness file
      const precalWitness = JSON.parse(await precalWitnessFile.text());

      // Get the verification key
      const verificationKey = shape.x && shape.y && computation && precalWitness ?
        await getVerificationKey(shape, computation, precalWitness, settings) : null;

      // Convert verification key to ArrayBuffer
      const verificationKeyBuffer = new TextEncoder().encode(JSON.stringify(verificationKey));

      // Verify the proof
      const srsPath = ''; //TODO we need to get the srs path from the proof
      const result = await verifyProof(
        URL.createObjectURL(proofFile),
        URL.createObjectURL(settingsFile),
        URL.createObjectURL(new Blob([verificationKeyBuffer])),
        srsPath
      );

      if (result) {
        console.log('Proof verified successfully');
        // TODO: Show success message to user
      } else {
        throw new Error('Proof verification failed');
      }
    } catch (error) {
      console.error('Error verifying proof:', error);
      setVerificationError(error instanceof Error ? error.message : 'Failed to verify proof');
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div>
 
      <NavBar />
      <SmallHero header={
        <div className="flex gap-4 items-center">
          { request.title }
          <div
            className={`text-sm ${statusColor} rounded px-2 text-white inline-block`}
          >
            {statusText}
          </div>
        </div>
      } subheader={ request.description } breadcrumb={breadcrumb}/>
      {isReviewResultModalOpen &&
        <ReviewResultModal onClose={() => setIsReviewResultModalOpen(false)} onAccept={onAcceptResult} result={request.result}/>
      }
      {submitResultModalOpen &&
        <SubmitResultModal onClose={() => setSubmitResultModalOpen(false)} onSubmit={onSubmitResult}/>
      }
      <Layout>
        <div className="my-4">
        {isDatasetOwner

           ? <OwnerActionBar request={request} datasetId={dataset.id}/>
           : <ConsumerActionBar request={request} />
        }
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-row w-full gap-4">
          
          {isCompleted &&
          <div className="flex flex-col bg-gray-50 border-1 border-gray-200 rounded my-4 p-4 text-indigo-800 w-2/3">
              <div className="flex items-center font-bold text-lg">
                {isDatasetOwner ? 'Submitted Result' : 'Result'} {request.resultApproved ? <span className="text-xs text-green-900">&nbsp;<FontAwesomeIcon icon={faCheckCircle} /> (Verified)</span> : ""}
              </div>
            <div className="bg-gray-100 rounded text-sm font-light p-2">
              {request.result}
            </div>
            {verificationError && (
                <div className="text-red-500 text-sm mt-2">
                  <FontAwesomeIcon icon={faWarning} className="mr-2" />
                  {verificationError}
                </div>
              )}
            <div className="flex mt-4 gap-2">
              <Button
                variant={ButtonVariant.PRIMARY}
                onClick={onVerifyResult}
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify Result'}
              </Button>
              
              {!isDatasetOwner &&
              <Button
                variant={ButtonVariant.QUARTERY}
                onClick={() => setIsReviewResultModalOpen(true)}
              >
                Review Result
              </Button>
              }
              <Button 
                disabled={!request.isCompleted} 
                variant={request.isCompleted ? ButtonVariant.QUARTERY : ButtonVariant.DISABLED}
                onClick={onVerifierNotebookDownload}
              >Download Verification Notebook</Button>
            </div>
          </div>
          }
          {isCompleted &&
          <div className="w-1/3">
            <CryptographicAssets datasetId={dataset.id} requestId={request.id} resultReady={request.isCompleted}/>
          </div>
          }
          </div>
         
          <div className="bg-gray-50 border-1 border-gray-200 rounded my-4 p-4">
            <div className="text-lg font-bold text-indigo-800 my-2">
            Request Code
            </div>
            <div className="bg-gray-100 rounded text-sm font-light p-6 font-mono whitespace-pre-line text-gray-800 border-1 border-gray-200">
              {request.code}
            </div>
            <div className="flex gap-2 mt-4 mb-2">
            {(isDatasetOwner && !isAccepted) &&
            <div>
              <Button
                variant={ButtonVariant.QUARTERY}
                onClick={onAcceptRequest}
              >
                Accept Computation Request
              </Button>
            </div>
            }
            {(isDatasetOwner && isAccepted && !isCompleted) &&
            <div>
              <Button
                variant={ButtonVariant.QUARTERY}
                onClick={() => setSubmitResultModalOpen(true)}
              >
                Submit Result
              </Button>
            </div>
            }
            <div>
              <Button
                onClick={onNotebookDownload}
                variant={ButtonVariant.QUARTERY}
              >Download Jupyter Notebook</Button>
            </div>
          </div>
          
        </div>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
              window.location.href = `/user/${user?.id}`
            }}>
              <span className="fa-layers fa-fw h-6 w-6" style={{ backgroundColor: 'transparent' }}>
                  <FontAwesomeIcon icon={faCircle} size="2x" className="text-white mx-auto w-full"/>
                  <FontAwesomeIcon icon={faUser} className="text-gray-800 mx-auto w-full"/>
              </span>
              <span className="text-gray-600 text-sm">{username}</span>
            </div>
        </div>
      </Layout>
    </div>
  )
}

type ActionBarProps = {
  request: FullRequest;
  datasetId?: string;
}

type onSubmitResultArgs = {
  result: string;
  proofFile: File | null, // TODO remove null
  precalWitnessFile: File | null, // TODO remove null
  settingsFile: File | null, // TODO remove null
}

const OwnerActionBar = (props: ActionBarProps) => {
  const { datasetId, request: initialRequest } = props;
  const [ request, setRequest ] = useState<FullRequest>(initialRequest);
  const { isAccepted, isCompleted, resultApproved } = request;
  const [ submitResultModalOpen, setSubmitResultModalOpen ] = useState<boolean>(false);

  const onAcceptRequest = async () => {
    const { data, error} = await api(APIEndPoints.AcceptRequest, { requestId: request.id })
    if (error) {
      return;
      // TODO handle error
    }
    setRequest(data);
  }


  // TODO in the middle of changing this function to take all the file, upload, and extract
  // results automatically

  // TODO don't upload srsFile, make them select from a list

  const onSubmitResult = async ({
    result,
    proofFile,
    precalWitnessFile,
    settingsFile
  }: onSubmitResultArgs) => {


    if ( proofFile && precalWitnessFile && settingsFile ) {
  
      await api(APIEndPoints.UploadProofAndAssets, {
        datasetId,
        requestId: request.id,
        proofFile,
        precalWitnessFile,
        settingsFile
      }).then((data) => {
        api(APIEndPoints.SubmitRequestResult, {
          requestId: request.id,
          result,
        })
      })
    } else {
      // TODO handle errors
    }
    setSubmitResultModalOpen(false);
    window.location.reload();
  } 

  return (
    <div>
      {submitResultModalOpen &&
        <SubmitResultModal onClose={() => setSubmitResultModalOpen(false)} onSubmit={onSubmitResult}/>
      }
      {!isAccepted &&
      <div className="flex w-full rounded-lg bg-gray-500 py-8 px-6 text-stone-50">
        This computation request is awaiting your review.
      </div>
      }
      {(isAccepted && !isCompleted) &&
      <div className="flex w-full rounded-lg bg-yellow-400 py-8 px-6 text-stone-50 font-bold">
        You have accepted this computation request. Please download the Jupyter Notebook and follow the instructions to run the computation.
      </div>
      }
      {(isCompleted && !resultApproved) &&
      <div className="flex w-full rounded-lg bg-green-400 py-8 px-6 text-stone-50 font-bold">
        You submitted the result for this computation and are currently awaiting verification.
      </div>
      }
      {(resultApproved) &&
      <div className="flex w-full rounded-lg bg-green-800 py-8 px-6 text-stone-50 font-bold">
        This request has been completed.
      </div>
      }
    </div>
  )
}

const ConsumerActionBar = (props: ActionBarProps) => {
  const { request } = props;
  const { isCompleted, isAccepted, resultApproved } = request;
  const [ isReviewResultModalOpen, setIsReviewResultModalOpen ] = useState<boolean>(false);

  const onNotebookDownload = async () => {
    try {
      await api(APIEndPoints.DownloadComputationNotebook, { requestId: request.id });
    }
    catch (error) {
      const data = await api(APIEndPoints.UploadNotebook, {
        requestId: request.id,
        code: request.code
      })
      if (data) {
        await api(APIEndPoints.DownloadComputationNotebook, { requestId: request.id });
      }
    }
  }

  const onAcceptResult = async () => {
    await api(APIEndPoints.ApproveResult, { requestId: request.id });
    setIsReviewResultModalOpen(false);
    window.location.reload();
  }

  return (
    <div
      className="flex gap-4"
    >
      {!isAccepted &&
      <div className="flex w-full rounded-lg bg-gray-500 py-8 px-6 text-stone-50">
        The owner of this dataset has not reviewed this request yet.
      </div>
      }
      {(isAccepted && !isCompleted) &&
      <div className="flex w-full rounded-lg bg-yellow-400 py-8 px-6 text-gray-900 font-bold">
        This request has been accepted by the dataset owner. The result and proof will be uploaded here later.
      </div>
      }
      {(isCompleted && !resultApproved) &&
      <div className="flex w-full rounded-lg bg-green-400 py-8 px-6 text-gray-50 font-bold items-center gap-2">
        <FontAwesomeIcon icon={faCircleCheck} /> This dataset owner has submitted the result and is awaiting a review.
      </div>
      }
      {resultApproved &&
      <div className="flex w-full rounded-lg bg-green-800 py-8 px-6 text-gray-50 font-bold items-center gap-2">
        <FontAwesomeIcon icon={faCircleCheck} /> This request has been completed.
      </div>
      }
      {isReviewResultModalOpen &&
        <ReviewResultModal onClose={() => setIsReviewResultModalOpen(false)} onAccept={onAcceptResult} result={request.result}/>
      }
      {/* {isCompleted &&
      <>
        <div>
          <Button
            onClick={() => setIsReviewResultModalOpen(true)}
          >Review Result</Button>
        </div>
        <div>
          <Button
            onClick={onVerifierNotebookDownload}
          >
            Download Verification Notebook
          </Button>
        </div>
      </>
      } */}
    </div>
  )
}

type CryptographicAssetsProps = {
  datasetId: string;
  requestId: string;
  resultReady?: boolean;
}

const CryptographicAssets = ({ datasetId, requestId, resultReady = true } : CryptographicAssetsProps) => {
  const [ doesDataCommitmentExist, setDoesDataCommitmentExist ] = useState<boolean | null>(null);
  const [ doesProofExist, setDoesProofExist ] = useState<boolean | null>(null);
  const [ doesPrecalWitnessExist, setDoesPrecalWitnessExist ] = useState<boolean | null>(null);
  const [ doSettingsExist, setDoSettingsExist ] = useState<boolean | null>(null);
  useEffect(() => {
    api(APIEndPoints.CheckFileExists, {
      bucketName: 'proof_assets',
      filePath: `${datasetId}`,
      fileName: 'data_commitment.json'
   }).then(result => setDoesDataCommitmentExist(result))
   api(APIEndPoints.CheckFileExists, {
    bucketName: 'proof_assets',
    filePath: `${datasetId}/${requestId}`,
    fileName: 'model.pf'
   }).then(result => setDoesProofExist(result))
   api(APIEndPoints.CheckFileExists, {
    bucketName: 'proof_assets',
    filePath: `${datasetId}/${requestId}`,
    fileName: 'precal_witness.json'
   }).then(result => setDoesPrecalWitnessExist(result))
   api(APIEndPoints.CheckFileExists, {
    bucketName: 'proof_assets',
    filePath: `${datasetId}/${requestId}`,
    fileName: 'settings.json'
   }).then(result => setDoSettingsExist(result))
  })
  return (
    <div className="bg-gray-50 border-1 border-gray-200 rounded my-4 p-4">
      <div className="text-lg font-bold text-indigo-800 my-2">
        Cryptographic Assets
      </div>
      {resultReady ? (
      <div className="flex flex-col">
        {doesDataCommitmentExist
        ? <div 
          className="hover:cursor-pointer"
          onClick={() => api(APIEndPoints.DownloadDataCommitment, { datasetId })}><FontAwesomeIcon icon={faFileAlt}
        /> Data Commitment</div>
        : <div>
            {doesDataCommitmentExist === null
              ? <span><FontAwesomeIcon icon={faFileAlt} /> Checking...</span>
              : <span className="text-red-400"><FontAwesomeIcon icon={faWarning} /> Missing data commitment</span>}
          </div>
        }
        {doesProofExist
        ? <div
          className="hover:cursor-pointer"
          onClick={() => api(APIEndPoints.DownloadProofAndAssets, {datasetId, requestId, file: 'proof'})}
        ><FontAwesomeIcon icon={faFileAlt} /> Proof</div>
        : <div>
            {doesProofExist === null
              ? <span><FontAwesomeIcon icon={faFileAlt} /> Checking...</span>
              : <span className="text-red-400"><FontAwesomeIcon icon={faWarning} /> Missing proof</span>}
          </div>
        }
        {doesPrecalWitnessExist
        ? <div
          className="hover:cursor-pointer"
          onClick={() => api(APIEndPoints.DownloadProofAndAssets, {datasetId, requestId, file: 'precal'})}
        ><FontAwesomeIcon icon={faFileAlt} /> Precal witness</div>
        : <div>
            {doesPrecalWitnessExist === null
              ? <span><FontAwesomeIcon icon={faFileAlt} /> Checking...</span>
              : <span className="text-red-400"><FontAwesomeIcon icon={faWarning} /> Missing precal witness</span>}
          </div>
        }
        {doSettingsExist
        ? <div
          className="hover:cursor-pointer"
          onClick={() => api(APIEndPoints.DownloadProofAndAssets, {datasetId, requestId, file: 'settings'})}
        ><FontAwesomeIcon icon={faFileAlt} /> Settings</div>
        : <div>
            {doSettingsExist === null
              ? <span><FontAwesomeIcon icon={faFileAlt} /> Checking...</span>
              : <span className="text-red-400"><FontAwesomeIcon icon={faWarning} /> Missing settings</span>}
          </div>
        }
      </div>
      )
      : (
        <div>
          Awaiting Results.
        </div>
      )
    }
    </div>
  )
}


export default RequestDetail;
