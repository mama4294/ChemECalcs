import { NextPage } from 'next'
import { useContext, useEffect, useReducer } from 'react'
import { Breadcrumbs } from '../components/calculators/breadcrumbs'
import { CalcBody } from '../components/calculators/calcBody'
import { CalcCard } from '../components/calculators/calcCard'
import { PageContainer } from '../components/calculators/container'
import { CalcHeader } from '../components/calculators/header'
import { InputDropdown, InputFieldConstant, InputFieldWithUnit } from '../components/inputs/inputFieldObj'
import { DefaultUnitContext, DefaultUnitContextType } from '../contexts/defaultUnitContext'
import { convertUnits } from '../utils/units'
import { ShortInputType } from '../types'
import { updateCalculatedValue } from '../logic/logic'

type State = {
  solveSelection: string
  baseDiameter: ShortInputType
  baseHeight: ShortInputType
  baseRPM: ShortInputType
  baseImpellerDiameter: ShortInputType
  baseImpellerType: string
  flowNumber: ShortInputType
  powerNumber: ShortInputType
  scaledDiameter: ShortInputType
  scaledHeight: ShortInputType
  fluidDensity: ShortInputType
  fluidViscosity: ShortInputType
}

//type State without solveSelection and baseImpellerType
type StateWithoutStrings = Omit<State, 'solveSelection' | 'baseImpellerType'>

