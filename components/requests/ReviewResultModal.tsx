import Button, { ButtonVariant } from "@/components/common/Button";
import { FormInput } from "@/components/common/Form";
import Modal from "@/components/common/Modal";
import { useState } from "react";

type ReviewResultModalProps = {
  onAccept: VoidFunction;
  onClose: VoidFunction;
  result: any;
}

const ReviewResultModal = (props: ReviewResultModalProps) => {
  const { onClose, onAccept, result } = props;
  return (
    <Modal title="Review Result" onClose={onClose}>
      Please review the result below.
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
      <Button
        onClick={onAccept}
      >Submit Result</Button>
      <Button
        variant={ButtonVariant.SECONDARY}
      >
        Request Further Review
      </Button>
      </div>
    </Modal>
  )
}

export default ReviewResultModal;