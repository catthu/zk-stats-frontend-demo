import { APIEndPoints, Options } from "@/utils/api";
import { mockRequests } from "./requests";

const useMockData = (endpoint: APIEndPoints, options: Options): any => {
  console.log('using mock')
  switch (endpoint) {
    case APIEndPoints.Requests: return {status: 200, data: mockRequests}
  }
}

export default useMockData;
