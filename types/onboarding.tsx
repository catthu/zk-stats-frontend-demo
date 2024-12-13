import Button from "@/components/common/Button";
import { FormFile } from "@/components/common/Form";
import AddDatasetForm from "@/components/datasets/AddDatasetForm";
import DataCommitmentBrowser from "@/components/datasets/DataCommitmentBrowser";
import DataCommitmentNotebook from "@/components/datasets/DataCommitmentNotebook";
import DataCommitmentSection, { GenerateDataCommitmentOptions } from "@/components/datasets/DataCommitmentSection";
import CreateOwnerOnboardingDataset from "@/pages/onboarding/owner/CreateOwnerOnboardingDataset";
import { api, APIEndPoints } from "@/utils/api";
import { generateDataCommitment, initialize } from "@/utils/ezkl";

export type OnboardingProgram = {
  id: string;
  title: string;
  description: string;
  stages: OnboardingStage[];
};

export type OnboardingStage = {
  id: string;
  title: string;
  description: string;
  steps: OnboardingStep[];
};

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  cta?: {
    label: string;
    onClick?: () => void;
  };
};

// TODO: new user db entry for current onboarding step

export const OwnerOnboarding: OnboardingProgram = {
  id: "owner-onboarding",
  title: 'Data Owner Onboarding',
  description: 'How to use the platform as a data owner',
  stages: [
    {
      id: "overview",
      title: "Overview",
      description: "Being a zero-knowledge dataset owner on the platform",
      steps: [
        {
          id: "intro",
          title: "Offer your data for computation",
          description: "What you can do when offering your data for computation",
          content: (
            <>
              <p>This section will walk you through the process of adding your dataset to our zero-knowledge dataset platform.</p>
              <h2 className="text-xl font-semibold mt-4 mb-2">Why add your dataset?</h2>
              <p>Adding your dataset to our platform allows you to offer your data for computation without sharing your data. This means other people, with your permission, can double check your analyses, satisfy their curiosity, or use the insights from your data in their projects.</p>
              <h2 className="text-xl font-semibold mt-4 mb-2">Do I have to share my data?</h2>
              <p>No, your data isn't shared with the computation requesters or the platform. Your data remains on your local machine. Computations are run locally and only the output and proof of execution are shared.</p>
              <h2 className="text-xl font-semibold mt-4 mb-2">How does zero-knowledge computing work?</h2>
              <p>Zero-knowledge computing uses cryptographic techniques to produce proof that you have run specific steps of computation on a pre-committed dataset. The proof does not reveal your data, it only confirms that the computation has been executed correctly and what the result is.</p>
            </>
          ),
          cta: {
            label: "Get started",
          }
        },
      ]
    },
    {
      id: "add-dataset",
      title: 'Add a Dataset',
      description: 'Adding a dataset to the platform',
      steps: [
        {
          id: "title-description",
          title: 'Title and description',
          description: 'Create and add a title, description, and tags to your dataset.',
          content: (
            <>
            <div className="w-full flex flex-col gap-4">
              <h2 className="text-xl font-semibold mt-4 mb-2">
                Download the demo dataset
              </h2>
              <p>
                We prepared a sample dataset to guide you through the process of adding a dataset to the platform.
              </p>
              <p>
                First, download the dataset using the button below.
              </p>
              <div className="flex justify-start">
              <Button
                onClick={async () => {
                  const res = await api(APIEndPoints.DownloadDemoDataset);
                  console.log('res', res);
                  const blob = new Blob([res], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'world_population.csv';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                }}
              >
                Download dataset
              </Button>
              </div>
            </div>
            <h2 className="text-xl font-semibold mt-4 mb-2">
              Fill out the title and description
            </h2>
            <div>
              The demo dataset contains world population data for selected years. A title and description have been added for you.
            </div>
            <CreateOwnerOnboardingDataset />
            </>
          ),
          cta: {
            label: "Next",
          }
        },
        {
          id: "data-commitment",
          title: 'Data commitment',
          description: 'Upload the data commitment to the platform.',
          content: (
            <div className="w-full flex flex-col gap-4">
              <p>
              Although your data is not shared with the platform or the computation requesters, we want to make sure that the data you run computations on is the "real" data promised.
              </p>
              <p>
                This is done through a cryptographic data commitment. The commitment is uploaded when the dataset is created, and validated when the dataset is subsequently used in a computation.
              </p>
              <p>
                Generating data commitment is easily done using this platform's client side code, or completely locally with a Jupyter Notebook.
              </p>
              <h2 className="text-xl font-semibold mt-4 mb-2">
                Generating data commitment in-browser
              </h2>
              <p>
                The easiest way to generate the data commitment is our in-browser platform code, by selecting your data using the button below. The platform does not store your data or send it to any
                third party. However, your browser could be compromised other ways, such as by malicious extensions.
              </p>
              <DataCommitmentBrowser onFileChange={() => {}} />
              <h2 className="text-xl font-semibold mt-4 mb-2">
                Generating data commitment locally with Jupyter Notebook
              </h2>
              <p>
                The most secure way to generate the data commitment is using our Jupyter Notebook.
              </p>
              <DataCommitmentNotebook onFileChange={() => {}} downloadDataCommitmentNotebook={() => {}} />
              <hr />
              Once you've explored both methods, move on to the next step.
            </div>
            
          ),
          cta: {
            label: "Next",
          }
        },
        {
          id: "data-schema",
          title: 'Upload the data schema',
          description: 'Upload the data schema to the platform.',
          content: <div>Content for step 3</div>
        }
      ]
    },
    {
      id: "requests",
      title: 'Review Computation Requests',
      description: 'Create a request to start onboarding your customers.',
      steps: [
        {
          id: "review-requests",
          title: 'Review incoming requests',
          description: 'Review the computation requests for your dataset.',
          content: <div>Content for step 1</div>
        }
      ]
    },
    {
      id: "fulfill-requests",
      title: 'Fulfill Computation Requests',
      description: 'Fulfill computation requests from your customers.',
      steps: [
        {
          id: "download-notebook",
          title: 'Download the request notebook',
          description: 'Download the request notebook to fulfill the computation request.',
          content: <div>Content for step 1</div>
        },
        {
          id: "execute-notebook",
          title: 'Execute the notebook',
          description: 'Execute the notebook to fulfill the computation request.',
          content: <div>Content for step 2</div>
        }
      ]
    }
  ]
};
