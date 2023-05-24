import { Measure, Unit } from 'convert-units'

export type AirFlowSystems = 'metric' | 'imperial'
type AirFlowMetricUnits = 'NLPM' | 'NLPH'
type AirFlowImperialUnits = 'SCFM' | 'SCFH'
export type AirFlowUnits = AirFlowMetricUnits | AirFlowImperialUnits

const metric: Record<AirFlowMetricUnits, Unit> = {
  NLPM: {
    name: {
      singular: 'Normal liter per minute',
      plural: 'Normal liters per minute',
    },
    to_anchor: 1,
  },
  NLPH: {
    name: {
      singular: 'Normal liter per hour',
      plural: 'Normal liters per hour',
    },
    to_anchor: 1,
  },
}

const imperial: Record<AirFlowImperialUnits, Unit> = {
  SCFM: {
    name: {
      singular: 'Standard cubic feet per minute',
      plural: 'Standard cubic feet per minute',
    },
    to_anchor: 1,
  },
  SCFH: {
    name: {
      singular: 'Standard cubic feet per hour',
      plural: 'Standard cubic feet per hour',
    },
    to_anchor: 1,
  },
}

const AirFlow: Measure<AirFlowSystems, AirFlowUnits> = {
  systems: {
    metric,
    imperial,
  },
  anchors: {
    metric: {
      imperial: {
        ratio: 1.156,
      },
    },
    imperial: {
      metric: {
        ratio: 1 / 1.156,
      },
    },
  },
}

export default AirFlow
