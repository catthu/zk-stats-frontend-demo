import { ReactNode } from "react";

type CardProps = {
  children: ReactNode
}

const Card = ({ children, ...props}: CardProps) => {
  return (
    <div className={`rounded border p-6 my-4 bg-gray-100`}>
      {children}
    </div>
  )
}

export default Card;
