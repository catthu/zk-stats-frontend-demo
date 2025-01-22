import Button, { ButtonVariant } from "@/components/common/Button";
import Modal from "@/components/common/Modal";

type ReviewResultModalProps = {
  onAccept: VoidFunction;
  onClose: VoidFunction;
  result: any;
}

const ReviewResultModal = (props: ReviewResultModalProps) => {
  const { onClose, onAccept, result } = props;
  return (
    <Modal title="Review Result" onClose={onClose}>
      <div
        className="text-gray-500"
      >
      Please review the result below.
      </div>
      <div className="bg-gray-200 rounded my-4 p-4">
          <div className="text-lg font-bold">
          <div className="bg-gray-100 rounded text-sm font-light p-2">
            {result}
          </div>
          </div>
        </div>
      <div
        className="flex w-full gap-4"
      >
      <div className="w-full flex justify-between mt-6">
        <Button
          variant={ButtonVariant.QUARTERY}
        >
          Request Further Review
        </Button>
        <Button
          onClick={onAccept}
        >Approve Result</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ReviewResultModal;
