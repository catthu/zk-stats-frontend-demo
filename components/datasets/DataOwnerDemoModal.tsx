import Link from "next/link";
import Button, { ButtonVariant } from "../common/Button";
import Modal from "../common/Modal";
import { useUser } from "@/utils/session";
import { api, APIEndPoints } from "@/utils/api";

const DEMO_DATA_OWNER_EMAIL_ADDRESS = 'catthunh+zkstatsdataprovider@gmail.com'
const DEMO_DATA_OWNER_PASSWORD = '123456789'

type DataOwnerDemoModalProps = {
  onClose?: () => void;
}

const DataOwnerDemoModal = ({
  onClose
}: DataOwnerDemoModalProps) => {

  const user = useUser()
  return (
    <Modal
      title="Explore as Data Owner"
      onClose={onClose}
    >
      <hr />
      <p>We are a two-sided marketplace around zero-knowledge datasets. The experience requires a few back and forth interactions between data owners
      and data users.</p>

      <p>To allow you the chance to explore both sides of the marketplace on your own, we have prepared a <b>special user account</b> that is an owner of a
      demo dataset. To demo our functions:
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
          onClick={async () => {
            if (user) {
              await api(APIEndPoints.SignOut)
              await api(APIEndPoints.SignInWithPassword, {
                usernameOrEmail: DEMO_DATA_OWNER_EMAIL_ADDRESS,
                password: DEMO_DATA_OWNER_PASSWORD
              })
              window.location.reload()
            }
            await api(APIEndPoints.SignInWithPassword, {
              usernameOrEmail: DEMO_DATA_OWNER_EMAIL_ADDRESS,
              password: DEMO_DATA_OWNER_PASSWORD
            })
            setTimeout(() => window.location.reload(), 1000)
          }}
        >Log in to the demo account</Button>
      </div>
    </Modal>
  )
}

export default DataOwnerDemoModal;