type SolveForDropdown = {
  selection: string
  options: { label: string; value: string }[]
  onChange: any
}

export const SolveForDropdown = ({ selection, options, onChange }: SolveForDropdown) => {
  return (
    <div className="form-control mb-2 w-full">
      <label className="label">
        <span className="label-text">Solve for</span>
      </label>

      <select className="select input-bordered w-full" value={selection} onChange={onChange}>
        {options.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}
