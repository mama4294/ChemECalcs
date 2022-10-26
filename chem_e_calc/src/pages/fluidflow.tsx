import { NextPage } from 'next'
import React, { useReducer } from 'react'
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

type InputState = {
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
  displayValue: { value: string; unit: string }
  calculatedValue: { value: number; unit: string }
  solveable: boolean
  selectiontext: string
  selected: boolean
  focusText: string
  error: string
}

const resetErrorMessages = (state: State): State => {
  return {
    ...state,
    flowrate: { ...state.flowrate, error: '' },
    outerDiameter: { ...state.outerDiameter, error: '' },
    thickness: { ...state.thickness, error: '' },
    velocity: { ...state.velocity, error: '' },
  }
}

const calculateAnswer = (state: State): State => {
  const { velocity, thickness, outerDiameter, flowrate } = state
  const inputVelocity = velocity.calculatedValue.value //m/s
  const inputThickness = thickness.calculatedValue.value //m
  const inputDiameter = outerDiameter.calculatedValue.value //m
  const inputFlowrate = flowrate.calculatedValue.value //m3/s
  let validatedState = resetErrorMessages(state)

  switch (state.solveSelection) {
    case 'flowrate':
      if (inputDiameter <= inputThickness * 2) {
        validatedState = { ...validatedState, thickness: { ...validatedState.thickness, error: 'Thickness too large' } }
      }
      if (inputDiameter < 0) {
        validatedState = {
          ...validatedState,
          outerDiameter: { ...validatedState.outerDiameter, error: 'Diameter must be positive' },
        }
      }
      if (inputThickness < 0) {
        validatedState = {
          ...validatedState,
          thickness: { ...validatedState.thickness, error: 'Thickness must be positive' },
        }
      }
      let innerDiameter = inputDiameter - 2 * inputThickness //m
      let area = Math.PI * (innerDiameter / 2) ** 2 //m2
      let answer = inputVelocity * area //m3/s

      let updatedAnswer = updatedisplayValue({
        ...flowrate,
        calculatedValue: { value: answer, unit: flowrate.calculatedValue.unit },
      })

      return {
        ...validatedState,
        flowrate: updatedAnswer,
      }
    case 'velocity':
      if (inputDiameter <= inputThickness * 2) {
        validatedState = { ...validatedState, thickness: { ...validatedState.thickness, error: 'Thickness too large' } }
      }
      if (inputDiameter < 0) {
        validatedState = {
          ...validatedState,
          outerDiameter: { ...validatedState.outerDiameter, error: 'Diameter must be positive' },
        }
      }
      if (inputThickness < 0) {
        validatedState = {
          ...validatedState,
          thickness: { ...validatedState.thickness, error: 'Thickness must be positive' },
        }
      }
      innerDiameter = inputDiameter - 2 * inputThickness //m
      area = Math.PI * (innerDiameter / 2) ** 2 //m2
      answer = inputFlowrate / area //m/2

      updatedAnswer = updatedisplayValue({
        ...velocity,
        calculatedValue: { value: answer, unit: velocity.calculatedValue.unit },
      })

      return {
        ...validatedState,
        velocity: updatedAnswer,
      }
    case 'outerDiameter':
      // innerDiameter = inputDiameter - 2 * inputThickness //m
      area = inputFlowrate / inputVelocity //m2
      innerDiameter = 2 * Math.sqrt(area / Math.PI) //m
      answer = innerDiameter + 2 * inputThickness //m

      if (inputThickness < 0) {
        validatedState = {
          ...validatedState,
          thickness: { ...validatedState.thickness, error: 'Thickness must be positive' },
        }
      }

      updatedAnswer = updatedisplayValue({
        ...outerDiameter,
        calculatedValue: { value: answer, unit: outerDiameter.calculatedValue.unit },
      })

      return {
        ...validatedState,
        outerDiameter: updatedAnswer,
      }
    default:
      alert('Error: State reducer action not recognized')
      return state
  }
}

const updateCalculatedValue = (object: InputType): InputType => {
  const { calculatedValue, displayValue } = object
  const convertedValue = convertUnits({
    value: Number(displayValue.value),
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
  return { ...object, displayValue: { value: dynamicRound(convertedValue).toString(), unit: displayValue.unit } }
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
      displayValue: { value: '5', unit: 'ft/s' },
      calculatedValue: {
        value: convertUnits({
          value: 5,
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
      displayValue: { value: '1', unit: 'in' },
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
      displayValue: { value: '0.065', unit: 'in' },
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
      displayValue: { value: '0', unit: 'l/min' },
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

    const unit = state[name as keyof InputState].displayValue.unit
    const payload = { ...state[name as keyof InputState], displayValue: { value: value, unit } }
    console.log('Payload', payload)
    dispatch({ type: ActionKind.UPDATE_DISPLAY_VALUE, payload })
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const existingValue = state[name as keyof InputState].displayValue.value
    const payload = { ...state[name as keyof InputState], displayValue: { value: existingValue, unit: value } }
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
                    displayValue={{ value: addCommas(displayValue.value), unit: displayValue.unit }}
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
