import { APIEndPoints, Options } from "@/utils/api";
import { mockDataset, mockDatasets } from "./datasets";
import { mockRequests } from "./requests";

const useMockData = (endpoint: APIEndPoints, options: Options): any => {
  console.log('using mock')
  switch (endpoint) {
    case APIEndPoints.GetDataset: return {status: 200, data: mockDataset};
    case APIEndPoints.Datasets: return mockDatasets;
    case APIEndPoints.Requests: return {status: 200, data: mockRequests}
  }
}

export default useMockData;
