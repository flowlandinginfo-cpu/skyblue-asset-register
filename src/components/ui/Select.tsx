import { forwardRef } from 'react'
import clsx from 'clsx'
import { FieldTooltip } from './Tooltip'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:       string
  error?:       string
  helper?:      string
  options:      SelectOption[]
  placeholder?: string
  required?:    boolean
  tooltip?:     string
  tooltipExample?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, options, placeholder, required, tooltip, tooltipExample, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="field-label flex items-center">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
            {tooltip && <FieldTooltip content={tooltip} example={tooltipExample} />}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'field-input bg-white',
            error && 'border-red-400 focus:ring-red-400',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error  && <p className="field-error">{error}</p>}
        {helper && !error && <p className="field-helper">{helper}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
