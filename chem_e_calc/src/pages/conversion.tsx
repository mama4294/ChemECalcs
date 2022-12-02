import type { NextPage } from 'next'
import { useReducer } from 'react'
// import Select from 'react-select'

import { Breadcrumbs } from '../components/calculators/breadcrumbs'
import { CalcBody } from '../components/calculators/calcBody'
import { CalcCard } from '../components/calculators/calcCard'
import { PageContainer } from '../components/calculators/container'
import { CalcHeader } from '../components/calculators/header'
import { convertUnits, UnitOption, UnitOptions, unitOptions, UnitTypes, unitTypes } from '../utils/units'
import { updateCalculatedValue } from '../logic/logic'
import { ShortInputType } from '../types'
import { InputFieldWithUnit } from '../components/inputs/inputFieldObj'

const UnitConversion: NextPage = () => {
  const paths = [{ title: 'Unit Conversion', href: '/conversion' }]

  const initialState: State = {
    unitType: 'mass',
    input: {
      name: 'input',
      unitType: 'mass',
      placeholder: 'Enter value',
      label: 'From',
      displayValue: { value: '1', unit: 'mg' },
      calculatedValue: { value: 1, unit: 'mg' },
      selectiontext: '',
      focusText: '',
      error: '',
    },
    output: {
      name: 'output',
      unitType: 'mass',
      placeholder: 'Enter value',
      label: 'To',
      displayValue: { value: '1', unit: 'mg' },
      calculatedValue: { value: 1, unit: 'mg' },
      selectiontext: '',
      focusText: '',
      error: '',
    },
  }

  enum ActionKind {
    CHANGE_VALUE = 'CHANGE_VALUE',
    CHANGE_UNIT_TYPE = 'CHANGE_UNIT_TYPE',
    SWAP = 'SWAP',
  }

  type Action =
    | {
        type: ActionKind.CHANGE_VALUE
        payload: ShortInputType
      }
    | {
        type: ActionKind.CHANGE_UNIT_TYPE
        payload: UnitTypes
      }
    | {
        type: ActionKind.SWAP
      }

  const calculateAnswer = (state: State): State => {
    const { input, output } = state

    const answerValue = convertUnits({
      value: Number(input.displayValue.value),
      fromUnit: input.displayValue.unit,
      toUnit: output.displayValue.unit,
    })
    return {
      ...state,
      output: {
        ...output,
        calculatedValue: { value: answerValue, unit: output.displayValue.unit },
        displayValue: { value: answerValue.toLocaleString(), unit: output.displayValue.unit },
      },
    }
  }

  const stateReducer = (state: State, action: Action): State => {
    const { input, output } = state
    switch (action.type) {
      case ActionKind.CHANGE_VALUE:
        const payloadWithCalculatedValue = updateCalculatedValue(action.payload)
        return calculateAnswer({ ...state, [action.payload.name]: payloadWithCalculatedValue })
      case ActionKind.SWAP:
        let newInput = { ...input, displayValue: output.displayValue, calclatedValue: output.calculatedValue }
        let newOutput = { ...output, displayValue: input.displayValue, calclatedValue: input.calculatedValue }
        return { ...state, input: newInput, output: newOutput }
      case ActionKind.CHANGE_UNIT_TYPE:
        const unitType = action.payload
        const value = state.input.displayValue.value
        const newUnit = unitOptions[unitType as keyof UnitOptions][0] as UnitOption
        const updatedInput = {
          ...input,
          unitType: unitType,
          displayValue: { value, unit: newUnit.value },
          calculatedValue: { value: Number(value), unit: newUnit.value },
        }
        const updatedOutput = {
          ...output,
          unitType: unitType,
          displayValue: { value, unit: newUnit.value },
          calculatedValue: { value: Number(value), unit: newUnit.value },
        }
        console.table({ input, output })
        console.table({ updatedInput, updatedOutput })
        return { ...state, unitType, input: updatedInput, output: updatedOutput }
      default:
        const neverEver: never = action
        console.error('Error: Fluid Flow State reducer action not recognized', neverEver)
        return state
    }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  const handleChangeUnitType = (newType: string): void => {
    dispatch({ type: ActionKind.CHANGE_UNIT_TYPE, payload: newType as UnitTypes })
  }

  type State = {
    unitType: UnitTypes
    input: ShortInputType
    output: ShortInputType
  }

  type ShortInputStateType = Omit<State, 'unitType'>

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericValue = value.replace(/[^\d.-]/g, '')
    const unit = state[name as keyof ShortInputStateType].displayValue.unit
    const payload = { ...state[name as keyof ShortInputStateType], displayValue: { value: numericValue, unit } }
    dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const existingValue = state[name as keyof ShortInputStateType].displayValue.value
    const payload = {
      ...state[name as keyof ShortInputStateType],
      displayValue: { value: existingValue, unit: value },
    }
    dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

  const { input, output, unitType } = state

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Unit Conversion'} text={'Convert between units'} />
      <CalcBody>
        <CalcCard title={'Calculator'}>
          <>
            <div className="form-control mb-2 w-full">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select input-bordered w-full"
                value={unitType}
                onChange={e => handleChangeUnitType(e.target.value)}
              >
                {unitTypes.map(type => {
                  return (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="mb-0 flex flex-col">
              <InputFieldWithUnit
                key={input.name}
                name={input.name}
                label={input.label}
                placeholder={input.placeholder}
                selected={false}
                displayValue={input.displayValue}
                error={input.error}
                unitType={input.unitType}
                focusText={input.focusText}
                onChangeValue={handleChangeValue}
                onChangeUnit={handleChangeUnit}
              />
              <div className="flex justify-center">
                <button className="btn btn-circle" onClick={() => dispatch({ type: ActionKind.SWAP })}>
                  <SwapIcon />
                </button>
              </div>
              <InputFieldWithUnit
                key={output.name}
                name={output.name}
                label={output.label}
                placeholder={output.placeholder}
                selected={false}
                displayValue={output.displayValue}
                error={output.error}
                unitType={output.unitType}
                focusText={output.focusText}
                onChangeValue={handleChangeValue}
                onChangeUnit={handleChangeUnit}
              />
            </div>
          </>
        </CalcCard>
      </CalcBody>
    </PageContainer>
  )
}

export default UnitConversion

const SwapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="inherit"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
    />
  </svg>
)
