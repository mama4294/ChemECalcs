import { NextPage } from 'next'
import React, { useState } from 'react'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { Equation, VariableDefinition } from '../../components/Layout/Equation'
import { InputFieldDynamic } from '../../components/inputs/inputField'
import { Metadata } from '../../components/Layout/Metadata'
import { convertUnits, unitOptions } from '../../utils/units'

//TODO add equations

type SolveSelectionOptions = 'molarity' | 'mass' | 'volume'

type EngineeringValue = {
  name: string
  value: string
  unit: string
  error?: string
}

type State = {
  concentration: EngineeringValue
  molarity: EngineeringValue
  volume: EngineeringValue
  mass: EngineeringValue
  molarMass: EngineeringValue
}

const UnitConversion: NextPage = () => {
  const paths = [
    { title: 'Fermentation', href: '/fermentation/' },
    { title: 'Molarity', href: '/fermentation/molarity' },
  ]

  const initialState: State = {
    concentration: {
      name: 'concentration',
      value: '50',
      unit: '%w/w',
    },
    molarity: {
      name: 'molarity',
      value: '2',
      unit: 'M',
    },
    volume: {
      name: 'volume',
      value: '5',
      unit: 'l',
    },
    mass: {
      name: 'mass',
      value: '1,959.88',
      unit: 'g',
    },
    molarMass: {
      name: 'molarMass',
      value: '97.994',
      unit: 'g/mol',
    },
  }

  const solveForOptions: SolveType[] = [
    { label: 'Molarity', value: initialState.molarity.name },
    { label: 'Mass', value: initialState.mass.name },
    { label: 'Volume', value: initialState.volume.name },
  ]

  const [state, setState] = useState<State>(initialState)
  const [solveSelection, setSolveSelection] = useState<SolveSelectionOptions>('molarity')

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newObject = { ...state[name as keyof State], value }
    setState(calculateAnswer({ ...state, [name]: newObject }, solveSelection))
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newObject = { ...state[name as keyof State], unit: value }
    setState(calculateAnswer({ ...state, [name]: newObject }, solveSelection))
  }

  const handleChangeSolveSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSolveSelection(e.target.value as SolveSelectionOptions)
  }

  const resetErrorMessages = (state: State): State => {
    return {
      ...state,
      concentration: { ...state.concentration, error: '' },
      molarity: { ...state.molarity, error: '' },
      volume: { ...state.volume, error: '' },
      mass: { ...state.mass, error: '' },
      molarMass: { ...state.molarMass, error: '' },
    }
  }

  const calculateAnswer = (state: State, solveSelection: SolveSelectionOptions): State => {
    const { concentration, molarMass, molarity, mass, volume } = state
    const inputConcentration = +concentration.value.replace(/[^\d.-]/g, '') / 100 //%
    const inputMolarMass = +molarMass.value.replace(/[^\d.-]/g, '') //g/mol
    const inputMolarity = +molarity.value.replace(/[^\d.-]/g, '') //mol/L
    const inputMass = convertUnits({ value: +mass.value.replace(/[^\d.-]/g, ''), fromUnit: mass.unit, toUnit: 'g' }) // g
    const inputVolume = convertUnits({
      value: +volume.value.replace(/[^\d.-]/g, ''),
      fromUnit: volume.unit,
      toUnit: 'l',
    }) // L
    let newState = resetErrorMessages(state)
    //validate inputs

    //mass
    if (solveSelection != mass.name) {
      if (isNaN(inputMass)) {
        newState = { ...newState, mass: { ...newState.mass, error: 'Must be a number' } }
      } else if (inputMass < 0) {
        newState = { ...newState, mass: { ...newState.mass, error: 'Must be positive' } }
      }
    }

    //volume
    if (solveSelection != volume.name) {
      if (isNaN(inputVolume)) {
        newState = { ...newState, volume: { ...newState.volume, error: 'Must be a number' } }
      } else if (inputVolume < 0) {
        newState = { ...newState, volume: { ...newState.volume, error: 'Must be positive' } }
      }
    }

    //molarity
    if (solveSelection != molarity.name) {
      if (isNaN(inputMolarity)) {
        newState = { ...newState, molarity: { ...newState.molarity, error: 'Must be a number' } }
      } else if (inputMolarity < 0) {
        newState = { ...newState, molarity: { ...newState.molarity, error: 'Must be positive' } }
      }
    }

    //concentration
    if (isNaN(inputConcentration)) {
      newState = { ...newState, concentration: { ...newState.concentration, error: 'Must be a number' } }
    } else if (inputConcentration < 0 || inputConcentration > 1) {
      newState = { ...newState, concentration: { ...newState.concentration, error: 'Must be between 0-100' } }
    }

    //molarmass
    if (isNaN(inputMolarMass)) {
      newState = { ...newState, molarMass: { ...newState.molarMass, error: 'Must be a number' } }
    } else if (inputMolarMass <= 0) {
      newState = { ...newState, molarMass: { ...newState.molarMass, error: 'Must be positive' } }
    }

    //Solve
    switch (solveSelection) {
      case 'molarity':
        let num = (inputMass * inputConcentration) / inputMolarMass / inputVolume //mol/L
        let str = num.toLocaleString()
        return { ...newState, molarity: { ...newState.molarity, value: str } }

      case 'mass':
        num = convertUnits({
          value: (inputMolarity * inputVolume * inputMolarMass) / inputConcentration,
          fromUnit: 'g',
          toUnit: newState.mass.unit,
        })
        str = num.toLocaleString()
        return { ...newState, mass: { ...newState.mass, value: str } }

      case 'volume':
        num = convertUnits({
          value: (inputMass * inputConcentration) / inputMolarMass / inputMolarity,
          fromUnit: 'l',
          toUnit: newState.volume.unit,
        })
        str = num.toLocaleString()
        return { ...newState, volume: { ...newState.volume, value: str } }

      default:
        const neverEver: never = solveSelection
        console.error('Error: State reducer action not recognized, ', neverEver)
        return state
    }
  }

  const { concentration, molarMass, molarity, mass, volume } = state
  console.table(state)

  return (
    <>
      <Metadata
        title="Molarity Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Fluid, flow, pipe, velocity, diameter, thickness, flowrate, calculator, chemical, engineering, process, engineer, efficiency, accuracy"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Molarity'} text={'Calculate the molarity of a solution'} />
        <CalcBody>
          <CalcCard title={'Calculator'}>
            <>
              <SolveForDropdown
                options={solveForOptions}
                selection={solveSelection}
                onChange={handleChangeSolveSelection}
              />
              <div className="mb-8 flex flex-col">
                <InputFieldDynamic
                  name={molarMass.name}
                  label="Chemical Molar Mass"
                  value={molarMass.value}
                  unit={molarMass.unit}
                  disabled={solveSelection === molarMass.name}
                  error={molarMass.error}
                  onChangeValue={handleChangeValue}
                  onChangeUnit={handleChangeUnit}
                />
                <InputFieldDynamic
                  name={concentration.name}
                  label="Chemical Concentration"
                  value={concentration.value}
                  unit={concentration.unit}
                  disabled={solveSelection === concentration.name}
                  error={concentration.error}
                  onChangeValue={handleChangeValue}
                  onChangeUnit={handleChangeUnit}
                />
                <InputFieldDynamic
                  name={mass.name}
                  label="Chemical Mass"
                  value={mass.value}
                  unit={mass.unit}
                  unitOptions={unitOptions.mass}
                  disabled={solveSelection === mass.name}
                  error={mass.error}
                  onChangeValue={handleChangeValue}
                  onChangeUnit={handleChangeUnit}
                />
                <InputFieldDynamic
                  name={volume.name}
                  label="Solution Volume"
                  value={volume.value}
                  unit={volume.unit}
                  unitOptions={unitOptions.volume}
                  disabled={solveSelection === volume.name}
                  error={volume.error}
                  onChangeValue={handleChangeValue}
                  onChangeUnit={handleChangeUnit}
                />
                <InputFieldDynamic
                  name={molarity.name}
                  label="Solution Molarity"
                  value={molarity.value}
                  unit={molarity.unit}
                  disabled={solveSelection === molarity.name}
                  error={molarity.error}
                  onChangeValue={handleChangeValue}
                  onChangeUnit={handleChangeUnit}
                />
              </div>
            </>
          </CalcCard>
          <EquationCard />
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default UnitConversion

type SolveType = {
  label: string
  value: string
}

type SolveForDropdown = {
  selection: string
  options: SolveType[]
  onChange: any
}

const SolveForDropdown = ({ selection, options, onChange }: SolveForDropdown) => {
  return (
    <div className="form-control mb-2 w-full">
      <label className="label">
        <span className="label-text">Solve for</span>
      </label>

      <select className="select input-bordered w-full" value={selection} onChange={onChange}>
        {options.map((option: SolveType, index: number) => {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

const EquationCard = () => {
  return (
    <CalcCard title="Governing Equation">
      <>
        <p>
          This calculator finds the molarity, the moles per liter, of a chemical solution. This is useful for making
          standard solutions by diluting more concentrated chemicals. The governing equation is a function of mass,
          volume, chemical molecular weight, and chemical concentration.
        </p>
        <Equation equation={`$$M = mol/L$$`} />
        <p>The following equations are used to find molarity, chemical mass, or volume of the solution</p>
        <Equation equation={`$$M = \\frac{m ⋅ C}{W_{m} ⋅ V}$$`} />
        <Equation equation={`$$m = \\frac{V ⋅ W_{m}}{M ⋅ C}$$`} />
        <Equation equation={`$$V = \\frac{m ⋅ C}{W_{m} ⋅ M}$$`} />
        <p className="text-lg font-medium">Definitions</p>
        <VariableDefinition equation={`$$M = $$`} definition="Molarity" />
        <VariableDefinition equation={`$$m = $$`} definition="Mass" />
        <VariableDefinition equation={`$$V = $$`} definition="Volume" />
        <VariableDefinition equation={`$$C = $$`} definition="Chemical Concentration" />
        <VariableDefinition equation={`$$W_{m} = $$`} definition="Molecular Weight" />
      </>
    </CalcCard>
  )
}
