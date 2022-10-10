import { InputField, OnChangeValueProps } from '../inputs/inputField'
import { SolveForDropdown } from '../inputs/solveForDropdown'
import { CalcCard } from './calcCard'

export type InputType = {
  id: number
  name: string
  unitType: string
  type: string
  placeholder: string
  label: string
  displayValue: { value: number; unit: string }
  calculatedValue: { value: number; unit: string }
  solveable: boolean
  selectiontext: string
  equation: string
  selected: boolean
  error: string
}

type CalcContainerProps = {
  title: string
  values: InputType[]
  onChangeSolveSelection: (id: number) => void
  onChangeValue: ({ id, unit, number }: OnChangeValueProps) => void
}

export const Calculator = ({ title, values, onChangeSolveSelection, onChangeValue }: CalcContainerProps) => {
  return (
    <CalcCard title={title}>
      <>
        <SolveForDropdown options={values} onChange={onChangeSolveSelection} />
        <div className="mb-8 flex flex-col">
          {values.map(input => {
            return <InputField key={input.id} data={input} onChangeValue={onChangeValue} />
          })}
        </div>
      </>
    </CalcCard>
  )
}
