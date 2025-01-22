import { SubmitHandler, useForm } from "react-hook-form";
import FormWrapper, { FormInput, FormItem, FormSelect, FormTextArea } from "../common/Form";
import Button from "../common/Button";
import type { NewRequest } from "@/types/request";
import { APIEndPoints, api } from "@/utils/api";

type NewRequestProps = {
  userId: string; // TODO
  datasetId: string; // TODO
  onSubmit: SubmitHandler<NewRequest>;
}

const NewRequest = (props: NewRequestProps) => {
  const { userId, datasetId, onSubmit } = props;
  return (
    <div>
      <NewRequestForm userId={userId} datasetId={datasetId} onSubmit={onSubmit}/>
    </div>
  )
}

const NewRequestForm = (props: NewRequestProps) => {
  const { register, handleSubmit, formState } = useForm<NewRequest>();
  const { errors } = formState;

  const { userId, datasetId, onSubmit: onSubmitCallback } = props;

  const onSubmit = (data: NewRequest) => {
    api(APIEndPoints.AddRequest, {
      title: data.title,
      description: data.description,
      code: data.code,
      user_id: userId,
      dataset_id: datasetId,
    }).then((data) => onSubmitCallback(data))
  }

  return (
    <div>
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <div
          className="bg-indigo-100 rounded p-4 mb-4"
        >
        <FormItem>
          <div
            className="my-2 text-sm font-medium text-gray-900" 
          >
            Request Name
          </div>
          <FormInput
            errors={errors}
            errorMessage={'Just a test error'}
            className="bg-indigo-100 border border-indigo-300 rounded w-full text-sm block p-2.5"
            placeholder="The title of your computation request"
            {...register('title', { required: true })}
          />
        </FormItem>
        <FormItem>
          <div
            className="mb-2 text-sm font-medium text-gray-900" 
          >
          Request Description
          </div>
          <FormTextArea
            errors={errors}
            errorMessage="text area error"
            className="bg-indigo-100 border border-indigo-300 rounded w-full text-sm block p-2.5"
            placeholder="Describe what your computation is about"
            {...register('description', { required: true })}
          />
        </FormItem>
        </div>
        <div
          className="bg-indigo-100 rounded p-4 mb-4"
        >
        <FormItem>
          <div
            className="my-2 text-sm font-medium text-gray-900" 
          >
          Function to Compute
          <p className="text-xs">Some help text here about function signature, data types...</p>

          </div>
          {/* TODO SUPPORT TAB TO INDENT */}
          <FormTextArea
            errors={errors}
            errorMessage="text area error"
            className="bg-indigo-100 border border-indigo-300 rounded w-full text-sm block p-2.5 font-mono"
            {...register('code', { required: true })}
          >
            def computation(s: State, data: list[torch.Tensor]) -&gt; torch.Tensor:&#13;&nbsp;&nbsp;Test
          </FormTextArea>
        </FormItem>
        </div>        
        <Button type="submit">Submit</Button>
      </FormWrapper>
    </div>
  )
}

export default NewRequest;