const Agitation: NextPage = () => {
  const paths = [{ title: 'Agitation', href: '/agitation' }]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  const initialState: State = {
    solveSelection: 'tipSpeed',
    baseImpellerType: 'rushton',
    baseDiameter: {
      name: 'baseDiameter',
      label: 'Vessel Diameter',
      placeholder: '0',
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
      selectiontext: '',
      focusText: 'Enter base vessel inner diameter',
      error: '',
    },
    baseHeight: {
      name: 'baseHeight',
      label: 'Liquid Height',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '10', unit: defaultUnits.length },
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
      focusText: 'Enter liquid height in base vessel',
      error: '',
    },
    baseRPM: {
      name: 'baseRPM',
      label: 'Shaft Speed',
      placeholder: '0',
      unitType: 'speed',
      displayValue: { value: '250', unit: 'rpm' },
      calculatedValue: { value: 250, unit: 'rpm' },
      selectiontext: '',
      focusText: 'Enter the rotations per minute of the agitator shaft',
      error: '',
    },
    baseImpellerDiameter: {
      name: 'baseImpellerDiameter',
      label: 'Impeller diameter',
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
      focusText: 'Enter the diameter from tip to tip of the agitator',
      error: '',
    },

    flowNumber: {
      name: 'baseFlowNumber',
      label: 'Agitator Flow Number',
      placeholder: '0',

      unitType: 'length',
      displayValue: { value: '1', unit: 'unitless' },
      calculatedValue: { value: 1, unit: 'unitless' },
      selectiontext: '',
      focusText: 'Enter the flow number for the agitator',
      error: '',
    },
    powerNumber: {
      name: 'basePowerNumber',
      label: 'Impeller Power Number',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '1', unit: 'unitless' },
      calculatedValue: { value: 1, unit: 'unitless' },
      selectiontext: '',
      focusText: 'Enter the power number for the agitator',
      error: '',
    },
    scaledDiameter: {
      name: 'scaledDiameter',
      label: 'Vessel Diameter',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '10', unit: defaultUnits.length },
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
      focusText: 'Enter the vessel inner diameter',
      error: '',
    },
    scaledHeight: {
      name: 'scaledHeight',
      label: 'Liquid Height',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '10', unit: defaultUnits.length },
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
      focusText: 'Enter the liquid height for the vessel',
      error: '',
    },
    fluidDensity: {
      name: 'fluidDensity',
      label: 'Fluid Density',
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
      focusText: 'Enter the fluid denisty',
      error: '',
    },
    fluidViscosity: {
      name: 'fluidViscosity',
      label: 'Fluid Viscosity',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '3', unit: 'cP' },
      calculatedValue: { value: 3, unit: 'cP' },
      selectiontext: '',
      focusText: 'Enter the fluid viscosity',
      error: '',
    },
  }

  type Action =
    | {
        type: ActionKind.CHANGE_SOLVE_SELECTION | ActionKind.CHANGE_IMPELLER_TYPE
        payload: string
      }
    | {
        type: ActionKind.CHANGE_VALUE_WITH_UNIT | ActionKind.CHANGE_VALUE_WITHOUT_UNIT | ActionKind.CHANGE_UNIT
        payload: { name: string; value: string }
      }
    | {
        type: ActionKind.REFRESH
      }

  enum ActionKind {
    CHANGE_VALUE_WITH_UNIT = 'CHANGE_VALUE_WITH_UNIT',
    CHANGE_VALUE_WITHOUT_UNIT = 'CHANGE_VALUE_WITHOUT_UNIT',
    CHANGE_UNIT = 'CHANGE_UNIT',
    CHANGE_SOLVE_SELECTION = 'CHANGE_SOLVE_SELECTION',
    CHANGE_IMPELLER_TYPE = 'CHANGE_IMPELLER_TYPE',
    REFRESH = 'REFRESH',
  }
  const calcPowerNumbers = (type: string) => {
    switch (type) {
      case 'hydrofoil':
        return { nP: 1, nF: 0.63 }
      case 'rushton':
        return { nP: 5.5, nF: 0.72 }
      case 'pitchedBlade':
        return { nP: 1.37, nF: 0.68 }
      default:
        return null
    }
  }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.REFRESH:
        return { ...state }
      case ActionKind.CHANGE_SOLVE_SELECTION:
        return {
          ...state,
          solveSelection: action.payload,
        }
      case ActionKind.CHANGE_VALUE_WITH_UNIT:
        let name = action.payload.name
        let numericValue = action.payload.value.replace(/[^\d.-]/g, '')
        let unit = state[name as keyof StateWithoutStrings].displayValue.unit
        let payload = { ...state[name as keyof StateWithoutStrings], displayValue: { value: numericValue, unit } }
        let payloadWithCalculatedValue = updateCalculatedValue(payload)
        return {
          ...state,
          [action.payload.name]: payloadWithCalculatedValue,
        }
      case ActionKind.CHANGE_VALUE_WITHOUT_UNIT:
        name = action.payload.name
        numericValue = action.payload.value.replace(/[^\d.-]/g, '')
        unit = state[name as keyof StateWithoutStrings].displayValue.unit
        payload = {
          ...state[name as keyof StateWithoutStrings],
          displayValue: { value: numericValue, unit },
          calculatedValue: { value: Number(numericValue), unit },
        }
        return {
          ...state,
          [action.payload.name]: payload,
        }
      case ActionKind.CHANGE_UNIT:
        name = action.payload.name
        const existingValue = state[name as keyof StateWithoutStrings].displayValue.value
        payload = {
          ...state[name as keyof StateWithoutStrings],
          displayValue: { value: existingValue, unit: action.payload.value },
        }
        payloadWithCalculatedValue = updateCalculatedValue(payload)
        return {
          ...state,
          [action.payload.name]: payloadWithCalculatedValue,
        }
      case ActionKind.CHANGE_IMPELLER_TYPE:
        const powerNumbers = calcPowerNumbers(action.payload)
        const nP = powerNumbers ? powerNumbers.nP : state.powerNumber.calculatedValue.value
        const nF = powerNumbers ? powerNumbers.nF : state.flowNumber.calculatedValue.value

        const powerNumber = {
          ...state['powerNumber'],
          displayValue: { value: nP.toString(), unit: 'unitless' },
          calculatedValue: { value: nP, unit: 'unitless' },
        }
        const flowNumber = {
          ...state['flowNumber'],
          displayValue: { value: nF.toString(), unit: 'unitless' },
          calculatedValue: { value: nF, unit: 'unitless' },
        }

        return {
          ...state,
          powerNumber,
          flowNumber,
          baseImpellerType: action.payload,
        }
      default:
        alert('Error: State reducer action not recognized')
        return state
    }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  //Solve answer on initial page load
  useEffect(() => {
    console.log(state)
  }, [state])

  const {
    solveSelection,
    baseDiameter,
    baseHeight,
    baseRPM,
    baseImpellerDiameter,
    baseImpellerType,
    flowNumber,
    powerNumber,
    scaledDiameter,
    scaledHeight,
    fluidDensity,
    fluidViscosity,
  } = state

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Agitation Scaleup'} text={'Scaleup from a small scale vessel to a larger scale'} />
      <CalcBody>
        <CalcCard title={'Base Vessel'}>
          <div className="mb-8 flex flex-col">
            <InputFieldWithUnit
              key={baseDiameter.name}
              name={baseDiameter.name}
              label={baseDiameter.label}
              placeholder={baseDiameter.placeholder}
              selected={false}
              displayValue={{ value: baseDiameter.displayValue.value, unit: baseDiameter.displayValue.unit }}
              error={baseDiameter.error}
              unitType={baseDiameter.unitType}
              focusText={baseDiameter.focusText}
              onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: ActionKind.CHANGE_VALUE_WITH_UNIT,
                  payload: { name: e.target.name, value: e.target.value },
                })
              }
              onChangeUnit={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: ActionKind.CHANGE_UNIT, payload: { name: e.target.name, value: e.target.value } })
              }
            />
            <InputFieldWithUnit
              key={baseHeight.name}
              name={baseHeight.name}
              label={baseHeight.label}
              placeholder={baseHeight.placeholder}
              selected={false}
              displayValue={{ value: baseHeight.displayValue.value, unit: baseHeight.displayValue.unit }}
              error={baseHeight.error}
              unitType={baseHeight.unitType}
              focusText={baseHeight.focusText}
              onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: ActionKind.CHANGE_VALUE_WITH_UNIT,
                  payload: { name: e.target.name, value: e.target.value },
                })
              }
              onChangeUnit={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: ActionKind.CHANGE_UNIT, payload: { name: e.target.name, value: e.target.value } })
              }
            />
            <InputFieldConstant
              key={baseRPM.name}
              name={baseRPM.name}
              label={baseRPM.label}
              placeholder={baseRPM.placeholder}
              selected={false}
              displayValue={{
                value: baseRPM.displayValue.value,
                unit: baseRPM.displayValue.unit,
              }}
              error={baseRPM.error}
              unitType={baseRPM.unitType}
              focusText={baseRPM.focusText}
              onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: ActionKind.CHANGE_VALUE_WITHOUT_UNIT,
                  payload: { name: e.target.name, value: e.target.value },
                })
              }
            />
            <InputFieldWithUnit
              key={baseImpellerDiameter.name}
              name={baseImpellerDiameter.name}
              label={baseImpellerDiameter.label}
              placeholder={baseImpellerDiameter.placeholder}
              selected={false}
              displayValue={{
                value: baseImpellerDiameter.displayValue.value,
                unit: baseImpellerDiameter.displayValue.unit,
              }}
              error={baseImpellerDiameter.error}
              unitType={baseImpellerDiameter.unitType}
              focusText={baseImpellerDiameter.focusText}
              onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: ActionKind.CHANGE_VALUE_WITH_UNIT,
                  payload: { name: e.target.name, value: e.target.value },
                })
              }
              onChangeUnit={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: ActionKind.CHANGE_UNIT, payload: { name: e.target.name, value: e.target.value } })
              }
            />
            <InputDropdown
              name={'impellerType'}
              label={'Impeller type'}
              selected={false}
              error={''}
              value={baseImpellerType}
              options={[
                { label: 'Rushton', value: 'rushton' },
                { label: 'Pitched Blade', value: 'pitchedBlade' },
                { label: 'Hydrofoil', value: 'hydrofoil' },
                { label: 'Custom', value: 'custom' },
              ]}
              focusText={'Enter style of vessel impeller'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: ActionKind.CHANGE_IMPELLER_TYPE, payload: e.target.value })
              }
            />
            {baseImpellerType === 'custom' && (
              <InputFieldConstant
                key={flowNumber.name}
                name={flowNumber.name}
                label={flowNumber.label}
                placeholder={flowNumber.placeholder}
                selected={false}
                displayValue={{
                  value: flowNumber.displayValue.value,
                  unit: flowNumber.displayValue.unit,
                }}
                error={flowNumber.error}
                unitType={flowNumber.unitType}
                focusText={flowNumber.focusText}
                onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({
                    type: ActionKind.CHANGE_VALUE_WITHOUT_UNIT,
                    payload: { name: e.target.name, value: e.target.value },
                  })
                }
              />
            )}
            {baseImpellerType === 'custom' && (
              <InputFieldConstant
                key={powerNumber.name}
                name={powerNumber.name}
                label={powerNumber.label}
                placeholder={powerNumber.placeholder}
                selected={false}
                displayValue={{
                  value: powerNumber.displayValue.value,
                  unit: powerNumber.displayValue.unit,
                }}
                error={powerNumber.error}
                unitType={powerNumber.unitType}
                focusText={powerNumber.focusText}
                onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({
                    type: ActionKind.CHANGE_VALUE_WITHOUT_UNIT,
                    payload: { name: e.target.name, value: e.target.value },
                  })
                }
              />
            )}
          </div>
        </CalcCard>
        <CalcCard title={'Scaled Up Vessel'}>
          <div className="mb-8 flex flex-col">
            <InputFieldWithUnit
              key={scaledDiameter.name}
              name={scaledDiameter.name}
              label={scaledDiameter.label}
              placeholder={scaledDiameter.placeholder}
              selected={false}
              displayValue={{
                value: scaledDiameter.displayValue.value,
                unit: scaledDiameter.displayValue.unit,
              }}
              error={scaledDiameter.error}
              unitType={scaledDiameter.unitType}
              focusText={scaledDiameter.focusText}
              onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: ActionKind.CHANGE_VALUE_WITH_UNIT,
                  payload: { name: e.target.name, value: e.target.value },
                })
              }
              onChangeUnit={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: ActionKind.CHANGE_UNIT, payload: { name: e.target.name, value: e.target.value } })
              }
            />
            <InputFieldWithUnit
              key={scaledHeight.name}
              name={scaledHeight.name}
              label={scaledHeight.label}
              placeholder={scaledHeight.placeholder}
              selected={false}
              displayValue={{
                value: scaledHeight.displayValue.value,
                unit: scaledHeight.displayValue.unit,
              }}
              error={scaledHeight.error}
              unitType={scaledHeight.unitType}
              focusText={scaledHeight.focusText}
              onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: ActionKind.CHANGE_VALUE_WITH_UNIT,
                  payload: { name: e.target.name, value: e.target.value },
                })
              }
              onChangeUnit={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: ActionKind.CHANGE_UNIT, payload: { name: e.target.name, value: e.target.value } })
              }
            />
            <h2 className="my-4 text-xl">Fluid Properties</h2>
            <InputFieldWithUnit
              key={fluidDensity.name}
              name={fluidDensity.name}
              label={fluidDensity.label}
              placeholder={fluidDensity.placeholder}
              selected={false}
              displayValue={{
                value: fluidDensity.displayValue.value,
                unit: fluidDensity.displayValue.unit,
              }}
              error={fluidDensity.error}
              unitType={fluidDensity.unitType}
              focusText={fluidDensity.focusText}
              onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: ActionKind.CHANGE_VALUE_WITH_UNIT,
                  payload: { name: e.target.name, value: e.target.value },
                })
              }
              onChangeUnit={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: ActionKind.CHANGE_UNIT, payload: { name: e.target.name, value: e.target.value } })
              }
            />
            <InputFieldConstant
              key={fluidViscosity.name}
              name={fluidViscosity.name}
              label={fluidViscosity.label}
              placeholder={fluidViscosity.placeholder}
              selected={false}
              displayValue={{
                value: fluidViscosity.displayValue.value,
                unit: fluidViscosity.displayValue.unit,
              }}
              error={fluidViscosity.error}
              unitType={fluidViscosity.unitType}
              focusText={fluidViscosity.focusText}
              onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: ActionKind.CHANGE_VALUE_WITHOUT_UNIT,
                  payload: { name: e.target.name, value: e.target.value },
                })
              }
            />
            <h2 className="my-4 text-xl">Scale Up Method</h2>
            <InputDropdown
              name={'method'}
              label={'Method'}
              selected={false}
              error={''}
              value={solveSelection}
              options={[
                { label: 'Constant Tip Speed', value: 'tipSpeed' },
                { label: 'Contant P/V', value: 'p/V' },
                { label: 'Contant Reynolds Number', value: 'Re' },
              ]}
              focusText={'Enter scale up method'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: ActionKind.CHANGE_SOLVE_SELECTION, payload: e.target.value })
              }
            />
          </div>
        </CalcCard>
        <ResultsTable state={state} />

        {/* <EquationCard /> */}
        {/* <ExampleCard data={state} /> */}
      </CalcBody>
    </PageContainer>
  )
}

