import { NextPage } from 'next'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Breadcrumbs } from '../components/calculators/breadcrumbs'
import { CalcBody } from '../components/calculators/calcBody'
import { CalcCard } from '../components/calculators/calcCard'
import { PageContainer } from '../components/calculators/container'
import { CalcHeader } from '../components/calculators/header'
import { Equation, VariableDefinition } from '../components/Equation'
import { InputFieldConstant, InputFieldWithUnit } from '../components/inputs/inputFieldObj'
import { DefaultUnitContext, DefaultUnitContextType, DefaultUnits } from '../contexts/defaultUnitContext'
import { solveColebrook, updateCalculatedValue } from '../logic/logic'
import { ShortInputType } from '../types'
import { convertUnits } from '../utils/units'

type State = {
  volumeFlowRate: ShortInputType
  fluidDensity: ShortInputType
  fluidViscosity: ShortInputType
  outerDiameter: ShortInputType
  thickness: ShortInputType
  pipeLength: ShortInputType
  elevationRise: ShortInputType
  surfaceRoughness: ShortInputType
}

type AnswerState = {
  pressureDrop: ShortInputType
  frictionFactor: ShortInputType
  reynoldsNumber: ShortInputType
  flowRegime: ShortInputType
  velocity: ShortInputType
}

const resetErrorMessages = (state: State): State => {
  return {
    ...state,
    volumeFlowRate: { ...state.volumeFlowRate, error: '' },
    outerDiameter: { ...state.outerDiameter, error: '' },
    thickness: { ...state.thickness, error: '' },
    pipeLength: { ...state.pipeLength, error: '' },
  }
}

