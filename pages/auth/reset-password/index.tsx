import { useState } from "react";
import Button, { ButtonVariant } from "@/components/common/Button";
import FormWrapper, { FormInput, FormItem } from "@/components/common/Form";
import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar";
import { APIEndPoints, api } from "@/utils/api";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import { useForm } from "react-hook-form";

const ResetPassword = () => {
  return (
    <div>
      <NavBar />
      <Layout>
        <ResetPasswordForm />
      </Layout>
    </div>
  )
}

const ResetPasswordForm = () => {
  const router = useRouter();
  const { token } = router.query;
  const { register, handleSubmit, formState, watch } = useForm();
  const { errors } = formState;
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setApiError(null);
    const { password, confirmPassword } = watch();

    if (!password || !confirmPassword) {
      setApiError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setApiError("Passwords do not match.");
      return;
    }

    if (!token) {
      setApiError("Invalid reset token. Please try requesting a new password reset.");
      return;
    }

    try {
      await api(APIEndPoints.ResetPassword, { 
        password: password,
        repeatPassword: confirmPassword
      });
      setIsSuccess(true);
    } catch (error) {
      setApiError("Failed to reset password. Please try again or request a new reset link.");
    }
  }

  if (isSuccess) {
    return (
      <FormWrapper>
        <div className="text-green-600 mb-4">
          Your password has been successfully reset. You can now login with your new password.
        </div>
        <Button variant={ButtonVariant.PRIMARY} onClick={() => router.push('/auth/login')}>
          Go to Login
        </Button>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
      <div>
        <FormItem>
          <div>New Password</div>
          <FormInput 
            type="password"
            errors={errors}
            errorMessage={errors.password?.message as string}
            {...register('password', {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long"
              }
            })}
          />
        </FormItem>
        <FormItem>
          <div>Confirm Password</div>
          <FormInput 
            type="password"
            errors={errors}
            errorMessage={errors.confirmPassword?.message as string}
            {...register('confirmPassword', {
              required: "Please confirm your password",
              validate: (val: string) => {
                if (watch('password') != val) {
                  return "Passwords do not match";
                }
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

export default ResetPassword;