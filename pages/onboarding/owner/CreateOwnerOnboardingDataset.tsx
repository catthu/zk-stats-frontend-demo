import React from 'react';
import { useRouter } from 'next/router';
import { api, APIEndPoints } from '@/utils/api';
import { Dataset } from '@/types/dataset';
import { FormInput } from '@/components/common/Form';
import FormWrapper, { FormItem, FormTextArea } from '@/components/common/Form';
import { useForm } from 'react-hook-form';
import { useUser } from '@/utils/session';

const CreateOwnerOnboardingDataset: React.FC = () => {
  const router = useRouter();
  const { register, handleSubmit: handleFormSubmit, formState: { errors } } = useForm<Dataset>({
    defaultValues: {
      title: 'World Population Dataset',
      description: 'Population data for all countries in the world for the years 2022, 2020 and 2015.',
    }
  });

  const user = useUser();

  const handleSubmit = async (dataset: Partial<Dataset>) => {
    try {
      const newDataset = await api(APIEndPoints.AddDataset, {
        id: crypto.randomUUID(),
        title: dataset.title || '',
        description: dataset.description || '',
        ownerId: user?.id || '',
        schema: null
      });
      router.push(`/datasets/${newDataset.id}`);
    } catch (error) {
      console.error('Error creating dataset:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
      <FormWrapper onSubmit={handleFormSubmit(handleSubmit)} className="w-full">
          <FormItem>
            <div className="mb-2 text-md font-medium text-gray-900">
              Dataset Title
            </div>
            <FormInput
              errors={errors}
              errorMessage={errors.title?.message}
              {...register('title', { required: 'Title is required' })}
              placeholder="Give this dataset a descriptive name"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              disabled={true}
            />
          </FormItem>
          <FormItem>
            <div className="mb-2 text-md font-medium text-gray-900">
              Dataset Description
            </div>
            <FormTextArea
              errors={errors}
              errorMessage={errors.description?.message}
              {...register('description', { required: 'Description is required' })}
              placeholder="Describe this dataset in as much details as possible, e.g. How was it obtained? When was data collection?"
              className="w-full"
              disabled={true}
            />
          </FormItem>
      </FormWrapper>
  );
};

export default CreateOwnerOnboardingDataset;
