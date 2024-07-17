import React, { ChangeEvent, FormHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import ReactSelect, { SingleValue } from "react-select";
import Button from "./Button";

type FormInputProps = {
  errors?: any; // TODO
  errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(({errors, errorMessage, ...props}: FormInputProps, ref) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      <input ref={ref} className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" {...props}></input>
      {(props?.name && errors[props.name]) && <span>{ errorMessage }</span>}
    </div>
  )
}) 
FormInput.displayName = 'FormInput';

type FormTextAreaProps = {
  errors?: any; // TODO
  errorMessage?: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;


export const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(({errors, errorMessage, className, ...props}: FormTextAreaProps, ref) => {
  return (
    <div>
      <textarea ref={ref} className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${className}`} {...props}>
        {props.children}
      </textarea>
      {(props?.name && errors[props.name]) && <span>{ errorMessage }</span>}
    </div>
  )
})

FormTextArea.displayName = 'FormTextArea';

type FormSelectOption = {
  value: ReactNode;
  label: ReactNode;
}

type FormSelectProps = {
  errors?: any; // TODO
  errorMessage?: string;
  options: Array<FormSelectOption>;
  onChange?: (value: SingleValue<FormSelectOption>) => void;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'>;

export const FormSelect = React.forwardRef(({errors, errorMessage, ...props}: FormSelectProps, ref) => {
  const { options, onChange } = props;
  return (
    <div>
      <ReactSelect options={options} onChange={(e) => {if (onChange) {onChange(e)}}} className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full" />
    </div>
  )
})

FormSelect.displayName = 'FormSelect';

type FormRadioSelectOption = {
  value: string;
  label: ReactNode;
}

type FormRadioSelectProps = {
  errors?: any; //TODO
  errorMessage?: string;
  options: Array<FormRadioSelectOption>;
  onChange?: (option: FormRadioSelectOption) => void;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'>;

type FormRadioSelectItemProps = {
  label: ReactNode;
  value: string;
  selected?: boolean;
  onClick: VoidFunction;
}

const FormRadioSelectItem = ({ label, value, selected, onClick }: FormRadioSelectItemProps) => {
  return (
    <div className={`flex my-4 border ${selected ? "bg-blue-200" : "bg-gray-200"} p-4 hover:cursor-pointer`} onClick={onClick}>
      <input type ="radio" value={value} checked={selected} onChange={onClick}/> <span className="px-4">{ label }</span>
    </div>
  )
}

export const FormRadioSelect = React.forwardRef(({errors, errorMessage, ...props}: FormRadioSelectProps, ref) => {
  const { options, onChange } = props;
  const [ selected, setSelected ] = useState<FormRadioSelectOption>(options[0]);
  return (
  <div className="flex w-full gap-4">
    {options.map(option =>
      <FormRadioSelectItem 
        key={option.value}
        label={option.label} 
        value={option.value} 
        selected={selected.value === option.value} 
        onClick={() => {
          setSelected(option);
          onChange && onChange(option);
        }}
    />)}
  </div>
  )
})

FormRadioSelect.displayName = 'FormRadioSelect';


// TODO make the form upload element

type FormFileProps = {
  errors?: any; //TODO
  errorMessage?: string;
  onChange?: (fileChangeEvent: ChangeEvent<HTMLInputElement>) => void;
  fileName?: string;
  children?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const FormFile = React.forwardRef<HTMLInputElement, FormFileProps>(({errors, errorMessage, onChange, fileName, children, ...props}: FormFileProps, ref) => {

  return (
    <div>
      <input
        type="file"
        ref={ref}
        className={`${children ? 'hidden': ''}`}
        {...props}
        onChange={onChange}
      />
      {children && children}
      {fileName && <span className="mt-2 text-sm text-gray-600">{fileName}</span>}
    </div>
  )
})

FormFile.displayName = 'FormFile';

type FormWrapperProps = {
  children: ReactNode;
} & FormHTMLAttributes<HTMLFormElement>

const FormWrapper = ({ children, ...props}: FormWrapperProps) => {
  return (
    <form {...props}>
      { children }
    </form>
  )
}

type FormItemProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>

export const FormItem = ({ children }: FormItemProps) => {
  return (
    <div className="mb-4">
      { children }
    </div>
  )
}

export default FormWrapper;