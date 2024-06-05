import Button from "@/components/common/Button";
import FormWrapper, { FormInput, FormItem } from "@/components/common/Form";
import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar";
import { APIEndPoints, api } from "@/utils/api";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import { useForm } from "react-hook-form";

const Auth = () => {
  return (
    <div>
      <NavBar />
      <Layout>
        <AuthForm />
      </Layout>
    </div>
  )
}

const AuthForm = () => {
  const { register, handleSubmit, formState, watch } = useForm();
  const { errors } = formState;
  const router = useRouter();

  const onSignUp: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const { username, email, password } = watch();
    api(APIEndPoints.SignUp, {
      username,
      email,
      password
    })
  }

  const onSignIn: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const { email, password } = watch();
    api(APIEndPoints.SignInWithPassword, {
      usernameOrEmail: email,
      password
    }).then((data) => router.push('/'))
    // TODO handle invalid credientials
  }

  return (
    <FormWrapper>
      <div>
        <FormItem>
          <div>Username</div>
          <FormInput 
            errors={errors}
            errorMessage={"error message"}
            {...register('username', {required: true})}
          />
        </FormItem>
      </div>
      <div>
        <FormItem>
          <div>Email</div>
          <FormInput 
            errors={errors}
            errorMessage={"error message"}
            {...register('email', {required: true})}
          />
        </FormItem>
      </div>
      <div>
        <FormItem>
          <div>Password</div>
          <FormInput 
            errors={errors}
            errorMessage={"error message"}
            {...register('password', {required: true})}
          />
        </FormItem>
      </div>
      <div className="flex gap-8">
        <Button onClick={onSignUp}>Sign Up</Button>
        <Button onClick={onSignIn}>Sign In</Button>
      </div>
    </FormWrapper>
  )
}

export default Auth;