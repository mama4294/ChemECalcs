import { Measure, Unit } from 'convert-units'

export type ViscositySystems = 'metric' | 'imperial'
type ViscosityMetricUnits = 'pa·s' | 'cP' | 'mpa·s'
type ViscosityImperialUnits = 'lb·s/ft2'
export type ViscosityUnits = ViscosityMetricUnits | ViscosityImperialUnits

const metric: Record<ViscosityMetricUnits, Unit> = {
  'pa·s': {
    name: {
      singular: 'pascal second',
      plural: 'pascal second',
    },
    to_anchor: 1,
  },
  'mpa·s': {
    name: {
      singular: 'millipascal second',
      plural: 'millipascal seconds',
    },
    to_anchor: 1 / 1000,
  },
  cP: {
    name: {
      singular: 'centipoise',
      plural: 'centipoises',
    },
    to_anchor: 1 / 1000,
  },
}

const imperial: Record<ViscosityImperialUnits, Unit> = {
  'lb·s/ft2': {
    name: {
      singular: 'pound-seconds per square foot',
      plural: 'pound-seconds per square feet',
    },
    to_anchor: 1,
  },
}

const density: Measure<ViscositySystems, ViscosityUnits> = {
  systems: {
    metric,
    imperial,
  },
  anchors: {
    metric: {
      imperial: {
        ratio: 0.020885434224573,
      },
    },
    imperial: {
      metric: {
        ratio: 1 / 0.020885434224573,
      },
    },
  },
}

export default density
