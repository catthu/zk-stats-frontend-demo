import { useState } from "react";
import Button from "@/components/common/Button";
import FormWrapper, { FormInput, FormItem } from "@/components/common/Form";
import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar";
import { APIEndPoints, api } from "@/utils/api";
import { MouseEventHandler } from "react";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  return (
    <div>
      <NavBar />
      <Layout>
        <ForgotPasswordForm />
      </Layout>
    </div>
  )
}

const ForgotPasswordForm = () => {
  const { register, formState, watch } = useForm();
  const { errors } = formState;
  const [apiError, setApiError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const onSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setApiError(null);
    const { usernameOrEmail } = watch();
    if (!usernameOrEmail) {
      setApiError("Please enter your email address.");
      return;
    }
    try {
      await api(APIEndPoints.ResetPassword, { email: usernameOrEmail });
      setIsEmailSent(true);
    } catch (error) {
      setApiError("Failed to send password reset email. Please try again.");
    }
  }

  if (isEmailSent) {
    return (
      <FormWrapper>
        <div className="text-green-600 mb-4">
          Password reset instructions have been sent to your email.
          Please check your inbox and follow the instructions to reset your password.
        </div>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
      <div>
        <FormItem>
          <div>Email</div>
          <FormInput 
            errors={errors}
            errorMessage={errors.usernameOrEmail?.message as string}
            {...register('usernameOrEmail', {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address"
              }
            })}
          />
        </FormItem>
      </div>
      <div className="flex gap-8">
        <Button onClick={onSubmit}>Reset Password</Button>
      </div>
    </FormWrapper>
  )
}

export default ForgotPassword;