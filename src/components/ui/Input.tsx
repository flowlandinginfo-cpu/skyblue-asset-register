import { forwardRef } from 'react'
import clsx from 'clsx'
import { FieldTooltip } from './Tooltip'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    string
  error?:    string
  helper?:   string
  required?: boolean
  tooltip?:  string
  tooltipExample?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, required, tooltip, tooltipExample, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="field-label flex items-center">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
            {tooltip && <FieldTooltip content={tooltip} example={tooltipExample} />}
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
