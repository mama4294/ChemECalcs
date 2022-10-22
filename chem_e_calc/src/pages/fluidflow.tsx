import { NextPage } from 'next'
import React, { useReducer } from 'react'
import { string } from 'zod'
import { Breadcrumbs } from '../components/calculators/breadcrumbs'
import { CalcCard } from '../components/calculators/calcCard'
import { PageContainer } from '../components/calculators/container'
import { CalcHeader } from '../components/calculators/header'

const UnitConversion: NextPage = () => {
  const paths = [{ title: 'Fluid Flow', href: '/fluidflow' }]

  const EXinitialState = { count: 0 }

  const initialState: State = {
    solveSelection: 'flowrate',
    flowrate: {
      name: 'flowrate',
      label: 'Flowrate',
      placeholder: 'Enter a value',
      unitType: 'flowrate',
      displayValue: { value: '1', unit: 'l/m' },
      calculatedValue: { value: 1, unit: 'm3/s' },
      solveable: true,
      selectiontext: 'Solve for flowrate',
      equation: '',
      selected: false,
      focusText: 'Enter fluid flowrate',
      error: '',
    },
    outerDiameter: {
      name: 'outerDiameter',
      label: 'Outer Diameter',
      placeholder: 'Enter a value',
      unitType: 'length',
      displayValue: { value: '1', unit: 'm' },
      calculatedValue: { value: 1, unit: 'm' },
      solveable: true,
      selectiontext: 'Solve for outer diameter',
      equation: '',
      selected: false,
      focusText: 'Enter pipe outer diameter',
      error: '',
    },
    thickness: {
      name: 'thickness',
      label: 'Pipe Thickness',
      placeholder: 'Enter a value',
      unitType: 'length',
      displayValue: { value: '1', unit: 'm' },
      calculatedValue: { value: 1, unit: 'm' },
      solveable: false,
      selectiontext: 'Solve for thickness',
      equation: '',
      selected: false,
      focusText: 'Enter pipe wall thickness',
      error: '',
    },
    velocity: {
      name: 'velocity',
      label: 'Velocity',
      placeholder: 'Enter a value',
      unitType: 'speed',
      displayValue: { value: '1', unit: 'm/s' },
      calculatedValue: { value: 1, unit: 'm/s' },
      solveable: false,
      selectiontext: 'Solve for fluid velocity',
      equation: '',
      selected: false,
      focusText: 'Enter fluid velocity',
      error: '',
    },
  }

  type State = {
    solveSelection: string
    flowrate: InputType
    outerDiameter: InputType
    thickness: InputType
    velocity: InputType
  }

  type InputType = {
    name: string
    label: string
    placeholder: string
    unitType: string
    displayValue: { value: string; unit: string }
    calculatedValue: { value: number; unit: string }
    solveable: boolean
    selectiontext: string
    equation?: string
    selected: boolean
    focusText?: string
    error: string
  }

  type Action =
    | {
        type: ActionKind.CHANGE_SOLVE_SELECTION
        payload: string
      }
    | {
        type: ActionKind.CHANGE_VALUE
      }
    | {
        type: ActionKind.CHANGE_UNIT
      }

  enum ActionKind {
    CHANGE_VALUE = 'CHANGE_VALUE',
    CHANGE_UNIT = 'CHANGE_UNIT',
    CHANGE_SOLVE_SELECTION = 'CHANGE_SOLVE_SELECTION',
  }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.CHANGE_SOLVE_SELECTION:
        return {
          ...state,
          solveSelection: action.payload,
        }
      case ActionKind.CHANGE_VALUE:
        alert('CHANGE VALUE')
        return {
          ...state,
        }
      case ActionKind.CHANGE_UNIT:
        alert('CHANGE UNIT')
        return {
          ...state,
        }
      default:
        alert('Error: State reducer action not recognized')
        return state
    }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  const handleChangeSolveSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionKind.CHANGE_SOLVE_SELECTION, payload: e.target.value })
  }

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Fluid Flow'} text={'Calculate the fluid velocity in a pipe'} />
      <CalcCard title={'Calculator'}>
        <>
          <SolveForDropdown
            options={solveForOptions}
            selection={state.solveSelection}
            onChange={handleChangeSolveSelection}
          />
          <p>{state.solveSelection}</p>
          <button onClick={() => dispatch({ type: ActionKind.CHANGE_VALUE })}>Add</button>
          <button onClick={() => dispatch({ type: ActionKind.CHANGE_UNIT })}>Decrease</button>
        </>
      </CalcCard>
    </PageContainer>
  )
}

export default UnitConversion

const solveForOptions: SolveType[] = [
  { label: 'Velocity', value: 'velocity' },
  { label: 'Flowrate', value: 'flowrate' },
  { label: 'Diameter', value: 'outerDiameter' },
]

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
        {options.map((option, index) => {
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
