import { NextPage } from 'next'
import React, { useReducer } from 'react'
import { object } from 'zod'
import { Breadcrumbs } from '../components/calculators/breadcrumbs'
import { CalcCard } from '../components/calculators/calcCard'
import { PageContainer } from '../components/calculators/container'
import { CalcHeader } from '../components/calculators/header'
import { InputField } from '../components/inputs/inputFieldObj'
import { addCommas, commasToNumber, convertUnits, dynamicRound } from '../utils/units'

type State = {
  solveSelection: string
  flowrate: InputType
  outerDiameter: InputType
  thickness: InputType
  velocity: InputType
}

export type InputType = {
  name: string
  label: string
  placeholder: string
  unitType: string
  displayValue: { value: number; unit: string }
  calculatedValue: { value: number; unit: string }
  solveable: boolean
  selectiontext: string
  selected: boolean
  focusText: string
  error: string
}

const calculateAnswer = (state: State): State => {
  const { velocity, thickness, outerDiameter, flowrate } = state
  const inputVelocity = velocity.calculatedValue.value //m/s
  const inputThickness = thickness.calculatedValue.value //m
  const inputDiameter = outerDiameter.calculatedValue.value //m
  const inputFlowrate = outerDiameter.calculatedValue.value //m3/s
  let validatedState = { ...state }
  switch (state.solveSelection) {
    case 'flowrate':
      console.log('Solving for flowrate')

      if (inputDiameter < inputThickness * 2) {
        validatedState = { ...state, thickness: { ...state.thickness, error: 'Thickness too large' } }
      } else {
        validatedState = { ...state, thickness: { ...state.thickness, error: '' } }
      }

      const innerDiameter = inputDiameter - 2 * inputThickness //m
      const area = Math.PI * (innerDiameter / 2) ** 2 //m2
      const answer = inputVelocity * area //m3/s

      //   console.log(`OD: ${inputDiameter}, ID: ${innerDiameter}, Area: ${area}, Flowrate: ${answer}`)

      const updatedAnswer = updatedisplayValue({
        ...flowrate,
        calculatedValue: { value: answer, unit: flowrate.calculatedValue.unit },
      })
      console.log('Flowrate', updatedAnswer.calculatedValue)
      console.log('Flowrate', updatedAnswer.displayValue)
      return {
        ...validatedState,
        flowrate: updatedAnswer,
      }
    default:
      alert('Error: State reducer action not recognized')
      return state
  }
}

const updateCalculatedValue = (object: InputType): InputType => {
  const { calculatedValue, displayValue } = object
  const convertedValue = convertUnits({
    value: displayValue.value,
    fromUnit: displayValue.unit,
    toUnit: calculatedValue.unit,
  })
  return { ...object, calculatedValue: { value: convertedValue, unit: calculatedValue.unit } }
}

const updatedisplayValue = (object: InputType): InputType => {
  const { calculatedValue, displayValue } = object
  const convertedValue = convertUnits({
    value: calculatedValue.value,
    fromUnit: calculatedValue.unit,
    toUnit: displayValue.unit,
  })
  return { ...object, displayValue: { value: convertedValue, unit: displayValue.unit } }
}

