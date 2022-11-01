import React, { useState, createContext, useEffect } from 'react'
import { CustomMeasureUnits } from '../utils/units'

type DefaultUnits = {
  mass: CustomMeasureUnits
  volume: CustomMeasureUnits
  length: CustomMeasureUnits
  area: CustomMeasureUnits
  volumeFlowRate: CustomMeasureUnits
  temperature: CustomMeasureUnits
  speed: CustomMeasureUnits
  pressure: CustomMeasureUnits
  voltage: CustomMeasureUnits
  current: CustomMeasureUnits
  power: CustomMeasureUnits
  density: CustomMeasureUnits
}

export type DefaultUnitContextType = {
  defaultUnits: DefaultUnits
  setDefaultUnits: (newValue: DefaultUnits) => void
}

const initialValues: DefaultUnits = {
  mass: 'kg',
  volume: 'l',
  length: 'ft',
  area: 'm2',
  volumeFlowRate: 'l/min',
  temperature: 'C',
  speed: 'm/s',
  pressure: 'bar',
  voltage: 'V',
  current: 'A',
  power: 'W',
  density: 'kg/l',
}

function getLocalStorage() {
  try {
    const localdata = window.localStorage.getItem('defaultUnits')
    console.log('getting local storage', localdata)
    return localdata ? JSON.parse(localdata) : initialValues
  } catch (e) {
    // if error, return initial value
    console.error('error getting local data')
    return initialValues
  }
}

export const DefaultUnitContext = createContext<DefaultUnitContextType>({
  defaultUnits: initialValues,
  setDefaultUnits: () => undefined,
})

const DefaultUnitProvider = ({ children }: { children?: React.ReactNode }) => {
  const [defaultUnits, setDefaultUnits] = useState<DefaultUnits>(() => getLocalStorage())

  useEffect(() => {
    setDefaultUnits(getLocalStorage())
  }, [])

  return <DefaultUnitContext.Provider value={{ defaultUnits, setDefaultUnits }}>{children}</DefaultUnitContext.Provider>
}

export default DefaultUnitProvider
