import { InputType } from '../calculators/calculator'
import { units, Units } from '../../../utils/units'

type InputFieldProps = {
  data: InputType
  onChangeValue: ({ id, unit, number }: OnChangeValueProps) => void
}

export type OnChangeValueProps = {
  id: number
  unit?: string
  number?: number
}

export const InputField = ({ data, onChangeValue }: InputFieldProps) => {
  const { id, label, placeholder, type, selected, displayValue, unitType, error, focusText } = data
  const { value, unit } = displayValue

  return (
    <div className="group form-control mb-2 w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <label className="peer input-group">
        <input
          className={`input input-bordered w-full text-base-content ${
            error ? 'input-error text-error' : ' text-base-content'
          } disabled:cursor-text disabled:bg-base-300 disabled:text-base-content`}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={selected}
          onChange={e => onChangeValue({ id, number: Number(e.target.value) })}
        />
        <select
          className={`select select-bordered bg-base-200 ${error ? 'select-error text-error' : ' text-base-content'}`}
          value={unit}
          onChange={e => onChangeValue({ id, unit: e.target.value })}
        >
          {units[unitType as keyof Units].map((unitOption: string, index) => {
            return <option key={index}>{unitOption}</option>
          })}
        </select>
      </label>

      <label className="label hidden py-0 group-focus-within:block">
        <span className={`label-text-alt ${error ? 'text-error' : ' text-base-content'}`}>
          {selected ? 'Calculated Value' : focusText}
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
