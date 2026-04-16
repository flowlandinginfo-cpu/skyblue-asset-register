import { forwardRef } from 'react'
import clsx from 'clsx'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:  string
  error?:  string
  helper?: string
  required?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, required, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="field-label">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={3}
          className={clsx(
            'field-input resize-none',
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
Textarea.displayName = 'Textarea'
