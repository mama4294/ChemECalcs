import { NextPage } from 'next'
import React, { useContext, useReducer, useState } from 'react'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { Equation, VariableDefinition } from '../../components/Equation'
import { InputFieldConstant, InputFieldWithUnit } from '../../components/inputs/inputFieldObj'
import { Metadata } from '../../components/Layout/Metadata'
import { DefaultUnitContext, DefaultUnitContextType, DefaultUnits } from '../../contexts/defaultUnitContext'
import { updateCalculatedValue } from '../../logic/logic'
import { ShortInputType } from '../../types'
import { convertUnits } from '../../utils/units'

type State = {
  volumeFlowRate: ShortInputType
  fluidDensity: ShortInputType
  fluidViscosity: ShortInputType
  outerDiameter: ShortInputType
  thickness: ShortInputType
}

type AnswerState = {
  reynoldsNumber: ShortInputType
  flowRegime: ShortInputType
  velocity: ShortInputType
}

const UnitConversion: NextPage = () => {
  const paths = [
    { title: 'Fluid Dynamics', href: '/fluids/' },
    { title: 'Reynolds Number', href: '/fluids/reynoldsnumber' },
  ]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  const initialState: State = {
    outerDiameter: {
      name: 'outerDiameter',
      label: 'Pipe Outer Diameter',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '1.5', unit: defaultUnits.length },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'm',
          }),
          unit: 'm',
        }
      },
      selectiontext: '',
      focusText: 'Enter pipe outer diameter',
      error: '',
    },
    thickness: {
      name: 'thickness',
      label: 'Pipe Thickness',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '0.065', unit: defaultUnits.length },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'm',
          }),
          unit: 'm',
        }
      },
      selectiontext: '',
      focusText: 'Enter pipe wall thickness',
      error: '',
    },
    volumeFlowRate: {
      name: 'volumeFlowRate',
      label: 'Flowrate',
      placeholder: '0',
      unitType: 'volumeFlowRate',
      displayValue: { value: '80', unit: defaultUnits.volumeFlowRate },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'm3/s',
          }),
          unit: 'm3/s',
        }
      },
      selectiontext: 'Solve for flowrate',
      focusText: 'Enter fluid flowrate',
      error: '',
    },
    fluidDensity: {
      name: 'fluidDensity',
      label: 'Density',
      placeholder: '0',
      unitType: 'density',
      displayValue: { value: '1', unit: defaultUnits.density },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'kg/m3',
          }),
          unit: 'kg/m3',
        }
      },
      selectiontext: '',
      focusText: 'Enter fluid density',
      error: '',
    },
    fluidViscosity: {
      name: 'fluidViscosity',
      label: 'Viscosity',
      placeholder: '0',
      unitType: 'viscosity',
      displayValue: { value: '1', unit: defaultUnits.viscosity },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'pa·s',
          }),
          unit: 'pa·s',
        }
      },
      selectiontext: '',
      focusText: 'Enter fluid dynamic viscosity',
      error: '',
    },
  }

  type Action =
    | {
        type: ActionKind.CHANGE_VALUE
        payload: ShortInputType
      }
    | {
        type: ActionKind.CHANGE_VALUE_UNITLESS
        payload: ShortInputType
      }

  enum ActionKind {
    CHANGE_VALUE = 'CHANGE_VALUE',
    CHANGE_VALUE_UNITLESS = 'CHANGE_VALUE_UNITLESS',
  }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.CHANGE_VALUE:
        const payloadWithCalculatedValue = updateCalculatedValue(action.payload)
        return validateInputs({ ...state, [action.payload.name]: payloadWithCalculatedValue })
      case ActionKind.CHANGE_VALUE_UNITLESS:
        return validateInputs({ ...state, [action.payload.name]: action.payload })
      default:
        const neverEver: never = action
        console.error('Error: Fluid Flow State reducer action not recognized', neverEver)
        return state
    }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericValue = value.replace(/[^\d.-]/g, '')
    const unit = state[name as keyof State].displayValue.unit
    const payload = { ...state[name as keyof State], displayValue: { value: numericValue, unit } }
    dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const existingValue = state[name as keyof State].displayValue.value
    const payload = {
      ...state[name as keyof State],
      displayValue: { value: existingValue, unit: value },
    }
    dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

  const inputs: ShortInputType[] = [
    state.volumeFlowRate,
    state.fluidDensity,
    state.fluidViscosity,
    state.outerDiameter,
    state.thickness,
  ]

  const isError = hasError(state)

  return (
    <>
      <Metadata
        title="Reynolds Number Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Fluid Dynamics, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />

      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Reynolds Number'} text={'Calculate the flow regime in a length of pipe'} />
        <CalcBody>
          <CalcCard title={'Inputs'}>
            <div className="mb-8 flex flex-col">
              {inputs.map(key => {
                const { name, label, placeholder, displayValue, error, unitType, focusText } = key
                return (
                  <InputFieldWithUnit
                    key={name}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    selected={false}
                    displayValue={{ value: displayValue.value, unit: displayValue.unit }}
                    error={error}
                    unitType={unitType}
                    focusText={focusText}
                    onChangeValue={handleChangeValue}
                    onChangeUnit={handleChangeUnit}
                  />
                )
              })}
            </div>
          </CalcCard>
          <AnswerCard inputState={state} defaultUnits={defaultUnits} isError={isError} />
          <EquationCard />
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default UnitConversion

const AnswerCard = ({
  inputState,
  defaultUnits,
  isError,
}: {
  inputState: State
  defaultUnits: DefaultUnits
  isError: boolean
}) => {
  const initalAnswerUnits = {
    pressureDrop: defaultUnits.pressure,
    frictionFactor: defaultUnits.pressure,
    reynoldsNumber: defaultUnits.pressure,
    velocity: defaultUnits.speed,
  }

  const [answerUnits, setAnswerUnits] = useState(initalAnswerUnits)

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAnswerUnits({ ...answerUnits, [name]: value })
  }

  const { re, regime, velocity } = calculateAnswer(inputState)

  const answerState: AnswerState = {
    velocity: {
      name: 'velocity',
      label: 'Fluid Velocity',
      placeholder: '0',
      unitType: 'speed',
      calculatedValue: { value: velocity, unit: 'm/s' },
      get displayValue() {
        return {
          value: convertUnits({
            value: Number(this.calculatedValue.value),
            fromUnit: this.calculatedValue.unit,
            toUnit: answerUnits.velocity,
          }).toLocaleString(),
          unit: answerUnits.velocity,
        }
      },
      selectiontext: '',
      focusText: 'Differential pressure calculation',
      error: '',
    },
    reynoldsNumber: {
      name: 'reynoldsNumber',
      label: 'Reynolds Number',
      placeholder: '0',
      unitType: 'pressure',
      calculatedValue: { value: re, unit: 'unitless' },
      displayValue: { value: re.toLocaleString(), unit: 'unitless' },
      selectiontext: 'Solve for flowrate',
      focusText: 'Enter fluid flowrate',
      error: '',
    },
    flowRegime: {
      name: 'flowRegime',
      label: 'Flow Regime',
      placeholder: '0',
      unitType: 'pressure',
      calculatedValue: { value: 0, unit: 'unitless' },
      displayValue: { value: regime.toLocaleString(), unit: 'unitless' },
      selectiontext: 'Solve for flowrate',
      focusText: 'Enter fluid flowrate',
      error: '',
    },
  }

  const logChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  if (isError) {
    return (
      <CalcCard title={'Answer'}>
        <div className="mb-8 flex flex-col">
          <div className="text-error">Invalid input</div>
        </div>
      </CalcCard>
    )
  } else
    return (
      <CalcCard title={'Answer'}>
        <div className="mb-8 flex flex-col">
          <InputFieldWithUnit
            name={answerState.velocity.name}
            label={answerState.velocity.label}
            placeholder={answerState.velocity.placeholder}
            selected={true}
            displayValue={{
              value: answerState.velocity.displayValue.value,
              unit: answerState.velocity.displayValue.unit,
            }}
            error={answerState.velocity.error}
            unitType={answerState.velocity.unitType}
            focusText={answerState.velocity.focusText}
            onChangeValue={logChange}
            onChangeUnit={handleChangeUnit}
          />

          <InputFieldConstant
            name={answerState.reynoldsNumber.name}
            label={answerState.reynoldsNumber.label}
            placeholder={answerState.reynoldsNumber.placeholder}
            selected={true}
            displayValue={{
              value: answerState.reynoldsNumber.displayValue.value,
              unit: answerState.reynoldsNumber.displayValue.unit,
            }}
            error={answerState.reynoldsNumber.error}
            unitType={answerState.reynoldsNumber.unitType}
            focusText={answerState.reynoldsNumber.focusText}
            onChangeValue={logChange}
          />
          <InputFieldConstant
            name={answerState.flowRegime.name}
            label={answerState.flowRegime.label}
            placeholder={answerState.flowRegime.placeholder}
            selected={true}
            displayValue={{
              value: answerState.flowRegime.displayValue.value,
              unit: answerState.flowRegime.displayValue.unit,
            }}
            error={answerState.flowRegime.error}
            unitType={answerState.flowRegime.unitType}
            focusText={answerState.flowRegime.focusText}
            onChangeValue={logChange}
            topRight={<FlowRegimeHint />}
          />
        </div>
      </CalcCard>
    )
}

