import Button, { ButtonVariant } from "@/components/common/Button";
import { FormInput } from "@/components/common/Form";
import Hero from "@/components/common/Hero";
import Layout from "@/components/common/Layout";
import DataOwnerDemoModal from "@/components/datasets/DataOwnerDemoModal";
import { DatasetCard } from "@/components/datasets/DatasetCard";
import DataUserDemoModal from "@/components/datasets/DataUserDemoModal";
import { Dataset, DatasetPreview, DatasetResponse, convertDatasetResponseToDataset } from "@/types/dataset";
import { APIEndPoints, api } from "@/utils/api";
import { useUser } from "@/utils/session";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const Datasets = () => {
  const user = useUser();

  const [ ownedDatasets, setOwnedDatasets ] = useState<Array<Dataset>>([]);
  const [ communityDatasets, setCommunityDatasets ] = useState<Array<Dataset>>([]);
  const [ filter, setFilter ] = useState<string>('');
  const [ isDataOwnerDemoModalOpen, setIsDataOwnerDemoModalOpen ] = useState<boolean>(false)
  const [ isDataUserDemoModalOpen, setIsDataUserDemoModalOpen ] = useState<boolean>(false)

  useEffect(() => {
    api(APIEndPoints.Datasets).then((response) => {
      const convertedDatasets = response.map((dataset: DatasetResponse) => convertDatasetResponseToDataset(dataset))
      setOwnedDatasets(convertedDatasets.filter((dataset: Dataset) => dataset.ownerId === user?.id));
      setCommunityDatasets(convertedDatasets.filter((dataset: Dataset) => dataset.ownerId !== user?.id))
    })

  }, [setOwnedDatasets, setCommunityDatasets, user])

  const filterDatasets = (dataset: Dataset, filter: string) =>
      dataset.title.toLowerCase().includes(filter.toLowerCase()) 
      || dataset.description.toLowerCase().includes(filter.toLowerCase())

  const DatasetSearchBar = (
    <div className="w-3/4">
      <FormInput
        placeholder="Search for datasets"
        onChange={(e) => setFilter(e.target.value.toLowerCase())
        }
      />
    </div>
  )

  const DemoButtons = (
    <div
      className="flex gap-4"
    >
      <Button
        variant={ButtonVariant.QUARTERY}
        onClick={() => {
          setIsDataUserDemoModalOpen(false)
          setIsDataOwnerDemoModalOpen(true)
        }}
      >Explore As Data Owner <FontAwesomeIcon className="mx-2" icon={faExternalLink} /></Button>
      <Button
        variant={ButtonVariant.QUARTERY}
        onClick={() => {
          setIsDataOwnerDemoModalOpen(false)
          setIsDataUserDemoModalOpen(true)
        }}
      >Explore As Data User <FontAwesomeIcon className="mx-2" icon={faExternalLink} /></Button>
    </div>
  )

  

  return (
    <div>
      <Hero
        header='Zero-knowledge datasets'
        subheader="Explore datasets from our community. Get your questions about the data answered."
        action={
          <div
            className="flex flex-col gap-6"
          >
          {DemoButtons}
          {DatasetSearchBar}
          </div>
        }
      />
      <Layout>
      <div
        className="flex flex-col gap-10"
      >
      {!!ownedDatasets.length && (
      <div>
        <h1
          className="text-2xl my-6 font-bold text-indigo-900"
        >Your Datasets</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ownedDatasets.filter(dataset => filterDatasets(dataset, filter)).map((dataset) => (
            <DatasetCard dataset={dataset} key={dataset.id} />
          ))
        }
          </div>
        <hr />
      </div>
      )}
      {communityDatasets && (
      <div>
        <h1
          className="text-2xl my-6 font-bold text-indigo-900"
        >Community Datasets</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {communityDatasets.filter(dataset => filterDatasets(dataset, filter)).map((dataset) => (
              <DatasetCard dataset={dataset} key={dataset.id} />
          ))
        }
          </div>
      </div>
      )}
      </div>
      </Layout>
      {isDataOwnerDemoModalOpen &&
        <DataOwnerDemoModal onClose={() => setIsDataOwnerDemoModalOpen(false)}/>
      }
      {isDataUserDemoModalOpen &&
        <DataUserDemoModal onClose={() => setIsDataUserDemoModalOpen(false)}/>
      }
    </div>
  )
}

export default Datasets;