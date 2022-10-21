import React, { useState, createContext, useEffect } from 'react'

type DefaultUnits = {
  mass: string
  volume: string
  length: string
  area: string
  flowrate: string
  temperature: string
  speed: string
  pressure: string
  voltage: string
  current: string
  power: string
}

export type DefaultUnitContextType = {
  defaultUnits: DefaultUnits
  setDefaultUnits: (newValue: DefaultUnits) => void
}

const initialValues = {
  mass: 'kg',
  volume: 'l',
  length: 'ft',
  area: 'm2',
  flowrate: 'l/min',
  temperature: 'C',
  speed: 'm/s',
  pressure: 'bar',
  voltage: 'V',
  current: 'A',
  power: 'W',
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