const EquationCard = () => {
  return (
    <CalcCard title="Governing Equation">
      <>
        <p className="mb-2 font-semibold">The Reynolds number equation is:</p>
        <div className="mb-4">
          <Equation equation={`$$Re = \\frac{d_{i}* v* \\rho}{\\mu} $$`} />
        </div>
        <p className="mb-2 font-semibold">Where: </p>
        <div className="mb-2">
          <VariableDefinition equation={`$$Re = $$`} definition="Reynolds Number" />
          <VariableDefinition equation={`$$v = $$`} definition="Fluid velocity" />
          <VariableDefinition equation={`$$\\rho = $$`} definition="Fluid density" />
          <VariableDefinition equation={`$$d_{i} = $$`} definition="Inner pipe diameter" />
          <VariableDefinition equation={`$$\\mu = $$`} definition="Fluid dynamic viscosity" />
        </div>

        <p className="mb-2 font-semibold">The flow regime is:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>{'Laminar: Re <= 2,000'}</li>
          <li>{'Transition: 2,000 > Re < 4,000'}</li>
          <li>{'Turbulent: Re >= 4,000'}</li>
        </ul>
      </>
    </CalcCard>
  )
}

const calculateAnswer = (state: State) => {
  //Inputs
  const { thickness, outerDiameter, volumeFlowRate, fluidDensity, fluidViscosity } = state
  const inputDensity = fluidDensity.calculatedValue.value //kg/m3
  const inputThickness = thickness.calculatedValue.value //m
  const inputPipeOD = outerDiameter.calculatedValue.value //m
  const inputFlowrate = volumeFlowRate.calculatedValue.value //m3/s
  const inputViscosity = fluidViscosity.calculatedValue.value //Pa*s

  //Intermediate calculations
  const inputPipeID = inputPipeOD - 2 * inputThickness //m
  const fluidVelocity = inputFlowrate / (Math.PI * (inputPipeID / 2) ** 2) //m/s
  const reynoldsNumber = (inputDensity * fluidVelocity * inputPipeID) / inputViscosity //kg/m3 * m/s * m / Pa*s = unitless

  //Flow regime calculation
  let regime = 'Laminar'
  if (reynoldsNumber > 4000) {
    regime = 'Turbulent'
  } else if (reynoldsNumber > 2000) {
    regime = 'Transitional'
  }

  return {
    re: reynoldsNumber,
    regime: regime,
    velocity: fluidVelocity,
  }
}

