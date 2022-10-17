import { InputType } from '../calculators/calculator'
import { units, Units } from '../../utils/units'

type InputFieldProps = {
  data: InputType
  onChangeValue: ({ id, unit, number }: OnChangeValueProps) => void
}

export type OnChangeValueProps = {
  id: number
  unit?: string
  number?: number
}

const addCommas = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const removeNonNumeric = (num: string) => Number(num.replace(/[^0-9]/g, ''))

// export const InputField = ({ data, onChangeValue }: InputFieldProps) => {
//   const { id, label, placeholder, type, selected, displayValue, unitType, error, focusText } = data
//   const { value, unit } = displayValue

//   return (
//     <div className="group form-control mb-2 w-full">
//       <label className="label">
//         <span className="label-text">{label}</span>
//       </label>
//       <label className="peer input-group">
//         <input
//           className={`input input-bordered w-full text-base-content ${
//             error ? 'input-error text-error' : ' text-base-content'
//           } disabled:cursor-text disabled:bg-base-300 disabled:text-base-content`}
//           type={type}
//           value={value}
//           placeholder={placeholder}
//           disabled={selected}
//           onChange={e => onChangeValue({ id, number: Number(e.target.value) })}
//         />
//         <select
//           className={`select select-bordered bg-base-200 ${error ? 'select-error text-error' : ' text-base-content'}`}
//           value={unit}
//           onChange={e => onChangeValue({ id, unit: e.target.value })}
//         >
//           {units[unitType as keyof Units].map((unitOption: string, index) => {
//             return <option key={index}>{unitOption}</option>
//           })}
//         </select>
//       </label>

//       <label className="label hidden py-0 group-focus-within:block">
//         <span className={`label-text-alt ${error ? 'text-error' : ' text-base-content'}`}>
//           {selected ? 'Calculated Value' : focusText}
//         </span>
//       </label>

//       {error && (
//         <label className="peer label py-0">
//           <span className="label-text-alt text-error">{error}</span>
//         </label>
//       )}
//     </div>
//   )
// }

export const InputField = ({ data, onChangeValue }: InputFieldProps) => {
  const { id, label, placeholder, type, selected, displayValue, error, unitType, focusText } = data
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
            console.log('text input', e.target.value)
            console.log('number output', removeNonNumeric(e.target.value))
            onChangeValue({ id, number: removeNonNumeric(e.target.value) })
          }}
          className="disabled:border-1 input input-bordered block w-full pr-16 disabled:cursor-text "
          placeholder={placeholder}
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
            {units[unitType as keyof Units].map((unitOption: string, index) => {
              return <option key={index}>{unitOption}</option>
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

  {
    /* <div className="group form-control mb-2 w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <label className="peer input-group rounded-lg focus-within:ring-2 focus-within:ring-red-500">
        <input
          className={`input input-bordered w-full text-base-content focus:outline-0 ${
            error ? 'input-error text-error' : ' text-base-content'
          } disabled:cursor-text disabled:bg-base-300 disabled:text-base-content`}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={selected}
          onChange={e => onChangeValue({ id, number: Number(e.target.value) })}
        />
        <select
          className={`select select-bordered bg-base-200 focus:outline-0  ${
            error ? 'select-error text-error' : ' text-base-content'
          }`}
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
    </div> */
  }
}
