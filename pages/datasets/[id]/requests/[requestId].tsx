import Button, { ButtonVariant } from "@/components/common/Button";
import Hero from "@/components/common/Hero";
import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar";
import { Dataset, convertDatasetResponseToDataset } from "@/types/dataset";
import { FullRequest, convertRawRequestToFullRequest } from "@/types/request";
import { APIEndPoints, api } from "@/utils/api";
import { useUser } from "@/utils/session";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import SubmitResultModal from "../../../../components/requests/SubmitResultModal";
import ReviewResultModal from "@/components/requests/ReviewResultModal";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, requestId } = context.params as {
    id: string;
    requestId: string;
  };

  let dataset;
  let request;
  try {
    const datasetResponse = await api(APIEndPoints.GetDataset, { id });
    dataset = convertDatasetResponseToDataset(datasetResponse[0]);

    const response = await api(APIEndPoints.GetRequest, {
      datasetId: id,
      requestId
    });
    request = convertRawRequestToFullRequest(response[0]);
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
  const { id, title, description, testDataUrl, sourceDescription, acknowledgement, ownerId } = dataset;
  const { isAccepted, isCompleted } = request;

  const [statusColor, setStatusColor] = useState<string>("bg-gray-400");
  const [statusText, setStatusText] = useState<string>("Awaiting Confirmation")
  
  const user = useUser();
  const isDatasetOwner = ownerId === user?.id;

  useEffect(() => {
    if (isCompleted) {
      setStatusColor('bg-green-400');
      setStatusText('Results Ready');
      return;
    }
    if (isAccepted) {
      setStatusColor('bg-yellow-400');
      setStatusText('Confirmed, Awaiting Results');
    } 
  }, [isCompleted, isAccepted])

  const onNotebookDownload = async () => {
    try {
      await api(APIEndPoints.DownloadNotebook, { requestId: request.id });
    }
    catch (error) {
      const data = await api(APIEndPoints.UploadNotebook, {
        requestId: request.id,
        code: request.code
      })
      if (data) {
        await api(APIEndPoints.DownloadNotebook, { requestId: request.id });
      }
    }
  }



  return (
    <div>
 
      <NavBar />
      <Hero header={ title } subheader={ description }/>
      <Layout>
        <div className="text-2xl font-bold">
          Request: {request.title}
          <div>
            <div
              className={`text-sm ${statusColor} rounded px-2 text-white inline-block`}
            >
              {statusText}
            </div>
          </div>
        </div>
        <div className="my-4">
        {isDatasetOwner

           ? <OwnerActionBar request={request} datasetId={dataset.id}/>
           : <ConsumerActionBar request={request} />
        }
        </div>
        <div className="flex flex-row w-full gap-4">
          <div className="flex-grow">
          <div className="bg-gray-200 rounded my-4 p-4">
            <div className="text-lg font-bold">
            Request Code
            <div className="bg-gray-100 rounded text-sm font-light p-2 font-mono whitespace-pre-line">
              {request.code}
            </div>
            </div>
          </div>
          <div className="flex flex-col bg-gray-200 rounded my-4 p-4">
            <div className="text-lg font-bold">
            {isDatasetOwner ? 'Submitted Result' : 'Result'}
            <div className="bg-gray-100 rounded text-sm font-light p-2">
              {request.result}
            </div>
            <div className="my-4">
              <Button 
                disabled={!request.isCompleted} 
                variant={request.isCompleted ? ButtonVariant.PRIMARY : ButtonVariant.DISABLED}
              >Verify Computation</Button>
            </div>
            </div>
          </div>
          </div>
          <div className="w-1/4">
            <CryptographicAssets requestId={request.id} resultReady={request.isCompleted}/>
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
  proofFile: File | null, // TODO remove null
  vkFile: File | null, // TODO remove null
  modelOnnxFile: File | null, // TODO remove null
  srsFile: File | null, // TODO remove null
  settingsFile: File | null, // TODO remove null
}

const extractResult = (proofFile: File) => {
  return;
}

const OwnerActionBar = (props: ActionBarProps) => {
  const { datasetId, request: initialRequest } = props;
  const [ request, setRequest ] = useState<FullRequest>(initialRequest);
  const { isAccepted } = request;
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
    proofFile,
    vkFile,
    modelOnnxFile,
    srsFile,
    settingsFile
  }: onSubmitResultArgs) => {
    // TODO extract results instead (and maybe upload?? or don't??)
    // await api(APIEndPoints.SubmitRequestResult, { requestId: request.id, result })

    if ( proofFile && vkFile && modelOnnxFile && srsFile && settingsFile ) {
  
      await api(APIEndPoints.UploadProofAndAssets, {
        datasetId,
        requestId: request.id,
        proofFile,
        vkFile,
        modelOnnxFile,
        srsFile,
        settingsFile
      })
    } else {
      // TODO handle errors
    }
    setSubmitResultModalOpen(false);
  } 

  const onNotebookDownload = async () => {
    try {
      await api(APIEndPoints.DownloadNotebook, { requestId: request.id });
    }
    catch (error) {
      const data = await api(APIEndPoints.UploadNotebook, {
        requestId: request.id,
        code: request.code
      })
      if (data) {
        await api(APIEndPoints.DownloadNotebook, { requestId: request.id });
      }
    }
  }

  return (
    <div>
      {submitResultModalOpen &&
        <SubmitResultModal onClose={() => setSubmitResultModalOpen(false)} onSubmit={onSubmitResult}/>
      }
      <div
        className="flex gap-4"
      >
        {!isAccepted &&
          <div>
            <Button
              onClick={onAcceptRequest}
            >
              Accept Computation Request
            </Button>
          </div>
          }
        {isAccepted &&
          <div>
            <Button
              onClick={() => setSubmitResultModalOpen(true)}
            >Submit Result</Button>
          </div>
        }
        <div>
          <Button
            onClick={onNotebookDownload}
            variant={ButtonVariant.SECONDARY}
          >Download Jupyter Notebook</Button>
        </div>
      </div>
    </div>
  )
}

