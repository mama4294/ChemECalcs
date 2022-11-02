import { UnitTypes } from './utils/units'

export type ShortInputType = {
  name: string
  label: string
  placeholder: string
  unitType: UnitTypes
  displayValue: { value: string; unit: string }
  calculatedValue: { value: number; unit: string }
  selectiontext: string
  focusText: string
  error: string
}
