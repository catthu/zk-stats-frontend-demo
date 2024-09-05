import Hero, { SmallHero } from "@/components/common/Hero";
import { APIEndPoints, api } from "@/utils/api";
import { GetServerSideProps } from "next";
import { ReactNode, useEffect, useRef, useState } from "react";
import { UserRequests } from "@/components/requests/UserRequests";
import Button from "@/components/common/Button";
import { Dataset, convertDatasetResponseToDataset } from "@/types/dataset";
import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar";
import { useUser } from "@/utils/session";
import { OwnerRequests } from "@/components/requests/OwnerRequests";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faColumns, faFileAlt, faSquare, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FormFile } from "@/components/common/Form";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as {
    id: string;
  }

  let dataset;
  try {
    const response = await api(APIEndPoints.GetDataset, { id });
    dataset = convertDatasetResponseToDataset(response[0]);
  } catch (error) {
    console.error('Failed to fetch dataset', error);
  }

  return {
    props: {
      dataset,
    }
  }

}

type DatasetPageProps = {
  dataset: Dataset;
}

enum MenuTab {
  About = 'about',
  History = 'history',
  Schema = 'schema',
  Discussions = 'discussions',
  Requests = 'requests',
}

const DatasetPage = ({ dataset }: DatasetPageProps) => {
  const { id, title, description, testDataUrl, sourceDescription, acknowledgement, ownerId, schema, rows, columns } = dataset;
  const [ activeTab, setActiveTab ] = useState<MenuTab>(MenuTab.About);

  const user = useUser();

  const isOwnedByUser = ownerId === user?.id;

  return (
    <div>
      <NavBar />
      <SmallHero header={ title } subheader={ description }/>
      <DatasetMenu onTabChange={setActiveTab} activeTab={activeTab} isDatasetOwner={isOwnedByUser} />

      { activeTab === MenuTab.About && <AboutSection datasetId={id} description={description} testDataUrl={testDataUrl} sourceDescription={sourceDescription} acknowledgement={acknowledgement} isOwnedByUser={isOwnedByUser} rows={rows} columns={columns}/> }
      { activeTab === MenuTab.History && <HistorySection /> }
      { activeTab === MenuTab.Discussions && <DiscussionSection />}
      { activeTab === MenuTab.Requests && (user?.id ? <UserRequests userId={user?.id} datasetId={id} isDataOwner={isOwnedByUser} /> : "Please log in.")}
      { activeTab === MenuTab.Schema && <SchemaSection schema={schema}/>}

    </div>
  )
}

type DatasetMenuProps = {
  onTabChange: (tab: MenuTab) => void;
  activeTab?: MenuTab;
  isDatasetOwner: boolean;
};

const DatasetMenu = ({ onTabChange, activeTab, isDatasetOwner }: DatasetMenuProps) => {
  return (
    <div className="py-4">
    <div className="container mx-24 flex justify-start border-b-2">
      <DatasetMenuItemContainer 
        onClick={() => onTabChange(MenuTab.About)}
        isActive={activeTab === MenuTab.About}
      >
        About this dataset
      </DatasetMenuItemContainer>
      <DatasetMenuItemContainer
        onClick={() => onTabChange(MenuTab.History)}
        isActive={activeTab === MenuTab.History}
      >
        History
      </DatasetMenuItemContainer>
      <DatasetMenuItemContainer
        onClick={() => onTabChange(MenuTab.Schema)}
        isActive={activeTab === MenuTab.Schema}
      >
        Schema
      </DatasetMenuItemContainer>
      <DatasetMenuItemContainer
        onClick={() => onTabChange(MenuTab.Discussions)}
        isActive={activeTab === MenuTab.Discussions}
      >
        Discussions
      </DatasetMenuItemContainer>
      <DatasetMenuItemContainer
        onClick={() => onTabChange(MenuTab.Requests)}
        isActive={activeTab === MenuTab.Requests}
      >
        {isDatasetOwner ? 'Active Requests' : 'Your Requests'}
      </DatasetMenuItemContainer>
    </div>
    </div>
  )
}

type DatasetMenuItemContainerProps = {
  children: ReactNode,
  onClick: VoidFunction,
  isActive: boolean
}

const DatasetMenuItemContainer = ({ children, onClick, isActive = false }: DatasetMenuItemContainerProps) => {
  return (
    <div className={`${isActive ? 'text-indigo-700 font-bold border-indigo-700 border-b-2' : 'text-gray-500 hover:text-gray-700'} relative hover:cursor-pointer mr-12 py-4 `}
        onClick={onClick}
      >
        { children }
    </div>
  )
}

type DatasetSectionProps = {
  title?: string;
  content : string;
}

const DatasetSection = (props: DatasetSectionProps) => {
  const { title, content } = props;
  return (
  <div>
    <div className="text-4xl font-bold text-blue-800 font-inter mb-6 text-center bg-blue-100 rounded py-4">
      <h1>{ title }</h1>
    </div>
    <div className="my-8">
      { content }
    </div>
  </div>
  )
}

type AboutSectionProps = {
  datasetId: string;
  description: string;
  testDataUrl?: string;
  sourceDescription?: string;
  acknowledgement?: string;
  isOwnedByUser?: boolean;
  rows?: number;
  columns?: number;
}

