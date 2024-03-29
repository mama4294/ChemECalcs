import configureMeasurements, { allMeasures, AllMeasuresUnits, AllMeasures, AllMeasuresSystems } from 'convert-units'
import density, { DensityUnits } from './measures/densityMeasure'
import viscosity, { ViscosityUnits } from './measures/dynamicViscosityMeasure'
import flowCoefficient, { FlowCoefficientUnits } from './measures/flowCoefficientMeasure'
import airFlow, { AirFlowUnits } from './measures/airFlowMeasure'

const customMeasures = { ...allMeasures, density, viscosity, flowCoefficient, airFlow }

export type CustomMeasureUnits = AllMeasuresUnits | DensityUnits | ViscosityUnits | FlowCoefficientUnits | AirFlowUnits
export type UnitTypes = AllMeasures | 'density' | 'viscosity' | 'time' | 'flowCoefficient' | 'airFlow'

const convert = configureMeasurements<UnitTypes, AllMeasuresSystems, CustomMeasureUnits>(customMeasures)

export const convertUnits = ({ value, fromUnit, toUnit }: { value: number; fromUnit: string; toUnit: string }) => {
  return convert(value)
    .from(fromUnit as AllMeasuresUnits)
    .to(toUnit as AllMeasuresUnits)
}

export const roundTo2 = (num: number) => {
  return Math.round(num * 100) / 100
}

export const dynamicRound = (number: number, points = 2): number => {
  if (number === 0) return 0
  const trimmed = Number(number.toFixed(points))
  if (trimmed !== 0) return trimmed
  return dynamicRound(number, points + 1)
}

export const addCommas = (num: number | string) => {
  if (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } else {
    return ''
  }
}
// export const commasToNumber = (num: string) => Number(num.replace(/[^0-9]/g, ''))
export const commasToNumber = (num: string) => Number(num.replaceAll(',', ''))

export interface Units {
  mass: string[]
  volume: string[]
  length: string[]
  area: string[]
  flowrate: string[]
  temperature: string[]
  speed: string[]
  pressure: string[]
  voltage: string[]
  current: string[]
  power: string[]
  density: string[]
  time: string[]
  viscosity: string[]
  flowCoefficient: string[]
  airFlow: string[]
}

export const units = {
  mass: ['mg', 'g', 'kg', 'oz', 'lb', 'mt', 't'],
  volume: ['mm3', 'cm3', 'ml', 'l', 'm3', 'km3', 'tsp', 'Tbs', 'in3', 'fl-oz', 'cup', 'pnt', 'qt', 'gal', 'ft3', 'yd3'],
  length: ['mm', 'cm', 'm', 'in', 'ft', 'mi'],
  area: ['mm2', 'cm2', 'm2', 'ha', 'km2', 'in2', 'ft2', 'mi2'],
  flowrate: [
    'mm3/s',
    'cm3/s',
    'ml/s',
    'l/s',
    'l/min',
    'l/h',
    'kl/s',
    'kl/min',
    'kl/h',
    'm3/s',
    'm3/min',
    'm3/h',
    'km3/s',
    'tsp/s',
    'Tbs/s',
    'in3/s',
    'in3/min',
    'in3/h',
    'fl-oz/s',
    'fl-oz/min',
    'fl-oz/h',
    'cup/s',
    'pnt/s',
    'pnt/min',
    'pnt/h',
    'qt/s',
    'gal/s',
    'gal/min',
    'gal/h',
    'ft3/s',
    'ft3/min',
    'ft3/h',
    'yd3/s',
    'yd3/min',
    "yd3/h'",
  ],
  temperature: ['C', 'F', 'K', 'R'],
  speed: ['m/s', 'km/h', 'mph', 'knot', 'ft/s'],
  pressure: ['Pa', 'hPa', 'kPa', 'MPa', 'bar', 'torr', 'psi', 'ksi'],
  voltage: ['V', 'mV', 'kV'],
  current: ['A', 'mA', 'kA'],
  power: ['W', 'mW', 'kW', 'MW', 'GW'],
  flowCoefficient: ['Cv', 'Kv'],
}

export type UnitOption = {
  value: string
  label: string
}

export interface UnitOptions {
  mass: UnitOption[]
  volume: UnitOption[]
  length: UnitOption[]
  area: UnitOption[]
  volumeFlowRate: UnitOption[]
  temperature: UnitOption[]
  speed: UnitOption[]
  pressure: UnitOption[]
  voltage: UnitOption[]
  current: UnitOption[]
  power: UnitOption[]
  density: UnitOption[]
  time: UnitOption[]
  viscosity: UnitOption[]
  flowCoefficient: UnitOption[]
  airFlow: UnitOption[]
}

