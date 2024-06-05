import { APIEndPoints, api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignOut = () => {

  const router = useRouter();

  useEffect(() => {
    api(APIEndPoints.SignOut).then(({ error }) => {
      if (error) {
        console.log('error signing out', error)
      } else {
        router.push('/')
      }
    })
  }, [router])
  return (
    <div>Signing out...</div>
  )
}

export default SignOut;