const AboutSection = (props: AboutSectionProps) => {
  const { datasetId, description, testDataUrl, sourceDescription, acknowledgement, isOwnedByUser, rows, columns } = props;
  return (
  <Layout>
  <div
    className="flex flex-col w-full space-between gap-4"
  >
    <CryptographicAssets datasetId={datasetId} isOwnedByUser={isOwnedByUser} rows={rows} columns={columns}/>

    <div
      className="flex flex-col flex-grow"
    >
      <div>
      { description }
      </div>
      { testDataUrl && (
      <div className="mx-auto m-4">
        <Button onClick={() => window.location.href = testDataUrl}>
          Download Test Data
        </Button>
      </div>
      )}
      {sourceDescription && <DatasetSection title="Data Sources" content={ sourceDescription } />}
      {acknowledgement && <DatasetSection title="Acknowledgment" content={ acknowledgement } />}
    </div>
    <div>
    </div>
  </div>
  </Layout>
  )
}

const DiscussionSection = () => {
  return (
    <Layout>
    <div
      className="flex w-full space-between"
    >
      Discussion sections are coming soon.
    </div>
    </Layout>
    )
}

const HistorySection = () => {
  return (
    <Layout>
    <div
      className="flex w-full space-between"
    >
      History sections are coming soon.
    </div>
    </Layout>
    )
}

type SchemaSectionProps = {
  schema?: Record<any, string>;
}

type PropertyRowProps = {
  key: string;
  type: string;
  description: string;
}

const SchemaSection = ({ schema }: SchemaSectionProps) => {
  if (!schema) {
    return (
      <Layout>
      The owner of this dataset has not provided a schema.
    </Layout>
    )
  }

  const rows: Array<PropertyRowProps> = [];
  for (let key in (schema.properties as any)) {
    //@ts-ignore
    const property = schema.properties[key];
    rows.push({
      key,
      type: property.type,
      description: property.description || '',
    })
  }

  const PropertyRow = ({ row } : { row: PropertyRowProps }) => {
    return (
      <tr key={row.key}>
        <td
          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
        >{ row.key }</td>
        <td
          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
        >{ row.type }</td>
        <td
          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
        >{ row.description }</td>
      </tr>
    )
  }

  return (
    <Layout>
    <div
      className="flex flex-col w-full space-between"
    >
      <div
        className="mb-8 flex justify-center"
      >
        <div>{ schema.title }</div>
        <div>{ schema.description }</div>
      </div>
      <table
        className="min-w-full divide-y divide-gray-200 p-4"
      >
        <thead
          className="bg-slate-300 text-indigo-800 font-bold"
        >
          <tr>
          <th
            className="px-6 py-3 text-left text-xs text-indigo-500 uppercase tracking-wider font-bold"
          >Property</th>
          <th
            className="px-6 py-3 text-left text-xs text-indigo-500 uppercase tracking-wider font-bold"
          >Type</th>
          <th
            className="px-6 py-3 text-left text-xs text-indigo-500 uppercase tracking-wider font-bold"
          >Description</th>
          </tr>
        </thead>
      {rows.map(row => (
        <PropertyRow key={row.key} row={row} />
      ))
      }
      </table>
    </div>
    </Layout>
    )
}

type CryptographicAssetsProps = {
  datasetId: string;
  rows?: number;
  columns?: number;
  isOwnedByUser?: boolean;
}

const CryptographicAssets = ({ datasetId, isOwnedByUser, rows, columns } : CryptographicAssetsProps) => {
  const [ doesDataCommitmentExist, setDoesDataCommitmentExist ] = useState<boolean | null>(null);
  const [ dataCommitmentFile, setDataCommitmentFile ] = useState<File | null>(null);
  const dataCommitmentInputRef = useRef();

  useEffect(() => {
    api(APIEndPoints.CheckFileExists, {
       bucketName: 'proof_assets',
       filePath: `${datasetId}`,
       fileName: 'data_commitment.json'
    }).then(result => setDoesDataCommitmentExist(result))
  }, [datasetId])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files ? event.target.files[0] : null;
    if (file) {
      setDataCommitmentFile(file)
    }
  };

  const handleUpload = async () => {
    if (dataCommitmentFile) {
      await api(APIEndPoints.UploadDataCommitment, {datasetId, dataCommitmentFile });
      window.location.reload();
    }
  }

  return (
    <div className="text-slate-500 my-2">
      <div className="flex flex-row gap-10">
        {doesDataCommitmentExist === null && 'Loading...'}
        {doesDataCommitmentExist === false && 
          <div className="flex gap-2 items-center text-red-400">
            <FontAwesomeIcon icon={faWarning}/> <span className="text-sm">Missing data commitment</span>
            {isOwnedByUser && 
              <FormFile
                //@ts-ignore
                ref={dataCommitmentInputRef}
                onChange={handleChange}
                fileName={dataCommitmentFile ? dataCommitmentFile.name : undefined}
              >
                <button
                  className={`mx-2 px-2 py-1 text-xs text-slate-50 rounded ${dataCommitmentFile ? 'bg-indigo-700' : 'bg-indigo-300'}`}
                  onClick={() => 
                    dataCommitmentFile
                    ? handleUpload()
                    //@ts-ignore
                    : dataCommitmentInputRef?.current?.click()}
                >
                {dataCommitmentFile ? 'Upload this file' : 'Choose data commitment file'}
                </button>
              </FormFile>}
          </div>}
        {doesDataCommitmentExist === true && 
            <div 
              className="cursor-pointer"
              onClick={() => api(APIEndPoints.DownloadDataCommitment, { datasetId })}>
              <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faFileAlt} /> <span className="text-sm">Data Commitment</span>
              </div>
            </div>
        }
        <div className="flex gap-2 items-center">
          {(rows && columns)
          ? <><FontAwesomeIcon icon={faColumns} /> <span className="text-sm">{rows} rows x {columns} columns</span></>
          : <><FontAwesomeIcon icon={faColumns} className="text-red-400"/> <span className="text-sm text-red-400">Missing number of rows or columns</span></>
          }
        </div>
      </div>
    </div>
  )
}

export default DatasetPage;