const UnitConversion: NextPage = () => {
  const paths = [{ title: 'Pressure Drop', href: '/pressuredrop' }]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  const initialState: State = {
    pipeLength: {
      name: 'pipeLength',
      label: 'Pipe Length',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '100', unit: defaultUnits.length },
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
      focusText: 'Enter the total length of the pipe',
      error: '',
    },
    elevationRise: {
      name: 'elevationRise',
      label: 'Elevation Rise',
      placeholder: '2',
      unitType: 'length',
      displayValue: { value: '5', unit: defaultUnits.length },
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
      selectiontext: 'Solve for fluid velocity',
      focusText: 'Enter the difference in elevation between the inlet and outlet (can be negative)',
      error: '',
    },
    surfaceRoughness: {
      name: 'surfaceRoughness',
      label: 'Pipe Surface Roughness',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '0.02', unit: defaultUnits.length },
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
      focusText: 'Enter the surface roughness of the pipe',
      error: '',
    },
    outerDiameter: {
      name: 'outerDiameter',
      label: 'Pipe Outer Diameter',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '1', unit: defaultUnits.length },
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
        type: ActionKind.REFRESH
      }

  enum ActionKind {
    CHANGE_VALUE = 'CHANGE_VALUE',
    CHANGE_SOLVE_SELECTION = 'CHANGE_SOLVE_SELECTION',
    REFRESH = 'REFRESH',
  }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.CHANGE_VALUE:
        const payloadWithCalculatedValue = updateCalculatedValue(action.payload)
        return { ...state, [action.payload.name]: payloadWithCalculatedValue }
      case ActionKind.REFRESH:
        return { ...state }
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

  const fluidPropertyOptions: ShortInputType[] = [state.volumeFlowRate, state.fluidDensity, state.fluidViscosity]

  const pipingPropertyOptions: ShortInputType[] = [
    state.pipeLength,
    state.outerDiameter,
    state.thickness,
    state.elevationRise,
    state.surfaceRoughness,
  ]

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Fluid Flow'} text={'Calculate the pressure drop in a length of pipe'} />
      <CalcBody>
        <CalcCard title={'Fluid Properties'}>
          <div className="mb-8 flex flex-col">
            {fluidPropertyOptions.map(key => {
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
        <CalcCard title={'Piping Properties'}>
          <div className="mb-8 flex flex-col">
            {pipingPropertyOptions.map(key => {
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
        <AnswerCard inputState={state} defaultUnits={defaultUnits} />
        <EquationCard />
        <SurfaceFinishCard />
      </CalcBody>
    </PageContainer>
  )
}

export default UnitConversion

const AnswerCard = ({ inputState, defaultUnits }: { inputState: State; defaultUnits: DefaultUnits }) => {
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

  const { dP, ff, re, regime, velocity } = calculateAnswer(inputState)
  const answerState: AnswerState = {
    pressureDrop: {
      name: 'pressureDrop',
      label: 'Pressure Drop',
      placeholder: '0',
      unitType: 'pressure',
      calculatedValue: { value: dP, unit: 'Pa' },
      get displayValue() {
        return {
          value: convertUnits({
            value: Number(this.calculatedValue.value),
            fromUnit: this.calculatedValue.unit,
            toUnit: answerUnits.pressureDrop,
          }).toLocaleString(),
          unit: answerUnits.pressureDrop,
        }
      },
      selectiontext: '',
      focusText: 'Differential pressure calculation',
      error: '',
    },
    frictionFactor: {
      name: 'frictionFactor',
      label: 'Friction Factor',
      placeholder: '0',
      unitType: 'pressure',
      calculatedValue: { value: ff, unit: 'unitless' },
      displayValue: { value: ff.toLocaleString(), unit: 'unitless' },
      selectiontext: 'Solve for flowrate',
      focusText: 'Enter fluid flowrate',
      error: '',
    },
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

  return (
    <CalcCard title={'Answer'}>
      <div className="mb-8 flex flex-col">
        <InputFieldWithUnit
          name={answerState.pressureDrop.name}
          label={answerState.pressureDrop.label}
          placeholder={answerState.pressureDrop.placeholder}
          selected={true}
          displayValue={{
            value: answerState.pressureDrop.displayValue.value,
            unit: answerState.pressureDrop.displayValue.unit,
          }}
          error={answerState.pressureDrop.error}
          unitType={answerState.pressureDrop.unitType}
          focusText={answerState.pressureDrop.focusText}
          onChangeValue={logChange}
          onChangeUnit={handleChangeUnit}
        />

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
          name={answerState.frictionFactor.name}
          label={answerState.frictionFactor.label}
          placeholder={answerState.frictionFactor.placeholder}
          selected={true}
          displayValue={{
            value: answerState.frictionFactor.displayValue.value,
            unit: answerState.frictionFactor.displayValue.unit,
          }}
          error={answerState.frictionFactor.error}
          unitType={answerState.frictionFactor.unitType}
          focusText={answerState.frictionFactor.focusText}
          onChangeValue={logChange}
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
        />
      </div>
    </CalcCard>
  )
}

const EquationCard = () => {
  return (
    <CalcCard title="Governing Equation">
      <>
        <p className="mb-2 font-semibold">The Bernoulli Equation is used to determine pressure drop</p>
        <div className="mb-4">
          <Equation
            equation={`$$P_{1} + {\\rho}gh_{1} + \\frac{1}{2}{\\rho}v_{1}^{2} = P_{2}  + {\\rho}gh_{2}  + \\frac{1}{2}{\\rho}v_{2}^{2} + \\left ( {f_{d}\\frac{L}{d_i}} + \\sum K \\right )\\frac{1}{2}{\\rho}{v}^{2} $$`}
          />
        </div>
        <p className="mb-2 font-semibold">With the following assumptions: </p>

        <ul className=" mb-2 ml-2 list-inside list-disc">
          <li>The start and end are connected through a fluid streamline</li>
          <li>The fluid has constant density</li>
          <li>The fluid flow rate is constant</li>
        </ul>

        <p className="mb-2 font-semibold">Rearrage to solve for pressure drop:</p>
        <Equation
          equation={`$$P_{1} - P_{2} = {\\rho}g \\left (h_{2}-h_{1}\\right ) + \\frac{1}{2}{\\rho} \\left ( v_{2}^{2} - v_{1}^{2} \\right ) + \\left ( {f_{d}\\frac{L}{d_i}} + \\sum K \\right )\\frac{1}{2}{\\rho}v^{2} $$`}
        />

        <p className="mb-2 font-semibold">Simplify:</p>

        <Equation equation={`$$P_{1} - P_{2} =  \\Delta P$$`} />
        <Equation equation={`$$h_{2} - h_{1} =  \\Delta h$$`} />
        <Equation equation={`$$v_{2}^{2} - v_{1}^{2}  = 0$$`} />
        <Equation
          equation={`$$\\Delta P = {\\rho}g\\Delta h + \\left ( {f_{d}\\frac{L}{d_i}} + \\sum K \\right )\\frac{1}{2}{\\rho}v^{2}$$`}
        />

        <p className="mb-2 font-semibold">Loss Coefficient (K)</p>
        <div className="ml-2">
          <p className="mb-2">
            Each bend, valve, and fitting has a small amount of friction associated with it. It can be descriped as the
            loss coeffient. The sum of all the loss coefficents (ΣK) can be used in the Bernoulli Equation to find the
            pressure drop due to fittings. It is also known as the resistance coeffient.
          </p>
          <p className="mb-2">
            Exact calculations for the loss coefficent for each type of valve and fitting can be found in the Crane
            Technical Paper 410: Flow of Fluids through Valves, Fittings, and Pipe.
          </p>
        </div>
        <br />

        <p className="text-lg font-medium">Definitions</p>
        <div className="ml-2">
          <VariableDefinition equation={`$$P = $$`} definition="Pressure" />
          <VariableDefinition equation={`$$v = $$`} definition="Fluid velocity" />
          <VariableDefinition equation={`$$\\rho = $$`} definition="Fluid density" />
          <VariableDefinition equation={`$$d_i = $$`} definition="Inner pipe diameter" />
          <VariableDefinition equation={`$$L = $$`} definition="Pipe length" />
          <VariableDefinition equation={`$$h = $$`} definition="Elevation" />
          <VariableDefinition equation={`$$f_{d} = $$`} definition="Friction factor" />
          <VariableDefinition equation={`$$K = $$`} definition="Loss coefficient" />
        </div>
      </>
    </CalcCard>
  )
}

const SurfaceFinishCard = () => (
  <CalcCard title="Surface Finish">
    <>
      <p className="mb-2">
        The surface roughness depends on the pipe material. The table below gives typical roughnesses for specific
        materials
      </p>
      <div className="w-full overflow-x-auto">
        <table className=" table w-full">
          <thead>
            <tr>
              <th>Material</th>
              <th>Surface Roughness</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stainless Steel</td>
              <td>5 μm</td>
            </tr>
            <tr>
              <td>Steel</td>
              <td>45 μm</td>
            </tr>
            <tr>
              <td>Galvanized Steel</td>
              <td>150 μm</td>
            </tr>
            <tr>
              <td>Aluminum</td>
              <td>1 μm</td>
            </tr>
            <tr>
              <td>Copper</td>
              <td>1 μm</td>
            </tr>
            <tr>
              <td>Brass</td>
              <td>1 μm</td>
            </tr>
            <tr>
              <td>PVC</td>
              <td>4 μm</td>
            </tr>
            <tr>
              <td>Cast Iron</td>
              <td>525 μm</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  </CalcCard>
)

const calculateAnswer = (state: State) => {
  //Inputs
  const {
    pipeLength,
    thickness,
    outerDiameter,
    volumeFlowRate,
    fluidDensity,
    elevationRise,
    fluidViscosity,
    surfaceRoughness,
  } = state
  const inputDensity = fluidDensity.calculatedValue.value //kg/m3
  const inputElevation = elevationRise.calculatedValue.value //m
  const inputThickness = thickness.calculatedValue.value //m
  const inputPipeOD = outerDiameter.calculatedValue.value //m
  const inputFlowrate = volumeFlowRate.calculatedValue.value //m3/s
  const inputViscosity = fluidViscosity.calculatedValue.value //Pa*s
  const inputSurfaceRoughness = surfaceRoughness.calculatedValue.value //m

  //Intermediate calculations
  const gravitationalConstant = 9.81 //m/s2
  const inputPipeID = inputPipeOD - 2 * inputThickness //m
  const fluidVelocity = inputFlowrate / (Math.PI * (inputPipeID / 2) ** 2) //m/s
  const reynoldsNumber = (inputDensity * fluidVelocity * inputPipeID) / inputViscosity //kg/m3 * m/s * m / Pa*s = unitless
  let frictionFactor = 64 / reynoldsNumber //laminar flow

  console.log('relative roughness: ', inputSurfaceRoughness / inputPipeID)

  if (reynoldsNumber > 2000) {
    //transition and turbulent flow
    frictionFactor = solveColebrook({
      initialGuess: 0.5,
      reynoldsNumber: reynoldsNumber,
      roughness: inputSurfaceRoughness,
      diameter: inputPipeID,
    })
  }

  //Pressure drop calculations
  const dP_elevation = inputDensity * gravitationalConstant * inputElevation // kg/m3 * m/s2 * m = kg/m2/s2 = Pa
  const dP_fittings = 0 //TODO: Add fittings
  const dP_friction =
    ((frictionFactor * (pipeLength.calculatedValue.value / inputPipeID) * 1) / 2) * inputDensity * fluidVelocity ** 2 //
  const dP_total = dP_elevation + dP_fittings + dP_friction //Pa

  //Flow regime calculation
  let regime = 'Laminar'
  if (reynoldsNumber > 4000) {
    regime = 'Turbulent'
  } else if (reynoldsNumber > 2000) {
    regime = 'Transitional'
  }

  return { dP: dP_total, ff: frictionFactor, re: reynoldsNumber, regime: regime, velocity: fluidVelocity }
}