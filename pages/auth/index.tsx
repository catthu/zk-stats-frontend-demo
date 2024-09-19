import { useState } from "react";
import Button, { ButtonVariant } from "@/components/common/Button";
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
  const { register, handleSubmit, formState, watch, setError } = useForm();
  const { errors } = formState;
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSignUp: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setApiError(null);
    const { usernameOrEmail, password } = watch();
    try {
      await api(APIEndPoints.SignUp, {
        usernameOrEmail,
        password
      });
      router.push('/');
    } catch (error) {
      setApiError("Sign up failed. Please try again.");
    }
  }

  const onSignIn: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setApiError(null);
    const { usernameOrEmail, password } = watch();
    try {
      await api(APIEndPoints.SignInWithPassword, {
        usernameOrEmail,
        password
      });
      router.push('/');
    } catch (error) {
      setApiError("Invalid credentials. Please try again.");
    }
  }

  const onForgotPassword: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    // setApiError(null);
    // const { usernameOrEmail } = watch();
    // if (!usernameOrEmail) {
    //   setApiError("Please enter your username or email address.");
    //   return;
    // }
    // try {
    //   await api(APIEndPoints.ForgotPassword, { usernameOrEmail });
    //   setApiError("Password reset instructions sent to your email.");
    // } catch (error) {
    //   setApiError("Failed to send password reset email. Please try again.");
    // }
  }

  return (
    <FormWrapper>
      {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
      <div>
        <FormItem>
          <div>Username or Email</div>
          <FormInput 
            errors={errors}
            errorMessage={errors.usernameOrEmail?.message as string}
            {...register('usernameOrEmail', {
              required: "Username or Email is required",
              validate: (value) => {
                const emailPattern = /\S+@\S+\.\S+/;
                if (!emailPattern.test(value) && value.length < 3) {
                  return "Enter a valid username or email address";
                }
                return true;
              }
            })}
          />
        </FormItem>
      </div>
      <div>
        <FormItem>
          <div>Password</div>
          <FormInput 
            errors={errors}
            errorMessage={errors.password?.message as string}
            type="password"
            {...register('password', {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long"
              }
            })}
          />
        </FormItem>
      </div>
      <div className="flex gap-8">
        <Button onClick={onSignUp}>Sign Up</Button>
        <Button onClick={onSignIn}>Sign In</Button>
        <Button 
          onClick={onForgotPassword}
          variant={ButtonVariant.TERTIARY}
        >Forgot Password</Button>
      </div>
    </FormWrapper>
  )
}

export default Auth;