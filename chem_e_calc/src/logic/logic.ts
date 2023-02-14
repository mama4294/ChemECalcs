import { convertUnits, dynamicRound } from '../utils/units'
import { ShortInputType } from '../types'

export const updateCalculatedValue = (object: ShortInputType): ShortInputType => {
  const { calculatedValue, displayValue } = object
  const convertedValue = convertUnits({
    value: +displayValue.value, //+ converts string to number
    fromUnit: displayValue.unit,
    toUnit: calculatedValue.unit,
  })
  return { ...object, calculatedValue: { value: convertedValue, unit: calculatedValue.unit } }
}

type ColbrookParameters = {
  initialGuess: number
  roughness: number
  diameter: number
  reynoldsNumber: number
}

export const solveColebrook = ({ initialGuess, roughness, diameter, reynoldsNumber }: ColbrookParameters) => {
  let ff = initialGuess
  let fOld = 0
  let i = 0
  const details = [{ i, ff }]
  while (Math.abs(ff - fOld) > 0.000001 && i < 100) {
    //100 iterations max
    fOld = ff
    ff = 1 / Math.pow(-2 * Math.log10(roughness / (3.72 * diameter) + 2.51 / (reynoldsNumber * Math.sqrt(ff))), 2)
    i++
    details.push({ i, ff })
  }
  return { ff, details }
}

export const linearInterpolation = (x: number, x1: number, x2: number, y1: number, y2: number) => {
  return y1 + ((x - x1) * (y2 - y1)) / (x2 - x1)
}
