import { Measure, Unit } from 'convert-units'

export type AirFlowSystems = 'metric' | 'imperial'
type AirFlowMetricUnits = 'nlpm' | 'nlph' | 'nm3/m' | 'nm3/h'
type AirFlowImperialUnits = 'scfm' | 'scfh'
export type AirFlowUnits = AirFlowMetricUnits | AirFlowImperialUnits

const metric: Record<AirFlowMetricUnits, Unit> = {
  nlpm: {
    name: {
      singular: 'Normal liter per minute',
      plural: 'Normal liters per minute',
    },
    to_anchor: 60,
  },
  nlph: {
    name: {
      singular: 'Normal liter per hour',
      plural: 'Normal liters per hour',
    },
    to_anchor: 1,
  },
  'nm3/m': {
    name: {
      singular: 'Normal cubic meters per minute',
      plural: 'Normal cubic meters per minute',
    },
    to_anchor: 1000 * 60,
  },
  'nm3/h': {
    name: {
      singular: 'Normal cubic meters per hour',
      plural: 'Normal cubic meters per hour',
    },
    to_anchor: 1000,
  },
}

const imperial: Record<AirFlowImperialUnits, Unit> = {
  scfm: {
    name: {
      singular: 'Standard cubic feet per minute',
      plural: 'Standard cubic feet per minute',
    },
    to_anchor: 60,
  },
  scfh: {
    name: {
      singular: 'Standard cubic feet per hour',
      plural: 'Standard cubic feet per hour',
    },
    to_anchor: 1,
  },
}

const airFlow: Measure<AirFlowSystems, AirFlowUnits> = {
  systems: {
    metric,
    imperial,
  },
  anchors: {
    metric: {
      imperial: {
        ratio: 273.15 / (15.55 + 273.15),
      },
    },
    imperial: {
      metric: {
        ratio: (273.15 + 15.55) / 273.15,
      },
    },
  },
}

export default airFlow
