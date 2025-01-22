import { DatasetPreview } from '@/types/dataset';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

type DatasetCardProps = {
  dataset: DatasetPreview;
}

export const DatasetCard = (props: DatasetCardProps) => {
  const { dataset } = props;
  const { id, title, subtitle, description, updatedAt, owner } = dataset;
  
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
        <p className="text-gray-600">
          {description.length > 100 ? `${description.slice(0, 100)}...` : description}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-xs my-2">Updated on {updatedAt}</p>
        </div>
        {owner && (
        <div className="flex items-center gap-2">
        <span className="fa-layers fa-fw h-6 w-6" style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faCircle} size="2x" className="text-white mx-auto w-full"/>
            <FontAwesomeIcon icon={faUser} className="text-gray-800 mx-auto w-full"/>
            </span>
            <span className="text-gray-600 text-sm">{owner?.username}</span>
          </div>
        )}
      </div>
    </div>
    </Link>
  )
}
