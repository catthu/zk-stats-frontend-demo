import Link from "next/link";
import Button, { ButtonVariant } from "../common/Button";
import Modal from "../common/Modal";

type DataUserDemoModalProps = {
  onClose?: () => void;
}

const DataUserDemoModal = ({
  onClose
}: DataUserDemoModalProps) => {
  return (
    <Modal
      title="Explore as Data User"
      onClose={onClose}
    >
      <hr />
      <p>We are a two-sided marketplace around zero-knowledge datasets. The experience requires a few back and forth interactions between data owners
      and data users.</p>

      <p>To allow you the chance to explore both sides of the marketplace on your own, we have prepared a <b>demo dataset</b> and an demo owner user account. To demo our functions:
      </p>
      <ul>
        <li
          className="list-disc ml-4"
        >Submit computation requests to 
          <Link
            className="text-indigo-800 bg-gray-200 px-1 rounded font-bold hover:bg-gray-100 hover:text-indigo-600" 
            href=''>the demo dataset</Link>
          with your own user account</li>
        <li
          className="list-disc ml-4"
        >Log in to this demo account to move the request forward</li>
      </ul>
      <hr />
      <div className="w-full flex justify-end mt-6">
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={() => {}}
        >Go to the demo dataset</Button>
      </div>
    </Modal>
  )
}

export default DataUserDemoModal;