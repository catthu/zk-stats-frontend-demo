import Hero from "@/components/common/Hero";
import { APIEndPoints, api } from "@/utils/api";
import { GetServerSideProps } from "next";
import { ReactNode, useState } from "react";
import { UserRequests } from "@/components/requests/UserRequests";
import Button from "@/components/common/Button";
import { Dataset, convertDatasetResponseToDataset } from "@/types/dataset";
import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar";
import { useUser } from "@/utils/session";
import { OwnerRequests } from "@/components/requests/OwnerRequests";

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
  RequestsOwnerView = 'requests_owner_view'
}

const DatasetPage = ({ dataset }: DatasetPageProps) => {
  const { id, title, description, testDataUrl, sourceDescription, acknowledgement, ownerId } = dataset;
  const [ activeTab, setActiveTab ] = useState<MenuTab>(MenuTab.About);

  const user = useUser();

  const isOwnedByUser = ownerId === user?.id;

  return (
    <div>
      <NavBar />
      <Hero header={ title } subheader={ description }/>
      <DatasetMenu onTabChange={setActiveTab} activeTab={activeTab} isDatasetOwner={isOwnedByUser} />

      { activeTab === MenuTab.About && <AboutSection description={description} testDataUrl={testDataUrl} sourceDescription={sourceDescription} acknowledgement={acknowledgement} /> }
      { activeTab === MenuTab.History && "Just testing" }
      { activeTab === MenuTab.Requests && (user?.id ? <UserRequests userId={user?.id} datasetId={id} /> : "Please log in.")}
      { activeTab === MenuTab.RequestsOwnerView && <OwnerRequests datasetId={id} />}

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
    <div className="container mx-auto flex justify-center space-x-8">
      <DatasetMenuItemContainer 
        onClick={() => onTabChange(MenuTab.About)}
        isActive={activeTab === MenuTab.About}
      >
        About
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
      {!isDatasetOwner 
      ? <DatasetMenuItemContainer
        onClick={() => onTabChange(MenuTab.Requests)}
        isActive={activeTab === MenuTab.Requests}
      >
        Your Requests
      </DatasetMenuItemContainer>
      : <DatasetMenuItemContainer
        onClick={() => onTabChange(MenuTab.RequestsOwnerView)}
        isActive={activeTab === MenuTab.RequestsOwnerView}
      >
        Active Requests
      </DatasetMenuItemContainer>
      }
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
    <div className={`${isActive && 'bg-blue-100 rounded'} menu-item text-gray-900 hover:font-semibold relative hover:text-gray-900 hover:cursor-pointer transition-all px-2 py-2`}
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
  description: string;
  testDataUrl?: string;
  sourceDescription?: string;
  acknowledgement?: string;
}

const AboutSection = (props: AboutSectionProps) => {
  const { description, testDataUrl, sourceDescription, acknowledgement } = props;
  return (
  <Layout>
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
  </Layout>
  )
}

export default DatasetPage;