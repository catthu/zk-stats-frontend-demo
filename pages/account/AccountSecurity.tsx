import { useState } from 'react';
import { useUser } from '@/utils/session';
import FormWrapper, { FormInput, FormItem } from '@/components/common/Form';
import { useForm } from 'react-hook-form';
import Button from '@/components/common/Button';
import { APIEndPoints } from '@/utils/api';
import { api } from '@/utils/api';
interface AccountFormData {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export default function AccountSecurity() {
  const user = useUser();
  const [message, setMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<AccountFormData>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      repeatPassword: '',
    }
  });

  const onSubmit = async (data: AccountFormData) => {
    try {
      const response = await api(APIEndPoints.UpdateAccountSettings, data);
      if (response.error) {
        setMessage(response.error);
      } else {
        setMessage('Profile updated successfully!');
      }
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <>
    <h1 className="text-2xl my-6 font-bold text-indigo-900">
        Security</h1>
    <div className="bg-indigo-100 rounded p-4 px-6">
        
        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
            {message}
          </div>
        )}
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormItem>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
              </label>
              <FormInput
                errors={errors}
                errorMessage={'Just a test error'}
                className="bg-indigo-100 border border-indigo-300 rounded w-full text-sm block p-2.5"
                placeholder={user?.username || ''}
                {...register('username', { required: false })}
              />
            </div>
          </FormItem>
          <FormItem>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <FormInput
                errors={errors}
                errorMessage={'Just a test error'}
                className="bg-indigo-100 border border-indigo-300 rounded w-full text-sm block p-2.5"
                placeholder={user?.email || ''}
                {...register('email', { required: false })}
              />
            </div>
          </FormItem>
          <FormItem>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <FormInput
                errors={errors}
                errorMessage={'Just a test error'}
                className="bg-indigo-100 border border-indigo-300 rounded w-full text-sm block p-2.5"
                {...register('password', { required: false })}
                type="password"
              />
            </div>
          </FormItem>
          <FormItem>
            <div>
              <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700">
                Repeat Password
              </label>
              <FormInput
                errors={errors}
                errorMessage={'Just a test error'}
                className="bg-indigo-100 border border-indigo-300 rounded w-full text-sm block p-2.5"
                {...register('repeatPassword', { required: false })}
                type="password"
              />
            </div>
          </FormItem>
          <Button type="submit">Save Changes</Button>
          </div>
          </FormWrapper>
  </div>
  </>
  );
}