import { ButtonHTMLAttributes, ReactNode } from "react"

const PRIMARY_STYLES = "px-6 py-2 text-sm text-gray-200 bg-blue-700 rounded focus:outline-none focus:bg-blue-700 hover:bg-blue-600"
const SECONDARY_STYLES = "px-6 py-2 text-sm text-gray-700 bg-gray-200 rounded focus:outline-none focus:bg-gray-200 hover:bg-gray-400 hover:text-gray-100"
const TERTIARY_STYLES ="px-6 py-2 text-sm text-blue-700 underline focus:outline-none hover:rounded hover:bg-gray-100"
const DISABLED_STYLES = "px-6 py-2 text-sm text-gray-200 bg-gray-400 rounded focus:outline-none"

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  DISABLED = 'disabled',
}

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({children, variant = ButtonVariant.PRIMARY, ...props}: ButtonProps) => {
  const getVariantStyles = (variant: ButtonVariant) => {
    switch (variant) {
      case ButtonVariant.PRIMARY: return PRIMARY_STYLES
      case ButtonVariant.SECONDARY: return SECONDARY_STYLES
      case ButtonVariant.TERTIARY: return TERTIARY_STYLES
      case ButtonVariant.DISABLED: return DISABLED_STYLES
    }
    return PRIMARY_STYLES;

  }
  return (
    <button 
      {...props}
      className={getVariantStyles(variant)}
    >
      { children }
    </button>
  )
}

export default Button;