export const unitOptions: UnitOptions = {
  mass: [
    { value: 'mg', label: 'mg' },
    { value: 'g', label: 'g' },
    { value: 'kg', label: 'kg' },
    { value: 'oz', label: 'oz' },
    { value: 'lb', label: 'lb' },
    { value: 'mt', label: 'mt' },
    { value: 't', label: 'ton' },
  ],
  volume: [
    { value: 'mm3', label: 'mm³' },
    { value: 'cm3', label: 'cm³' },
    { value: 'ml', label: 'ml' },
    { value: 'l', label: 'l' },
    { value: 'm3', label: 'm³' },
    { value: 'km3', label: 'km³' },
    { value: 'tsp', label: 'tsp' },
    { value: 'Tbs', label: 'Tbs' },
    { value: 'in3', label: 'in³' },
    { value: 'fl-oz', label: 'fl-oz' },
    { value: 'cup', label: 'cup' },
    { value: 'pnt', label: 'pint' },
    { value: 'qt', label: 'quart' },
    { value: 'gal', label: 'gal' },
    { value: 'ft3', label: 'ft³' },
    { value: 'yd3', label: 'yd³' },
  ],
  length: [
    { value: 'μm', label: 'μm' },
    { value: 'mm', label: 'mm' },
    { value: 'cm', label: 'cm' },
    { value: 'm', label: 'm' },
    { value: 'in', label: 'in' },
    { value: 'ft', label: 'ft' },
    { value: 'mi', label: 'mile' },
  ],

  area: [
    { value: 'mm2', label: 'mm²' },
    { value: 'cm2', label: 'cm²' },
    { value: 'm2', label: 'm²' },
    { value: 'ha', label: 'ha' },
    { value: 'km2', label: 'km²' },
    { value: 'in2', label: 'in²' },
    { value: 'ft2', label: 'ft²' },
    { value: 'mi2', label: 'mi²' },
  ],

  volumeFlowRate: [
    { value: 'mm3/s', label: 'mm³/s' },
    { value: 'cm3/s', label: 'cm³/s' },
    { value: 'ml/s', label: 'ml/s' },
    { value: 'l/s', label: 'l/s' },
    { value: 'l/min', label: 'lpm' },
    { value: 'l/h', label: 'lph' },
    { value: 'm3/s', label: 'm³/s' },
    { value: 'm3/min', label: 'm³/min' },
    { value: 'm3/h', label: 'm³/h' },
    { value: 'in3/s', label: 'in³/s' },
    { value: 'in3/min', label: 'in³/min' },
    { value: 'in3/h', label: 'in³/h' },
    { value: 'fl-oz/s', label: 'fl-oz/s' },
    { value: 'fl-oz/min', label: 'fl-oz/min' },
    { value: 'fl-oz/h', label: 'fl-oz/h' },
    { value: 'gal/s', label: 'gal/s' },
    { value: 'gal/min', label: 'gpm' },
    { value: 'gal/h', label: 'gph' },
    { value: 'ft3/s', label: 'ft³/s' },
    { value: 'ft3/min', label: 'ft³/min' },
    { value: 'ft3/h', label: 'ft³/h' },
    { value: 'yd3/s', label: 'yd³/s' },
    { value: 'yd3/min', label: 'yd³/min' },
    { value: 'yd3/h', label: 'yd³/h' },
  ],

  temperature: [
    { value: 'C', label: '°C' },
    { value: 'F', label: '°F' },
    { value: 'K', label: '°K' },
    { value: 'R', label: '°R' },
  ],

  speed: [
    { value: 'm/s', label: 'm/s' },
    { value: 'km/h', label: 'km/h' },
    { value: 'mph', label: 'mph' },
    { value: 'knot', label: 'knot' },
    { value: 'ft/s', label: 'fps' },
  ],
  pressure: [
    { value: 'Pa', label: 'Pa' },
    { value: 'hPa', label: 'hPa' },
    { value: 'kPa', label: 'kPa' },
    { value: 'MPa', label: 'MPa' },
    { value: 'bar', label: 'bar' },
    { value: 'torr', label: 'torr' },
    { value: 'psi', label: 'psi' },
  ],

  voltage: [
    { value: 'V', label: 'V' },
    { value: 'mV', label: 'mV' },
    { value: 'kV', label: 'kV' },
  ],

  current: [
    { value: 'A', label: 'A' },
    { value: 'mA', label: 'mA' },
    { value: 'kA', label: 'kA' },
  ],

  power: [
    { value: 'W', label: 'W' },
    { value: 'mW', label: 'mW' },
    { value: 'kW', label: 'kW' },
    { value: 'MW', label: 'MW' },
    { value: 'GW', label: 'GW' },
  ],
  density: [
    { value: 'g/ml', label: 'g/ml' },
    { value: 'kg/l', label: 'kg/l' },
    { value: 'kg/m3', label: 'kg/m³' },
    { value: 'g/cm3', label: 'g/cm³' },
    { value: 'lb/ft3', label: 'lb/ft³' },
  ],
  time: [
    { value: 's', label: 's' },
    { value: 'min', label: 'min' },
    { value: 'h', label: 'hr' },
    { value: 'd', label: 'day' },
  ],
  viscosity: [
    { value: 'pa·s', label: 'pa·s' },
    { value: 'mpa·s', label: 'mpa·s' },
    { value: 'cP', label: 'cP' },
    { value: 'lb·s/ft2', label: 'lb·s/ft2' },
  ],
  flowCoefficient: [
    { value: 'Kv', label: 'Kv' },
    { value: 'Cv', label: 'Cv' },
  ],
  airFlow: [
    { value: 'nlpm', label: 'nlpm' },
    { value: 'nlph', label: 'nlph' },
    { value: 'nm3/m', label: 'nm3/m' },
    { value: 'nm3/h', label: 'nm3/h' },
    { value: 'scfm', label: 'scfm' },
    { value: 'scfh', label: 'scfh' },
  ],
}

export const unitTypes = [
  { value: 'mass', label: 'Mass' },
  { value: 'volume', label: 'Volume' },
  { value: 'length', label: 'Length' },
  { value: 'area', label: 'Area' },
  { value: 'volumeFlowRate', label: 'Flowrate' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'speed', label: 'Speed' },
  { value: 'pressure', label: 'Pressure' },
  { value: 'voltage', label: 'Voltage' },
  { value: 'current', label: 'Current' },
  { value: 'power', label: 'Power' },
  { value: 'density', label: 'Density' },
  { value: 'time', label: 'Time' },
  { value: 'viscosity', label: 'Viscosity' },
  { value: 'flowCoeffient', label: 'flowCoefficient' },
]
