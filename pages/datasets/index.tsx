import { FormInput } from "@/components/common/Form";
import Hero from "@/components/common/Hero";
import Layout from "@/components/common/Layout";
import { DatasetCard } from "@/components/datasets/DatasetCard";
import { DatasetPreview } from "@/types/dataset";
import { APIEndPoints, api } from "@/utils/api";
import { useUser } from "@/utils/session";
import { useEffect, useState } from "react";

const Datasets = () => {
  const [ datasets, setDatasets ] = useState<Array<DatasetPreview>>([]);
  const [ filteredDatasets, setFilteredDatasets ] = useState<Array<DatasetPreview>>([]);

  useEffect(() => {
    api(APIEndPoints.Datasets).then((response) => {
      setDatasets(response);
      setFilteredDatasets(response);
    })

  }, [setDatasets])

  const user = useUser();

  const DatasetSearchBar = (
    <div className="mx-auto w-2/4">
      <FormInput
        onChange={(e) => {
          setFilteredDatasets(
            datasets.filter(dataset => 
            dataset.title.toLowerCase().includes(e.target.value.toLowerCase()) 
            || dataset.description.toLowerCase().includes(e.target.value.toLowerCase())))
        }}
      />
    </div>
    )

  return (
    <div>
      <Hero
        header='Datasets'
        subheader="Search for a dataset to explore"
        action={DatasetSearchBar}
      />
      {datasets && (
        <Layout>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDatasets.map((dataset) => (
                <DatasetCard previewImage='' dataset={dataset} key={dataset.id} />
          ))
        }
          </div>
        </Layout>
      )}
    </div>
  )
}

export default Datasets;