const ConsumerActionBar = (props: ActionBarProps) => {
  const { request } = props;
  const { isCompleted } = request;
  const [ isReviewResultModalOpen, setIsReviewResultModalOpen ] = useState<boolean>(false);

  const onNotebookDownload = async () => {
    try {
      await api(APIEndPoints.DownloadNotebook, { requestId: request.id });
    }
    catch (error) {
      const data = await api(APIEndPoints.UploadNotebook, {
        requestId: request.id,
        code: request.code
      })
      if (data) {
        await api(APIEndPoints.DownloadNotebook, { requestId: request.id });
      }
    }
  }

  const onAcceptResult = () => {

  }

  const onClickVerifyComputation = () => {

  }

  return (
    <div
      className="flex gap-4"
    >
      {isReviewResultModalOpen &&
        <ReviewResultModal onClose={() => setIsReviewResultModalOpen(false)} onAccept={onAcceptResult} result={request.result}/>
      }
      {isCompleted &&
      <>
        <div>
          <Button
            onClick={() => setIsReviewResultModalOpen(true)}
          >Review Result</Button>
        </div>
        <div>
          <Button
            onClick={onClickVerifyComputation}
          >
            Verify Computation
          </Button>
        </div>
      </>
      }
      <div>
        <Button
          onClick={onNotebookDownload}
          variant={ButtonVariant.SECONDARY}
        >Download Jupyter Notebook</Button>
      </div>
    </div>
  )
}

type CryptographicAssetsProps = {
  requestId: string;
  resultReady?: boolean;
}

const CryptographicAssets = ({ requestId, resultReady = true } : CryptographicAssetsProps) => {
  return (
    <div className="bg-gray-200 rounded my-4 p-4">
      <div className="text-lg font-bold">
        Cryptographic Assets
      </div>
      {resultReady ? (
      <div className="flex flex-col">
        <Link href=""><FontAwesomeIcon icon={faFileAlt} /> Proof</Link>
        <Link href=""><FontAwesomeIcon icon={faFileAlt} /> Verification Key</Link>
        <Link href=""><FontAwesomeIcon icon={faFileAlt} /> Model Onnx</Link>
        <Link href=""><FontAwesomeIcon icon={faFileAlt} /> Srs</Link>
        <Link href=""><FontAwesomeIcon icon={faFileAlt} /> Settings</Link>
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
