import { forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:   string
  error?:   string
  helper?:  string
  required?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, required, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="field-label">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'field-input',
            error && 'border-red-400 focus:ring-red-400',
            className
          )}
          {...props}
        />
        {error  && <p className="field-error">{error}</p>}
        {helper && !error && <p className="field-helper">{helper}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
