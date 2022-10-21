import { convertUnits, roundTo2 } from '../utils/units'
import { InputType } from '../components/calculators/calculator'

type ChangeSolveSelectionProps = {
  id: number
  array: InputType[]
}

export const handleChangeSolveSelection = ({ id, array }: ChangeSolveSelectionProps): InputType[] => {
  return array.map(o => {
    if (o.id === id) return { ...o, selected: true }
    else return { ...o, selected: false }
  })
}

export type UpdateArrayProps = {
  id: number
  unit?: string
  number?: number
  array: InputType[]
}

export const updateArray = ({ id, unit, number, array }: UpdateArrayProps): InputType[] => {
  if (unit) {
    return array.map(o => {
      if (o.id === id) {
        const convertedValue = convertUnits({
          value: o.displayValue.value as number,
          fromUnit: unit,
          toUnit: o.calculatedValue.unit,
        })
        return {
          ...o,
          displayValue: { value: o.displayValue.value, unit: unit },
          calculatedValue: {
            value: convertedValue as number,
            unit: o.calculatedValue.unit,
          },
        }
      } else return o
    })
  }

  if (number || number == 0) {
    return array.map(o => {
      if (o.id === id) {
        const convertedValue = convertUnits({
          value: number,
          fromUnit: o.displayValue.unit,
          toUnit: o.calculatedValue.unit,
        })
        return {
          ...o,
          displayValue: { value: number, unit: o.displayValue.unit },
          calculatedValue: {
            value: convertedValue,
            unit: o.calculatedValue.unit,
          },
        }
      } else return o
    })
  }

  return array
}

export const updateAnswer = (inputArray: InputType[], answerValue: number, answerName: string) => {
  return inputArray.map(o => {
    //convert calculed value to display value
    if (o.name === answerName) {
      const displayValue = convertUnits({
        value: answerValue,
        fromUnit: o.calculatedValue.unit,
        toUnit: o.displayValue.unit,
      })
      return {
        ...o,
        displayValue: {
          value: roundTo2(displayValue),
          unit: o.displayValue.unit,
        },
        calculatedValue: { value: answerValue, unit: o.calculatedValue.unit },
      }
    } else return o
  })
}

export const validateNotBlank = (inputArray: InputType[] | null) => {
  return inputArray?.map(value => {
    if (value.selected) return { ...value, error: '' }
    if (value.displayValue.value <= 0) {
      return { ...value, error: 'Must not be blank' }
    }
    return { ...value, error: '' }
  })
}
