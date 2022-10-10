import { InputType } from '../calculators/calculatorContainer'

type SolveForProps = {
  options: InputType[]
  onChange: (id: number) => void
}

export const SolveForDropdown = ({ options, onChange }: SolveForProps) => {
  const selectedValueId = options.find(option => option.selected === true)?.id

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Solve for</span>
      </label>
      <select
        className="select input-bordered w-full bg-base-200 text-base-content"
        value={selectedValueId}
        onChange={e => onChange(Number(e.target.value))}
      >
        {options.map(option => {
          if (option.solveable)
            return (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            )
        })}
      </select>
    </div>
  )
}
