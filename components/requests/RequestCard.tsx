import { FullRequest } from '@/types/request';
import { useRouter } from 'next/router';


interface RequestCardProps {
  fullRequest: FullRequest;
}

const RequestCard = ({ fullRequest }: RequestCardProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/datasets/${fullRequest.datasetId}/requests/${fullRequest.id}`)}
      className="transform transition duration-100 ease-in-out hover:scale-105 hover:shadow-lg bg-indigo-100 rounded-lg overflow-hidden cursor-pointer"
    >
      <div className="p-4">
        <div className="text-gray-600 text-sm mb-1">
          {fullRequest.dataset?.title || 'Unknown Dataset'}
        </div>
        <div className="font-semibold text-lg text-slate-800 mb-2">
          {fullRequest.title}
        </div>
        <p className="text-gray-600">
          {fullRequest.description?.length ? (fullRequest.description.length > 100 
            ? `${fullRequest.description.slice(0, 100)}...` 
            : fullRequest.description) : ''}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            Status: {fullRequest.status}
          </span>
          <span className="text-gray-400 text-xs">
            {new Date(fullRequest.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
