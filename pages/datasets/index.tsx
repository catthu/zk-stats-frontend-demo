import { FormInput } from "@/components/common/Form";
import Hero from "@/components/common/Hero";
import Layout from "@/components/common/Layout";
import { DatasetCard } from "@/components/datasets/DatasetCard";
import { Dataset, DatasetPreview, DatasetResponse, convertDatasetResponseToDataset } from "@/types/dataset";
import { APIEndPoints, api } from "@/utils/api";
import { useUser } from "@/utils/session";
import { useEffect, useState } from "react";

const Datasets = () => {
  const [ datasets, setDatasets ] = useState<Array<Dataset>>([]);
  const [ filteredDatasets, setFilteredDatasets ] = useState<Array<Dataset>>([]);

  useEffect(() => {
    api(APIEndPoints.Datasets).then((response) => {
      const convertedDatasets = response.map((dataset: DatasetResponse) => convertDatasetResponseToDataset(dataset))
      setDatasets(convertedDatasets);
      setFilteredDatasets(convertedDatasets);
    })

  }, [setDatasets])

  const user = useUser();

  const DatasetSearchBar = (
    <div className="w-3/4">
      <FormInput
        placeholder="Dataset name, column name, etc."
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
        header='Browse datasets'
        subheader="Explore datasets from our community. Get your questions about the data answered."
        action={DatasetSearchBar}
      />
      {datasets && (
        <Layout>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDatasets.map((dataset) => (
                <DatasetCard dataset={dataset} key={dataset.id} />
          ))
        }
          </div>
        </Layout>
      )}
    </div>
  )
}

export default Datasets;