const resetErrorMessages = (state: State): State => {
  //Resets error messages to empty string
  return {
    ...state,
    volumeFlowRate: { ...state.volumeFlowRate, error: '' },
    outerDiameter: { ...state.outerDiameter, error: '' },
    thickness: { ...state.thickness, error: '' },
    fluidDensity: { ...state.fluidDensity, error: '' },
    fluidViscosity: { ...state.fluidViscosity, error: '' },
  }
}

const validateInputs = (state: State) => {
  //Adds error messages to state if inputs are invalid
  const { thickness, outerDiameter, volumeFlowRate, fluidDensity, fluidViscosity } = state
  const inputDensity = fluidDensity.calculatedValue.value //kg/m3
  const inputThickness = thickness.calculatedValue.value //m
  const inputPipeOD = outerDiameter.calculatedValue.value //m
  const inputFlowrate = volumeFlowRate.calculatedValue.value //m3/s
  const inputViscosity = fluidViscosity.calculatedValue.value //Pa*s

  let validatedState = resetErrorMessages(state)

  if (inputPipeOD <= inputThickness * 2) {
    validatedState = {
      ...validatedState,
      thickness: { ...validatedState.thickness, error: 'Thickness too large for pipe' },
    }
  }

  if (inputPipeOD < 0) {
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

  if (inputDensity < 0) {
    validatedState = {
      ...validatedState,
      fluidDensity: { ...validatedState.fluidDensity, error: 'Density must be positive' },
    }
  }

  if (inputViscosity < 0) {
    validatedState = {
      ...validatedState,
      fluidViscosity: { ...validatedState.fluidViscosity, error: 'Viscosity must be positive' },
    }
  }

  if (inputFlowrate <= 0) {
    validatedState = {
      ...validatedState,
      volumeFlowRate: { ...validatedState.volumeFlowRate, error: 'Flow must be positive' },
    }
  }
  return validatedState
}

//finds if there is an error in the state
const hasError = (state: State): boolean => {
  let error = false
  Object.keys(state).forEach(key => {
    if (state[key as keyof State].error != '') error = true
  })
  return error
}

const FlowRegimeHint = () => (
  <span className="label-text-alt">
    <div className="dropdown-end dropdown">
      <label tabIndex={0} className="btn btn-ghost btn-circle btn-xs text-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-4 w-4 stroke-current">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </label>
      <div tabIndex={0} className="compact card dropdown-content rounded-box min-w-[16rem] bg-base-100 shadow">
        <div className="card-body overflow-x-auto">
          <h2 className="card-title">Details</h2>
          <p>Flow regime is determined by the Reynolds number</p>
          <ul className="list-inside list-disc space-y-1">
            <li>{'Laminar: Re <= 2,000'}</li>
            <li>{'Transition: 2,000 > Re < 4,000'}</li>
            <li>{'Turbulent: Re >= 4,000'}</li>
          </ul>
        </div>
      </div>
    </div>
  </span>
)
