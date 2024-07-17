import Button, { ButtonVariant } from "@/components/common/Button";
import { FormFile, FormInput } from "@/components/common/Form";
import Modal from "@/components/common/Modal";
import { useState } from "react";

type onSubmitResultModalOnSubmit = {
  result: string;
  proofFile: File |null;
  precalWitnessFile: File | null;
  settingsFile: File | null;
}

type SubmitResultModalProps = {
  onSubmit: ({
    result,
    proofFile,
    precalWitnessFile,
    settingsFile
  }: onSubmitResultModalOnSubmit) => void; // TODO remove the null possibility
  onClose: VoidFunction;
}

const SubmitResultModal = (props: SubmitResultModalProps) => {
  const { onClose, onSubmit } = props;
  const [ result, setResult ] = useState<any>();
  const [ proofFile, setProofFile ] = useState<File | null>(null);
  const [ precalWitnessFile, setPrecalWitnessFile ] = useState<File | null>(null);
  const [ settingsFile, setSettingsFile ] = useState<File | null>(null);


  // TODO FINISH EXTRACTING THIS
  // TODO WHAT HAPPEN WHEN THERE IS MORE THAN ONE RESULT? NEED TO TEST

  if (proofFile) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        console.log(json['pretty_public_inputs']['rescaled_outputs'].slice(1,).join(','))
        setResult(json['pretty_public_inputs']['rescaled_outputs'].slice(1,).join(', '))
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }
    reader.readAsText(proofFile)
  }


  return (
    <Modal title="Submit Result" onClose={onClose}>
      <div className="text-gray-500">
      Completed the computation? Sumbit the result and proof here.
      </div>
      <hr />
      <h2
        className="text-lg font-bold"
      >Proof</h2>
      <div className="text-gray-500">Select the proof <code>(model.pf)</code> file</div>
      <FormFile onChange={(e) => e.target.files && setProofFile(e.target.files[0])}/>
      {result && <p>Result: {result}</p>}
      <hr />
      <h2
        className="text-lg font-bold"
      >Precal Witness</h2>
      <div className="text-gray-500">Select the precal witness <code>(precal_witness.json)</code> file</div>
      <FormFile onChange={(e) => e.target.files && setPrecalWitnessFile(e.target.files[0])}/>
      <hr />
      <h2
        className="text-lg font-bold"
      >Settings</h2>
      <div className="text-gray-500">Select the settings <code>(settings.json)</code> file</div>
      <FormFile onChange={(e) => e.target.files && setSettingsFile(e.target.files[0])}/>
      <div className="w-full flex justify-end mt-6">
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={() => onSubmit({
            result,
            proofFile,
            precalWitnessFile,
            settingsFile
          })}
        >Submit Result</Button>
      </div>
    </Modal>
  )
}

export default SubmitResultModal;