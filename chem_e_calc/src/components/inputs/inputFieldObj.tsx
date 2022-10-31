import { unitOptions, UnitOptions, UnitOption, addCommas, commasToNumber } from '../../utils/units'

type InputFieldProps = {
  name: string
  label: string
  placeholder: string
  selected: boolean
  displayValue: {
    value: string
    unit: string
  }
  error: string
  unitType: string
  focusText: string
  onChangeValue: any
  onChangeUnit: any
}

export const InputFieldWithUnit = ({
  name,
  label,
  placeholder,
  selected,
  displayValue,
  error,
  unitType,
  focusText,
  onChangeValue,
  onChangeUnit,
}: InputFieldProps) => {
  const { value, unit } = displayValue
  return (
    <div className="mb-2">
      <label htmlFor={label} className="label ">
        {label}
      </label>
      <div
        className={`peer input relative h-full w-full px-0 ${error ? 'input-error text-error' : ' text-base-content'}`}
      >
        <input
          type="text"
          name={name}
          value={value}
          id={label}
          disabled={selected}
          onChange={onChangeValue}
          className="disabled:border-1 input input-bordered block w-full pr-16 disabled:cursor-text "
          placeholder={selected ? 'N/A' : placeholder}
        />
        <div className="h-{46} absolute inset-y-0 right-0 flex items-center">
          <label htmlFor="unit" className="sr-only">
            Unit
          </label>
          <select
            id="unit"
            name={name}
            className="select h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-right focus:outline-0"
            value={unit}
            onChange={onChangeUnit}
          >
            {unitOptions[unitType as keyof UnitOptions].map((unitOption: UnitOption, index) => {
              return (
                <option key={index} value={unitOption.value}>
                  {unitOption.label}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      <label className="label hidden py-0 peer-focus-within:block">
        <span className={`label-text-alt ${error ? 'text-error' : ' text-base-content'}`}>
          {selected ? '' : focusText}
        </span>
      </label>

      {error && (
        <label className="peer label py-0">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  )
}

type InputFieldUnitlessProps = {
  name: string
  label: string
  placeholder: string
  selected: boolean
  displayValue: {
    value: string
    unit: string
  }
  error: string
  unitType: string
  focusText: string
  onChangeValue: any
}

export const InputFieldConstant = ({
  name,
  label,
  placeholder,
  selected,
  displayValue,
  error,
  focusText,
  onChangeValue,
}: InputFieldUnitlessProps) => {
  const { value, unit } = displayValue
  return (
    <div className="mb-2">
      <label htmlFor={label} className="label ">
        {label}
      </label>
      <div
        className={`peer input relative h-full w-full px-0 ${error ? 'input-error text-error' : ' text-base-content'}`}
      >
        <input
          type="text"
          name={name}
          value={value}
          id={label}
          disabled={selected}
          onChange={onChangeValue}
          className="disabled:border-1 input input-bordered block w-full pr-16 disabled:cursor-text "
          placeholder={selected ? 'N/A' : placeholder}
        />
        <div className="h-{46} absolute inset-y-0 right-0 mr-4 flex items-center">{unit}</div>
      </div>
      <label className="label hidden py-0 peer-focus-within:block">
        <span className={`label-text-alt ${error ? 'text-error' : ' text-base-content'}`}>
          {selected ? '' : focusText}
        </span>
      </label>

      {error && (
        <label className="peer label py-0">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  )
}

type InputDropdownProps = {
  name: string
  label: string

  selected: boolean
  error: string
  focusText: string
  value: string
  options: {
    value: string
    label: string
  }[]
  onChange: any
}

export const InputDropdown = ({
  name,
  label,
  selected,
  error,
  focusText,
  value,
  onChange,
  options,
}: InputDropdownProps) => {
  return (
    <div className="mb-2">
      <label htmlFor={label} className="label ">
        {label}
      </label>
      <div
        className={`peer input relative h-full w-full px-0 ${error ? 'input-error text-error' : ' text-base-content'}`}
      >
        <select
          id="unit"
          name={name}
          className="input select input-bordered h-full w-full rounded-md"
          value={value}
          onChange={onChange}
        >
          {options.map(option => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
          })}
        </select>
      </div>
      <label className="label hidden py-0 peer-focus-within:block">
        <span className={`label-text-alt ${error ? 'text-error' : ' text-base-content'}`}>
          {selected ? '' : focusText}
        </span>
      </label>

      {error && (
        <label className="peer label py-0">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  )
}