const UnitConversion: NextPage = () => {
  const paths = [{ title: 'Fluid Flow', href: '/fluidflow' }]

  const initialState: State = {
    solveSelection: 'flowrate',
    velocity: {
      name: 'velocity',
      label: 'Velocity',
      placeholder: '0',
      unitType: 'speed',
      displayValue: { value: 1, unit: 'ft/s' },
      calculatedValue: {
        value: convertUnits({
          value: 1,
          fromUnit: 'ft/s',
          toUnit: 'm/s',
        }),
        unit: 'm/s',
      },
      solveable: false,
      selectiontext: 'Solve for fluid velocity',
      selected: false,
      focusText: 'Enter fluid velocity',
      error: '',
    },
    outerDiameter: {
      name: 'outerDiameter',
      label: 'Outer Diameter',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: 1, unit: 'in' },
      calculatedValue: {
        value: convertUnits({
          value: 1,
          fromUnit: 'in',
          toUnit: 'm',
        }),
        unit: 'm',
      },
      solveable: true,
      selectiontext: 'Solve for outer diameter',
      selected: false,
      focusText: 'Enter pipe outer diameter',
      error: '',
    },
    thickness: {
      name: 'thickness',
      label: 'Pipe Thickness',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: 0.065, unit: 'in' },
      calculatedValue: {
        value: convertUnits({
          value: 0.065,
          fromUnit: 'in',
          toUnit: 'm',
        }),
        unit: 'm',
      },
      solveable: false,
      selectiontext: 'Solve for thickness',
      selected: false,
      focusText: 'Enter pipe wall thickness',
      error: '',
    },
    flowrate: {
      name: 'flowrate',
      label: 'Flowrate',
      placeholder: '0',
      unitType: 'flowrate',
      displayValue: { value: 0, unit: 'l/min' },
      calculatedValue: {
        value: convertUnits({
          value: 0,
          fromUnit: 'l/min',
          toUnit: 'm3/s',
        }),
        unit: 'm3/s',
      },
      solveable: true,
      selectiontext: 'Solve for flowrate',
      selected: false,
      focusText: 'Enter fluid flowrate',
      error: '',
    },
  }

  const solveForOptions: SolveType[] = [
    { label: initialState.flowrate.label, value: initialState.flowrate.name },
    { label: initialState.velocity.label, value: initialState.velocity.name },
    { label: initialState.outerDiameter.label, value: initialState.outerDiameter.name },
  ]

  type Action =
    | {
        type: ActionKind.CHANGE_SOLVE_SELECTION
        payload: string
      }
    | {
        type: ActionKind.UPDATE_DISPLAY_VALUE
        payload: InputType
      }

  enum ActionKind {
    UPDATE_DISPLAY_VALUE = 'CHANGE_VALUE',
    CHANGE_SOLVE_SELECTION = 'CHANGE_SOLVE_SELECTION',
  }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.CHANGE_SOLVE_SELECTION:
        return {
          ...state,
          solveSelection: action.payload,
        }
      case ActionKind.UPDATE_DISPLAY_VALUE:
        const payloadWithCalculatedValue = updateCalculatedValue(action.payload)
        return calculateAnswer({ ...state, [action.payload.name]: payloadWithCalculatedValue })
      default:
        alert('Error: State reducer action not recognized')
        return state
    }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  const handleChangeSolveSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionKind.CHANGE_SOLVE_SELECTION, payload: e.target.value })
  }

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const unit = state[name].displayValue.unit
    const payload = { ...state[name], displayValue: { value: commasToNumber(value), unit } }
    console.log('Payload', payload)
    dispatch({ type: ActionKind.UPDATE_DISPLAY_VALUE, payload })
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const existingValue = state[name].displayValue.value
    const payload = { ...state[name], displayValue: { value: existingValue, unit: value } }
    console.log('Payload', payload)
    dispatch({ type: ActionKind.UPDATE_DISPLAY_VALUE, payload })
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
          <div className="mb-8 flex flex-col">
            {(Object.keys(state) as (keyof State)[]).map(key => {
              if (key != 'solveSelection') {
                const { name, label, placeholder, displayValue, error, unitType, focusText } = state[key]
                return (
                  <InputField
                    key={name}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    selected={state.solveSelection === name}
                    displayValue={{ value: addCommas(dynamicRound(displayValue.value)), unit: displayValue.unit }}
                    error={error}
                    unitType={unitType}
                    focusText={focusText}
                    onChangeValue={handleChangeValue}
                    onChangeUnit={handleChangeUnit}
                  />
                )
              }
            })}
          </div>
        </>
      </CalcCard>
    </PageContainer>
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
