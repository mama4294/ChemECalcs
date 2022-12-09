import { InputType } from '../calculators/calculator'
import { unitOptions, UnitOptions, UnitOption, addCommas, commasToNumber } from '../../utils/units'

type InputFieldProps = {
  data: InputType
  onChangeValue: any
}

export type OnChangeValueProps = {
  id: number
  unit?: string
  number?: number
}

export const InputField = ({ data, onChangeValue }: InputFieldProps) => {
  const { id, label, placeholder, selected, displayValue, error, unitType, focusText } = data
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
          name={label}
          value={addCommas(value)}
          id={label}
          disabled={selected}
          onChange={e => {
            onChangeValue({ id, number: commasToNumber(e.target.value) })
          }}
          className="disabled:border-1 input input-bordered block w-full pr-16 disabled:cursor-text "
          placeholder={selected ? 'N/A' : placeholder}
        />
        <div className="h-{46} absolute inset-y-0 right-0 flex items-center">
          <label htmlFor="unit" className="sr-only">
            Unit
          </label>
          <select
            id="unit"
            name="unit"
            className="select h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-right focus:outline-0"
            value={unit}
            onChange={e => onChangeValue({ id, unit: e.target.value })}
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
