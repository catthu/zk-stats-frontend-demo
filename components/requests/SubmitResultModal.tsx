import Button from "@/components/common/Button";
import { FormFile, FormInput } from "@/components/common/Form";
import Modal from "@/components/common/Modal";
import { useState } from "react";

type onSubmitResultModalOnSubmit = {
  proofFile: File |null;
  vkFile: File | null;
  modelOnnxFile: File | null;
  srsFile: File | null;
  settingsFile: File | null;
}

type SubmitResultModalProps = {
  onSubmit: ({
    proofFile,
    vkFile,
    modelOnnxFile,
    srsFile,
    settingsFile
  }: onSubmitResultModalOnSubmit) => void; // TODO remove the null possibility
  onClose: VoidFunction;
}

const SubmitResultModal = (props: SubmitResultModalProps) => {
  const { onClose, onSubmit } = props;
  const [ result, setResult ] = useState<any>();
  const [ proofFile, setProofFile ] = useState<File | null>(null);
  const [ vkFile, setVkFile ] = useState<File | null>(null);
  const [ modelOnnxFile, setModelOnnxFile ] = useState<File | null>(null);
  const [ srsFile, setSrsFile ] = useState<File | null>(null);
  const [ settingsFile, setSettingsFile ] = useState<File | null>(null);

  return (
    <Modal title="Submit Result" onClose={onClose}>
      Completed the computation? Sumbit the result here.
      <FormInput
        onChange={(e) => setResult(e.target.value)}
      />
      Sumbit the proof here.
      <FormFile onChange={(e) => e.target.files && setProofFile(e.target.files[0])}/>
      Submit the verification key.
      <FormFile onChange={(e) => e.target.files && setVkFile(e.target.files[0])}/>
      Submit the model onnx.
      <FormFile onChange={(e) => e.target.files && setModelOnnxFile(e.target.files[0])}/>
      Submit the SRS file.
      <FormFile onChange={(e) => e.target.files && setSrsFile(e.target.files[0])}/>
      Submit the settings file.
      <FormFile onChange={(e) => e.target.files && setSettingsFile(e.target.files[0])}/>
      <Button
        onClick={() => onSubmit({
          proofFile,
          vkFile,
          modelOnnxFile,
          srsFile,
          settingsFile
        })}
      >Submit Result</Button>
    </Modal>
  )
}

export default SubmitResultModal;