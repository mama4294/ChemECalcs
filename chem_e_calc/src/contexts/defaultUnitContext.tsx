import React, { useState, createContext } from 'react'
import { UnitOption } from '../utils/units'

type DefaultUnits = {
  mass: UnitOption
  volume: UnitOption
  length: UnitOption
  area: UnitOption
  flowrate: UnitOption
  temperature: UnitOption
  speed: UnitOption
  pressure: UnitOption
  voltage: UnitOption
  current: UnitOption
  power: UnitOption
}

export type DefaultUnitContextType = {
  defaultUnits: DefaultUnits
  setDefaultUnits: (newValue: DefaultUnits) => void
}

const initialValues = {
  mass: { value: 'kg', label: 'kg' },
  volume: { value: 'l', label: 'l' },
  length: { value: 'm', label: 'm' },
  area: { value: 'm2', label: 'm²' },
  flowrate: { value: 'l/min', label: 'lpm' },
  temperature: { value: 'C', label: '°C' },
  speed: { value: 'm/s', label: 'm/s' },
  pressure: { value: 'bar', label: 'bar' },
  voltage: { value: 'V', label: 'V' },
  current: { value: 'A', label: 'A' },
  power: { value: 'W', label: 'W' },
}

export const DefaultUnitContext = createContext<DefaultUnitContextType | null>({
  defaultUnits: initialValues,
  setDefaultUnits: () => undefined,
})

const DefaultUnitProvider = ({ children }: { children?: React.ReactNode }) => {
  const [defaultUnits, setDefaultUnits] = useState<DefaultUnits>(initialValues)

  return <DefaultUnitContext.Provider value={{ defaultUnits, setDefaultUnits }}>{children}</DefaultUnitContext.Provider>
}

export default DefaultUnitProvider
