import { RequestPreview } from "@/types/request";

export const mockRequests: Array<RequestPreview> = [
  {
    id: '1',
    title: 'Medium Cholesterol of women over 50',
    description: 'A calculation to cut the group by under over 50',
    updatedAt: '2023-11-25 00:01:02',
    isAccepted: true,
    isCompleted: false,
    resultApproved: false,
    userId: '1',
    datasetId: '1',
  },
  {
    id: '2',
    title: 'Medium Cholesterol of women under 50',
    updatedAt: '2023-01-23 16:32:34',
    isAccepted: true,
    isCompleted: true,
    resultApproved: false,
    userId: '1',
    datasetId: '1',
  },
]