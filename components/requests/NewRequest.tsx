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
          className="bg-gray-50 rounded p-4 mb-4 border-2 border-gray-100"
        >
        <FormItem>
          <div
            className="mb-2 text-md font-medium text-gray-900" 
          >
            Request Name
          </div>
          <FormInput
            errors={errors}
            errorMessage={'Just a test error'}
            {...register('title', { required: true })}
          />
        </FormItem>
        <FormItem>
          Request Description
          <FormTextArea
            errors={errors}
            errorMessage="text area error"
            {...register('description', { required: true })}
          />
        </FormItem>
        </div>
        <div
          className="bg-gray-50 rounded p-4 mb-4 border-2 border-gray-100"
        >
        <FormItem>
          Function to Compute
          <p className="text-sm">Some help text here about function signature, data types...</p>
          {/* TODO SUPPORT TAB TO INDENT */}
          <FormTextArea
            errors={errors}
            errorMessage="text area error"
            className="font-mono"
            {...register('code', { required: true })}
          >
            def computation(s: State, data: list[torch.Tensor]) -&gt; torch.Tensor:&#13;&nbsp;&nbsp;Test
          </FormTextArea>
        </FormItem>
        </div>
        {/* 
          // LATER
        <div
          className="bg-gray-50 rounded p-4 mb-4 border-2 border-gray-100"
        >
        <FormItem>
          Aggregate
          <FormSelect options={[{value: 'Test', label: 'test'}, {value: 'test2 ', label: 'test2'}]}/>
        </FormItem>
        </div> */}
        
        <Button type="submit">Submit</Button>
      </FormWrapper>
    </div>
  )
}

export default NewRequest;