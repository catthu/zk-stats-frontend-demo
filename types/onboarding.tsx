import Button from "@/components/common/Button";
import { FormTextArea } from "@/components/common/Form";
import DataCommitmentBrowser from "@/components/datasets/DataCommitmentBrowser";
import DataCommitmentNotebook from "@/components/datasets/DataCommitmentNotebook";
import CreateOwnerOnboardingDataset from "@/pages/onboarding/owner/CreateOwnerOnboardingDataset";
import { api, APIEndPoints } from "@/utils/api";

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

const schema = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "title": "Country Population Data",
  "description": "Schema for country population data including rank, code, population, and more.",
  "items": {
    "type": "object",
    "properties": {
      "Rank": {
        "type": "integer",
        "description": "Global rank of the country or territory based on population."
      },
      "CCA3": {
        "type": "string",
        "description": "Three-letter country code."
      },
      "Country/Territory": {
        "type": "string",
        "description": "Name of the country or territory."
      },
      "Capital": {
        "type": "string",
        "description": "Capital city of the country."
      },
      "Continent": {
        "type": "string",
        "description": "Continent where the country is located."
      },
      "2022 Population": {
        "type": "integer",
        "description": "Population in the year 2022."
      },
      "2020 Population": {
        "type": "integer",
        "description": "Population in the year 2020."
      },
      "2015 Population": {
        "type": "integer",
        "description": "Population in the year 2015."
      },
      "2010 Population": {
        "type": "integer",
        "description": "Population in the year 2010."
      },
      "2000 Population": {
        "type": "integer",
        "description": "Population in the year 2000."
      },
      "1990 Population": {
        "type": "integer",
        "description": "Population in the year 1990."
      },
      "1980 Population": {
        "type": "integer",
        "description": "Population in the year 1980."
      },
      "1970 Population": {
        "type": "integer",
        "description": "Population in the year 1970."
      },
      "Area (km²)": {
        "type": "integer",
        "description": "Total area of the country in square kilometers."
      },
      "Density (per km²)": {
        "type": "number",
        "description": "Population density per square kilometer."
      },
      "Growth Rate": {
        "type": "number",
        "description": "Annual population growth rate as a percentage."
      },
      "World Population Percentage": {
        "type": "number",
        "description": "Percentage of the world's population represented by this country."
      }
    },
    "required": [
      "Rank",
      "CCA3",
      "Country/Territory",
      "Capital",
      "Continent",
      "2022 Population",
      "Area (km²)",
      "Density (per km²)",
      "Growth Rate",
      "World Population Percentage"
    ]
  }
}`

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
              <DataCommitmentBrowser 
                onFileChange={() => {}}
                onGenerateComplete={(content: string) => {
                    try {
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'data_commitment.txt';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Error downloading data commitment:', error);
                    }
                }}
              />
              <h2 className="text-xl font-semibold mt-4 mb-2">
                Generating data commitment locally with Jupyter Notebook
              </h2>
              <p>
                The most secure way to generate the data commitment is using our Jupyter Notebook.
              </p>
              <DataCommitmentNotebook 
                onFileChange={() => {}} 
                downloadDataCommitmentNotebook={() => {
                  const link = document.createElement('a');
                  link.href = '/templates/generate_data_commitment.ipynb';
                  link.download = 'generate_data_commitment.ipynb';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }} 
              />
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
          content: (<div className="w-full flex flex-col gap-4">
            <p>Data consumers need to understand the structure of your data to be able to use it in their computations.</p>
            <p>We use JSON Schema to describe the structure of your data. You can read more about the schema format <a href="https://json-schema.org/" target="_blank" rel="noopener noreferrer">here</a>.</p>
            <p>When creating a dataset, or any time after, you can upload the JSON schema file, or copy the schema into a text box. We have generated a schema for this dataset for you in the text box below.</p>
            <FormTextArea
              value={schema}
              onChange={() => {}}
              disabled={true}
              className="!h-[800px] resize-none overflow-y-auto border-2 border-red-500"
              style={{ height: '800px' }}
            />
            <p>And that's all you need to add a dataset!</p>
          </div>
          ),
          cta: {
            label: "Complete",
          }
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
          content: <div className="w-full flex flex-col gap-4">
            <p>Once your dataset is visible on the platform, other users may want to explore it further by sending computations to run on your data. You can review these requests and accept or reject them.</p>
            <p>The next section of this guide will be coming soon, stay tune!</p>
          </div>
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