export default Agitation

const ResultsTable = ({ state }: { state: State }) => {
  const {
    solveSelection,
    baseDiameter,
    baseHeight,
    baseRPM,
    baseImpellerDiameter,
    baseImpellerType,
    flowNumber,
    powerNumber,
    scaledDiameter,
    scaledHeight,
    fluidDensity,
    fluidViscosity,
  } = state

  const calculateVolume = (diameter: number, height: number) => {
    return Math.PI * (diameter / 2) ** 2 * height
  }

  const calculateAnswer = (state: State) => {
    const baseVolume = calculateVolume(baseDiameter.calculatedValue.value, baseHeight.calculatedValue.value) // m^3
    const scaledVolume = calculateVolume(scaledDiameter.calculatedValue.value, scaledHeight.calculatedValue.value) // m^3
    const baseTipSpeed = baseRPM.calculatedValue.value * baseImpellerDiameter.calculatedValue.value * Math.PI // m/s
    let scaledTipSpeed = baseTipSpeed
    const impellerRatio = baseImpellerDiameter.calculatedValue.value / baseDiameter.calculatedValue.value // unitless
    const scaledImpellerDiameter = scaledDiameter.calculatedValue.value * impellerRatio // m

    if (state.solveSelection === 'tipSpeed') {
    }

    const baseShaftSpeed = baseRPM.calculatedValue.value //rpm
    const scaledShaftSpeed = scaledTipSpeed / (scaledImpellerDiameter * Math.PI) //rpm
    const basePumpingRate =
      ((flowNumber.calculatedValue.value * baseShaftSpeed) / 60) * baseImpellerDiameter.calculatedValue.value ** 3 // m^3/s
    const scaledPumpingRate = ((flowNumber.calculatedValue.value * scaledShaftSpeed) / 60) * scaledImpellerDiameter ** 3 // m^3/s
    const basePower =
      powerNumber.calculatedValue.value *
      fluidDensity.calculatedValue.value *
      (baseShaftSpeed / 60) ** 3 *
      baseDiameter.calculatedValue.value ** 5 // kW
    const scaledPower =
      powerNumber.calculatedValue.value *
      fluidDensity.calculatedValue.value *
      (scaledShaftSpeed / 60) ** 3 *
      scaledDiameter.calculatedValue.value ** 5 // kW

    const baseRe =
      (baseImpellerDiameter.calculatedValue.value ** 2 * baseShaftSpeed * fluidDensity.calculatedValue.value) /
      fluidViscosity.calculatedValue.value
    const scaledRe =
      (scaledImpellerDiameter ** 2 * scaledShaftSpeed * fluidDensity.calculatedValue.value) /
      fluidViscosity.calculatedValue.value

    const basePV = basePower / baseVolume
    const scaledPV = scaledPower / scaledVolume

    const baseVelocity = (4 * basePumpingRate) / (Math.PI * baseDiameter.calculatedValue.value ** 2)
    const scaledVelocity = (4 * scaledPumpingRate) / (Math.PI * scaledDiameter.calculatedValue.value ** 2)

    return {
      baseVolume,
      scaledVolume,
      baseDiameter: baseDiameter.calculatedValue.value,
      scaledDiameter: scaledDiameter.calculatedValue.value,
      baseTipSpeed,
      scaledTipSpeed,
      baseShaftSpeed,
      scaledShaftSpeed,
      basePumpingRate,
      scaledPumpingRate,
      basePower,
      scaledPower,
      scaledImpellerDiameter,
      basePV,
      scaledPV,
      baseRe,
      scaledRe,
      baseVelocity,
      scaledVelocity,
    }
  }

  const answer = calculateAnswer(state)

  return (
    <CalcCard title={'Results'} type={'lg'}>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Base Case</th>
              <th>Scaled Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vessel Volume</td>
              <td>{answer.baseVolume.toLocaleString()} m³</td>
              <td>{answer.scaledVolume.toLocaleString()} m³</td>
            </tr>
            <tr>
              <td>Vessel Diameter</td>
              <td>{answer.baseDiameter.toLocaleString()} m</td>
              <td>{answer.scaledDiameter.toLocaleString()} m</td>
            </tr>
            <tr>
              <td>Impeller Diameter</td>
              <td>{state.baseImpellerDiameter.calculatedValue.value.toLocaleString()} m</td>
              <td>{answer.scaledImpellerDiameter.toLocaleString()} m</td>
            </tr>
            <tr>
              <td>Flow Number</td>
              <td>{flowNumber.calculatedValue.value}</td>
              <td>{flowNumber.calculatedValue.value}</td>
            </tr>
            <tr>
              <td>Power Number</td>
              <td>{powerNumber.calculatedValue.value}</td>
              <td>{powerNumber.calculatedValue.value}</td>
            </tr>
            <tr>
              <td>Shaft Speed</td>
              <td>{answer.baseShaftSpeed.toLocaleString()} rpm</td>
              <td>{answer.scaledShaftSpeed.toLocaleString()} rpm</td>
            </tr>
            <tr>
              <td>Tip Speed</td>
              <td>{answer.baseTipSpeed.toLocaleString()} m/s</td>
              <td>{answer.scaledTipSpeed.toLocaleString()} m/s</td>
            </tr>
            <tr>
              <td>Pumping Rate</td>
              <td>{answer.basePumpingRate.toLocaleString()} m³/s</td>
              <td>{answer.scaledPumpingRate.toLocaleString()} m³/s</td>
            </tr>
            <tr>
              <td>Power Consumption</td>
              <td>{answer.basePower.toLocaleString()} kW</td>
              <td>{answer.scaledPower.toLocaleString()} kW</td>
            </tr>
            <tr>
              <td>P/V</td>
              <td>{answer.basePV.toLocaleString()} kW/m³</td>
              <td>{answer.scaledPV.toLocaleString()} kW/m³</td>
            </tr>
            <tr>
              <td>Reynold's No</td>
              <td>{answer.baseRe.toLocaleString()}</td>
              <td>{answer.scaledRe.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Bulk Velocity</td>
              <td>{answer.baseVelocity.toLocaleString()} m/s</td>
              <td>{answer.scaledVelocity.toLocaleString()} m/s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CalcCard>
  )
}
