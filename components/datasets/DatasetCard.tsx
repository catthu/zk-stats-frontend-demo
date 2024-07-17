import { DatasetPreview } from '@/types/dataset';
import Link from 'next/link';

type DatasetCardProps = {
  dataset: DatasetPreview;
}

export const DatasetCard = (props: DatasetCardProps) => {
  const { dataset } = props;
  const { id, title, description, updatedAt } = dataset;


  console.log(dataset)
  
  return (
    <Link href={`/datasets/${id}`}>
    <div className="transform transition duration-100 ease-in-out hover:scale-105 hover:shadow-lg bg-indigo-100 rounded-lg overflow-hidden" >
      {/* <div className="bg-gray-300 h-48 w-full flex items-center justify-center">
        Preview Image
        { previewImage }
      </div> */}
      <div className="p-4">
        <div className="font-semibold text-lg text-slate-800 mb-2">
          { title }
        </div>
        <p className="text-gray-600">{ description }</p>
        <p className="text-gray-400 text-xs my-2">Updated on {updatedAt}</p>
      </div>
    </div>
    </Link>
  )
}

// TODO NEXT: create mock data according to chatgpt and import them to use here