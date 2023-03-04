import { Measure, Unit } from 'convert-units'

export type FlowCoefficientSystems = 'metric' | 'imperial'
type FlowCoefficientMetricUnits = 'Kv'
type FlowCoefficientImperialUnits = 'Cv'
export type FlowCoefficientUnits = FlowCoefficientMetricUnits | FlowCoefficientImperialUnits

const metric: Record<FlowCoefficientMetricUnits, Unit> = {
  Kv: {
    name: {
      singular: 'Flow Factor',
      plural: 'Flow Factor',
    },
    to_anchor: 1,
  },
}

const imperial: Record<FlowCoefficientImperialUnits, Unit> = {
  Cv: {
    name: {
      singular: 'Flow coefficient',
      plural: 'Flow coefficient',
    },
    to_anchor: 1,
  },
}

const flowCoefficient: Measure<FlowCoefficientSystems, FlowCoefficientUnits> = {
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

export default flowCoefficient
