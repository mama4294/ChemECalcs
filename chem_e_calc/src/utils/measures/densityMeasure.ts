import { Measure, Unit } from 'convert-units'

export type DensitySystems = 'metric' | 'imperial'
type DensityMetricUnits = 'kg/l' | 'kg/m3' | 'g/cm3' | 'g/ml'
type DensityImperialUnits = 'lb/ft3'
export type DensityUnits = DensityMetricUnits | DensityImperialUnits

const metric: Record<DensityMetricUnits, Unit> = {
  'kg/l': {
    name: {
      singular: 'Kilograms per liter',
      plural: 'Kilograms per liter',
    },
    to_anchor: 1,
  },
  'kg/m3': {
    name: {
      singular: 'Kilograms per cubic meter',
      plural: 'Kilograms per cubic meter',
    },
    to_anchor: 1 / 1000,
  },
  'g/cm3': {
    name: {
      singular: 'Grams per cubic meter',
      plural: 'Grams per cubic meter',
    },
    to_anchor: 1,
  },
  'g/ml': {
    name: {
      singular: 'Grams per miliLiter',
      plural: 'Grams per miliLiter',
    },
    to_anchor: 1,
  },
}

const imperial: Record<DensityImperialUnits, Unit> = {
  'lb/ft3': {
    name: {
      singular: 'Pounds per cubic foot',
      plural: 'Pounds per cubic foot',
    },
    to_anchor: 1,
  },
}

const density: Measure<DensitySystems, DensityUnits> = {
  systems: {
    metric,
    imperial,
  },
  anchors: {
    metric: {
      imperial: {
        ratio: 62.428,
      },
    },
    imperial: {
      metric: {
        ratio: 1 / 62.428,
      },
    },
  },
}

export default density
