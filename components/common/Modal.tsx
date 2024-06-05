import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  title?: string;
  onOpen?: VoidFunction;
  onClose?: VoidFunction;
}

const Modal = (props: ModalProps) => {
  const { children, title, onClose } = props;
  return (
    <div
      className="fixed w-3/4 max-h-screen top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-scroll z-50"
    >
      <div
        className="bg-white border border-blue-200 rounded w-full my-8"
      >
        <div
          className="fixed right-4 top-10 hover:cursor-pointer"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faX} className="text-blue-800" />
        </div>
        <div
          className="m-8 flex flex-col gap-4"
        >
          {title && 
            <div
              className="text-2xl font-bold self-center"
            >
              {title}
            </div>
          }
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal;