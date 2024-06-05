import { DatasetPreview } from '@/types/dataset';
import Link from 'next/link';

type DatasetCardProps = {
  previewImage: React.ReactNode; // todo
  dataset: DatasetPreview;
}

export const DatasetCard = (props: DatasetCardProps) => {
  const { previewImage, dataset } = props;
  const { id, title, description } = dataset;

  
  return (
    <Link href={`/datasets/${id}`}>
    <div className="transform transition duration-100 ease-in-out hover:scale-105 hover:shadow-lg bg-white rounded-lg overflow-hidden border-2 border-gray-100" >
      <div className="bg-gray-300 h-48 w-full flex items-center justify-center">
        Preview Image
        { previewImage }
      </div>
      <div className="p-4">
        <div className="font-semibold text-lg mb-2">
          { title }
        </div>
        <p className="text-gray-600">{ description }</p>
        <p className="text-gray-600 text-sm">Uploaded 3 hours ago</p>
        <p className="text-gray-600 text-sm">1,204 views · 10 minutes</p>
      </div>
    </div>
    </Link>
  )
}

// TODO NEXT: create mock data according to chatgpt and import them to use here