import configureMeasurements, { allMeasures, AllMeasuresUnits, AllMeasures, AllMeasuresSystems } from 'convert-units'
import density, { DensityUnits } from './measures/densityMeasure'

const customMeasures = { ...allMeasures, density }

export type CustomMeasureUnits = AllMeasuresUnits | DensityUnits | TimeUnits
export type UnitTypes = AllMeasures | 'density' | 'time'

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
    { value: 'mm3', label: 'mm??' },
    { value: 'cm3', label: 'cm??' },
    { value: 'ml', label: 'ml' },
    { value: 'l', label: 'l' },
    { value: 'm3', label: 'm??' },
    { value: 'km3', label: 'km??' },
    { value: 'tsp', label: 'tsp' },
    { value: 'Tbs', label: 'Tbs' },
    { value: 'in3', label: 'in??' },
    { value: 'fl-oz', label: 'fl-oz' },
    { value: 'cup', label: 'cup' },
    { value: 'pnt', label: 'pint' },
    { value: 'qt', label: 'quart' },
    { value: 'gal', label: 'gal' },
    { value: 'ft3', label: 'ft??' },
    { value: 'yd3', label: 'yd??' },
  ],
  length: [
    { value: 'mm', label: 'mm' },
    { value: 'cm', label: 'cm' },
    { value: 'm', label: 'm' },
    { value: 'in', label: 'in' },
    { value: 'ft', label: 'ft' },
    { value: 'mi', label: 'mile' },
  ],

  area: [
    { value: 'mm2', label: 'mm??' },
    { value: 'cm2', label: 'cm??' },
    { value: 'm2', label: 'm??' },
    { value: 'ha', label: 'ha' },
    { value: 'km2', label: 'km??' },
    { value: 'in2', label: 'in??' },
    { value: 'ft2', label: 'ft??' },
    { value: 'mi2', label: 'mi??' },
  ],

  volumeFlowRate: [
    { value: 'mm3/s', label: 'mm??/s' },
    { value: 'cm3/s', label: 'cm??/s' },
    { value: 'ml/s', label: 'ml/s' },
    { value: 'l/s', label: 'l/s' },
    { value: 'l/min', label: 'lpm' },
    { value: 'l/h', label: 'lph' },
    { value: 'm3/s', label: 'm??/s' },
    { value: 'm3/min', label: 'm??/min' },
    { value: 'm3/h', label: 'm??/h' },
    { value: 'in3/s', label: 'in??/s' },
    { value: 'in3/min', label: 'in??/min' },
    { value: 'in3/h', label: 'in??/h' },
    { value: 'fl-oz/s', label: 'fl-oz/s' },
    { value: 'fl-oz/min', label: 'fl-oz/min' },
    { value: 'fl-oz/h', label: 'fl-oz/h' },
    { value: 'gal/s', label: 'gal/s' },
    { value: 'gal/min', label: 'gpm' },
    { value: 'gal/h', label: 'gph' },
    { value: 'ft3/s', label: 'ft??/s' },
    { value: 'ft3/min', label: 'ft??/min' },
    { value: 'ft3/h', label: 'ft??/h' },
    { value: 'yd3/s', label: 'yd??/s' },
    { value: 'yd3/min', label: 'yd??/min' },
    { value: 'yd3/h', label: 'yd??/h' },
  ],

  temperature: [
    { value: 'C', label: '??C' },
    { value: 'F', label: '??F' },
    { value: 'K', label: '??K' },
    { value: 'R', label: '??R' },
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
    { value: 'kg/m3', label: 'kg/m??' },
    { value: 'g/cm3', label: 'g/cm??' },
    { value: 'lb/ft3', label: 'lb/ft??' },
  ],
  time: [
    { value: 's', label: 's' },
    { value: 'min', label: 'min' },
    { value: 'h', label: 'hr' },
    { value: 'd', label: 'day' },
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
]
