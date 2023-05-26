import { NextPage } from 'next'
import { useContext, useEffect, useReducer } from 'react'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { InputDropdown, InputFieldConstant, InputFieldWithUnit } from '../../components/inputs/inputField'
import { DefaultUnitContext, DefaultUnitContextType, DefaultUnits } from '../../contexts/defaultUnitContext'
import { convertUnits } from '../../utils/units'
import { ShortInputType } from '../../types'
import { updateCalculatedValue } from '../../logic/logic'
import { Equation, VariableDefinition } from '../../components/Equation'
import { Metadata } from '../../components/Layout/Metadata'

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

//Power consumption per unit volume - Oxygen transfer rate
//Impeller tip speed - Shear rate
//Pumping rate - Mixing time
//Reynolds number - heat transfer

//type State without solveSelection and baseImpellerType
type StateWithoutStrings = Omit<State, 'solveSelection' | 'baseImpellerType'>

const Agitation: NextPage = () => {
  const paths = [
    { title: 'Fermentation', href: '/fermentation' },
    { title: 'Scaleup', href: '/agitation/scaleup' },
  ]
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
      name: 'flowNumber',
      label: 'Agitator Flow Number',
      placeholder: '0',

      unitType: 'length',
      displayValue: { value: '0.72', unit: 'unitless' },
      calculatedValue: { value: 0.72, unit: 'unitless' },
      selectiontext: '',
      focusText: 'Enter the flow number for the agitator',
      error: '',
    },
    powerNumber: {
      name: 'powerNumber',
      label: 'Impeller Power Number',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '5.5', unit: 'unitless' },
      calculatedValue: { value: 5.5, unit: 'unitless' },
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
      displayValue: { value: '1', unit: 'cP' },
      calculatedValue: { value: 1, unit: 'cP' },
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

  const resetErrorMessages = (state: State): State => {
    return {
      ...state,
      baseDiameter: { ...state.baseDiameter, error: '' },
      baseHeight: { ...state.baseHeight, error: '' },
      baseRPM: { ...state.baseRPM, error: '' },
      baseImpellerDiameter: { ...state.baseImpellerDiameter, error: '' },
      flowNumber: { ...state.flowNumber, error: '' },
      powerNumber: { ...state.powerNumber, error: '' },
      scaledDiameter: { ...state.scaledDiameter, error: '' },
      scaledHeight: { ...state.scaledHeight, error: '' },
      fluidDensity: { ...state.fluidDensity, error: '' },
      fluidViscosity: { ...state.fluidViscosity, error: '' },
    }
  }

  const validateState = (state: State) => {
    const validatedState = resetErrorMessages(state)

    const widthVessel = state.baseDiameter.calculatedValue.value
    const widthImpeller = state.baseImpellerDiameter.calculatedValue.value
    const rpm = state.baseRPM.calculatedValue.value
    const fluidDensity = state.fluidDensity.calculatedValue.value
    const fluidViscosity = state.fluidViscosity.calculatedValue.value
    const scaledWidth = state.scaledDiameter.calculatedValue.value
    const scaledHeight = state.scaledHeight.calculatedValue.value

    if (widthVessel <= 0) {
      validatedState.baseDiameter.error = 'Vessel diameter must be positive'
    }
    if (widthImpeller <= 0) {
      validatedState.baseImpellerDiameter.error = 'Impeller diameter must be positive'
    }

    if (widthImpeller > widthVessel) {
      validatedState.baseImpellerDiameter.error = 'Impeller diameter must be less than the vessel diameter'
    }
    if (rpm <= 0) {
      validatedState.baseRPM.error = 'RPM must be positive'
    }
    if (fluidDensity <= 0) {
      validatedState.fluidDensity.error = 'Fluid density must be positive'
    }
    if (fluidViscosity <= 0) {
      validatedState.fluidViscosity.error = 'Fluid viscosity must be positive'
    }

    if (scaledWidth <= 0) {
      validatedState.scaledDiameter.error = 'Scaled diameter must be positive'
    }
    if (scaledHeight <= 0) {
      validatedState.scaledHeight.error = 'Scaled height must be positive'
    }

    return validatedState
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
        return validateState({ ...state, [name]: payloadWithCalculatedValue })

      case ActionKind.CHANGE_VALUE_WITHOUT_UNIT:
        name = action.payload.name
        numericValue = action.payload.value.replace(/[^\d.-]/g, '')
        console.log('name', name)
        console.log('numericValue', numericValue)
        unit = state[name as keyof StateWithoutStrings].displayValue.unit
        payload = {
          ...state[name as keyof StateWithoutStrings],
          displayValue: { value: numericValue, unit },
          calculatedValue: { value: Number(numericValue), unit },
        }
        return validateState({ ...state, [name]: payload })

      case ActionKind.CHANGE_UNIT:
        name = action.payload.name
        const existingValue = state[name as keyof StateWithoutStrings].displayValue.value
        payload = {
          ...state[name as keyof StateWithoutStrings],
          displayValue: { value: existingValue, unit: action.payload.value },
        }
        payloadWithCalculatedValue = updateCalculatedValue(payload)
        return validateState({ ...state, [name]: payloadWithCalculatedValue })
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
    <>
      <Metadata
        title="Agitation Scaleup"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Agitation, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Agitation Scaleup'} text={'Scaleup a vessel from small scale to large scale'} />
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
            </div>
          </CalcCard>
          <ResultsTable
            state={state}
            defaultUnits={defaultUnits}
            onChangeSolveSelection={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: ActionKind.CHANGE_SOLVE_SELECTION,
                payload: e.target.value,
              })
            }
          />
          <EquationCard />
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default Agitation

type ResultsTableProps = {
  state: State
  defaultUnits: DefaultUnits
  onChangeSolveSelection: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ResultsTable = ({ state, onChangeSolveSelection, defaultUnits }: ResultsTableProps) => {
  const {
    solveSelection,
    baseDiameter,
    baseHeight,
    baseRPM,
    baseImpellerDiameter,
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

  const calculateAnswer = () => {
    const baseVolume = calculateVolume(baseDiameter.calculatedValue.value, baseHeight.calculatedValue.value) // m^3
    const scaledVolume = calculateVolume(scaledDiameter.calculatedValue.value, scaledHeight.calculatedValue.value) // m^3
    const baseTipSpeed = (baseRPM.calculatedValue.value / 60) * baseImpellerDiameter.calculatedValue.value * Math.PI // m/s
    console.log('Base RPM: ', Math.PI)
    const impellerRatio = baseImpellerDiameter.calculatedValue.value / baseDiameter.calculatedValue.value // unitless
    const scaledImpellerDiameter = scaledDiameter.calculatedValue.value * impellerRatio // m
    const baseShaftSpeed = baseRPM.calculatedValue.value //rpm
    const basePumpingRate =
      flowNumber.calculatedValue.value * (baseShaftSpeed / 60) * baseImpellerDiameter.calculatedValue.value ** 3 // m^3/s
    const basePower =
      (powerNumber.calculatedValue.value *
        fluidDensity.calculatedValue.value *
        (baseShaftSpeed / 60) ** 3 *
        baseImpellerDiameter.calculatedValue.value ** 5) /
      1000 // kW

    const baseRe =
      (baseImpellerDiameter.calculatedValue.value ** 2 * (baseShaftSpeed / 60) * fluidDensity.calculatedValue.value) /
      (fluidViscosity.calculatedValue.value / 1000) // unitless
    const basePV = basePower / baseVolume // kW/m^3
    const baseVelocity = (4 * basePumpingRate) / (Math.PI * baseDiameter.calculatedValue.value ** 2)
    const baseHW = baseHeight.calculatedValue.value / baseDiameter.calculatedValue.value // unitless
    const scaledHW = scaledHeight.calculatedValue.value / scaledDiameter.calculatedValue.value // unitless

    let scaledTipSpeed = 0
    let scaledShaftSpeed = 0
    let scaledPumpingRate = 0
    let scaledPower = 0
    let scaledRe = 0
    let scaledPV = 0
    let scaledVelocity = 0

    if (solveSelection === 'tipSpeed') {
      scaledTipSpeed = baseTipSpeed // m/s
      scaledShaftSpeed = (scaledTipSpeed / (scaledImpellerDiameter * Math.PI)) * 60 //rpm
      scaledPumpingRate = flowNumber.calculatedValue.value * (scaledShaftSpeed / 60) * scaledImpellerDiameter ** 3 // m^3/s
      scaledPower =
        (powerNumber.calculatedValue.value *
          fluidDensity.calculatedValue.value *
          (scaledShaftSpeed / 60) ** 3 *
          scaledImpellerDiameter ** 5) /
        1000 // kW
      scaledRe =
        (scaledImpellerDiameter ** 2 * (scaledShaftSpeed / 60) * fluidDensity.calculatedValue.value) /
        (fluidViscosity.calculatedValue.value / 1000) // unitless
      scaledPV = scaledPower / scaledVolume // unitless
      scaledVelocity = (4 * scaledPumpingRate) / (Math.PI * scaledDiameter.calculatedValue.value ** 2)
    } else if (solveSelection === 'p/V') {
      scaledPV = basePV // kW/m^3
      scaledPower = scaledPV * scaledVolume // kW
      scaledShaftSpeed =
        ((scaledPower * 1000) /
          (powerNumber.calculatedValue.value * fluidDensity.calculatedValue.value * scaledImpellerDiameter ** 5)) **
          (1 / 3) *
        60 //rpm
      scaledTipSpeed = (scaledShaftSpeed / 60) * scaledImpellerDiameter * Math.PI // m/s
      scaledPumpingRate = flowNumber.calculatedValue.value * (scaledShaftSpeed / 60) * scaledImpellerDiameter ** 3 // m^3/s
      scaledRe =
        (scaledImpellerDiameter ** 2 * (scaledShaftSpeed / 60) * fluidDensity.calculatedValue.value) /
        (fluidViscosity.calculatedValue.value / 1000) // unitless
      scaledVelocity = (4 * scaledPumpingRate) / (Math.PI * scaledDiameter.calculatedValue.value ** 2)
    } else if (solveSelection === 'Re') {
      scaledRe = baseRe // unitless
      scaledShaftSpeed =
        ((scaledRe * (fluidViscosity.calculatedValue.value / 1000)) /
          (fluidDensity.calculatedValue.value * scaledImpellerDiameter ** 2)) *
        60 //rpm
      scaledTipSpeed = (scaledShaftSpeed / 60) * scaledImpellerDiameter * Math.PI // m/s
      scaledPumpingRate = flowNumber.calculatedValue.value * (scaledShaftSpeed / 60) * scaledImpellerDiameter ** 3 // m^3/s
      scaledPower =
        (powerNumber.calculatedValue.value *
          fluidDensity.calculatedValue.value *
          (scaledShaftSpeed / 60) ** 3 *
          scaledImpellerDiameter ** 5) /
        1000 // kW
      scaledPV = scaledPower / scaledVolume // unitless
      scaledVelocity = (4 * scaledPumpingRate) / (Math.PI * scaledDiameter.calculatedValue.value ** 2)
    } else if (solveSelection === 'pumping') {
      scaledPumpingRate = basePumpingRate // m^3/s
      scaledShaftSpeed = (scaledPumpingRate / (flowNumber.calculatedValue.value * scaledImpellerDiameter ** 3)) * 60 //rpm
      scaledTipSpeed = (scaledShaftSpeed / 60) * scaledImpellerDiameter * Math.PI // m/s
      scaledPower =
        (powerNumber.calculatedValue.value *
          fluidDensity.calculatedValue.value *
          (scaledShaftSpeed / 60) ** 3 *
          scaledImpellerDiameter ** 5) /
        1000 // kW
      scaledRe =
        (scaledImpellerDiameter ** 2 * (scaledShaftSpeed / 60) * fluidDensity.calculatedValue.value) /
        (fluidViscosity.calculatedValue.value / 1000) // unitless
      scaledPV = scaledPower / scaledVolume // unitless
      scaledVelocity = (4 * scaledPumpingRate) / (Math.PI * scaledDiameter.calculatedValue.value ** 2)
    }

    const baseMotorPower = basePower / 0.8 // kW
    const scaledMotorPower = scaledPower / 0.8 // kW

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
      baseMotorPower,
      scaledMotorPower,
      baseHW,
      scaledHW,
    }
  }

  const answer = calculateAnswer()

  const answerBaseVolume = convertUnits({
    value: answer.baseVolume,
    fromUnit: 'm3',
    toUnit: defaultUnits.volume,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerScaledVolume = convertUnits({
    value: answer.scaledVolume,
    fromUnit: 'm3',
    toUnit: defaultUnits.volume,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerBaseDiameter = convertUnits({
    value: answer.baseDiameter,
    fromUnit: 'm',
    toUnit: defaultUnits.length,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerScaledDiameter = convertUnits({
    value: answer.scaledDiameter,
    fromUnit: 'm',
    toUnit: defaultUnits.length,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerBaseImpellerDiameter = convertUnits({
    value: state.baseImpellerDiameter.calculatedValue.value,
    fromUnit: 'm',
    toUnit: defaultUnits.length,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerScaledImpellerDiameter = convertUnits({
    value: answer.scaledImpellerDiameter,
    fromUnit: 'm',
    toUnit: defaultUnits.length,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerBaseTipSpeed = convertUnits({
    value: answer.baseTipSpeed,
    fromUnit: 'm/s',
    toUnit: defaultUnits.speed,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerScaledTipSpeed = convertUnits({
    value: answer.scaledTipSpeed,
    fromUnit: 'm/s',
    toUnit: defaultUnits.speed,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerBasePumpingRate = convertUnits({
    value: answer.basePumpingRate,
    fromUnit: 'm3/s',
    toUnit: defaultUnits.volumeFlowRate,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerScaledPumpingRate = convertUnits({
    value: answer.scaledPumpingRate,
    fromUnit: 'm3/s',
    toUnit: defaultUnits.volumeFlowRate,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerBasePower = convertUnits({
    value: answer.basePower,
    fromUnit: 'kW',
    toUnit: defaultUnits.power,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerScaledPower = convertUnits({
    value: answer.scaledPower,
    fromUnit: 'kW',
    toUnit: defaultUnits.power,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerBaseMotorPower = convertUnits({
    value: answer.baseMotorPower,
    fromUnit: 'kW',
    toUnit: defaultUnits.power,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerScaledMotorPower = convertUnits({
    value: answer.scaledMotorPower,
    fromUnit: 'kW',
    toUnit: defaultUnits.power,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerBaseVelocity = convertUnits({
    value: answer.baseVelocity,
    fromUnit: 'm/s',
    toUnit: defaultUnits.speed,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const answerScaledVelocity = convertUnits({
    value: answer.scaledVelocity,
    fromUnit: 'm/s',
    toUnit: defaultUnits.speed,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  return (
    <CalcCard title={'Results'} type={'sm'}>
      <div className="overflow-x-auto">
        {/* <h2 className="my-4 text-xl">Scale Up Method</h2> */}
        <InputDropdown
          name={'method'}
          label={'Scale Up Method'}
          selected={false}
          error={''}
          value={solveSelection}
          options={[
            { label: 'Constant Tip Speed', value: 'tipSpeed' },
            { label: 'Contant P/V', value: 'p/V' },
            { label: 'Contant Reynolds Number', value: 'Re' },
            { label: 'Contant Pumping Rate', value: 'pumping' },
          ]}
          focusText={'Enter scale up method'}
          onChange={onChangeSolveSelection}
          topRight={<ScaleUpMathodHint />}
        />
        <table className="table-compact mt-6 table w-full">
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
              <td>
                {answerBaseVolume} {defaultUnits.volume}
              </td>
              <td>
                {answerScaledVolume} {defaultUnits.volume}
              </td>
            </tr>
            <tr>
              <td>Vessel Diameter</td>
              <td>
                {answerBaseDiameter} {defaultUnits.length}
              </td>
              <td>
                {answerScaledDiameter} {defaultUnits.length}
              </td>
            </tr>
            <tr>
              <td>Aspect Ratio</td>
              <td>{answer.baseHW.toLocaleString('en-US', { maximumSignificantDigits: 3 })}</td>
              <td>{answer.scaledHW.toLocaleString('en-US', { maximumSignificantDigits: 3 })}</td>
            </tr>
            <tr>
              <td>Impeller Diameter</td>
              <td>
                {answerBaseImpellerDiameter} {defaultUnits.length}
              </td>
              <td>
                {answerScaledImpellerDiameter} {defaultUnits.length}
              </td>
            </tr>
            <tr>
              <td>Flow Number</td>
              <td>{flowNumber.calculatedValue.value.toLocaleString('en-US', { maximumSignificantDigits: 3 })}</td>
              <td>{flowNumber.calculatedValue.value.toLocaleString('en-US', { maximumSignificantDigits: 3 })}</td>
            </tr>
            <tr>
              <td>Power Number</td>
              <td>{powerNumber.calculatedValue.value.toLocaleString('en-US', { maximumSignificantDigits: 3 })}</td>
              <td>{powerNumber.calculatedValue.value.toLocaleString('en-US', { maximumSignificantDigits: 3 })}</td>
            </tr>
            <tr>
              <td>Shaft Speed</td>
              <td>{answer.baseShaftSpeed.toLocaleString('en-US', { maximumSignificantDigits: 3 })} rpm</td>
              <td>{answer.scaledShaftSpeed.toLocaleString('en-US', { maximumSignificantDigits: 3 })} rpm</td>
            </tr>
            <tr>
              <td>Tip Speed</td>
              <td>
                {answerBaseTipSpeed} {defaultUnits.speed}
              </td>
              <td>
                {answerScaledTipSpeed} {defaultUnits.speed}
              </td>
            </tr>
            <tr>
              <td>Reynold&apos;s No</td>
              <td>{answer.baseRe.toPrecision(3)}</td>
              <td>{answer.scaledRe.toPrecision(3)}</td>
            </tr>
            <tr>
              <td>Pumping Rate</td>
              <td>
                {answerBasePumpingRate} {defaultUnits.volumeFlowRate}
              </td>
              <td>
                {answerScaledPumpingRate} {defaultUnits.volumeFlowRate}
              </td>
            </tr>
            <tr>
              <td>Power Consumption</td>
              <td>
                {answerBasePower} {defaultUnits.power}
              </td>
              <td>
                {answerScaledPower} {defaultUnits.power}
              </td>
            </tr>
            <tr>
              <td>Motor Size</td>
              <td>
                {answerBaseMotorPower} {defaultUnits.power}
              </td>
              <td>
                {answerScaledMotorPower} {defaultUnits.power}
              </td>
            </tr>
            <tr>
              <td>P/V</td>
              <td>{answer.basePV.toPrecision(3)} kW/m³</td>
              <td>{answer.scaledPV.toPrecision(3)} kW/m³</td>
            </tr>
            <tr>
              <td>Bulk Velocity</td>
              <td>
                {answerBaseVelocity} {defaultUnits.speed}
              </td>
              <td>
                {answerScaledVelocity} {defaultUnits.speed}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CalcCard>
  )
}

const ScaleUpMathodHint = () => (
  <span className="label-text-alt">
    <div className="dropdown dropdown-end">
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
      <div tabIndex={0} className="card dropdown-content compact rounded-box w-64 bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Need help deciding?</h2>
          <p>
            Use constant tip speed when <span className="font-bold">shear</span> is the most important factor
          </p>
          <p>
            Use constant P/V when <span className="font-bold">oxygen transfer rate</span> is the most important factor
          </p>
          <p>
            Use constant Reynolds number when <span className="font-bold">heat transfer</span> is the most important
            factor
          </p>
          <p>
            Use constant pumping rate when <span className="font-bold">mixing time</span> is the most important factor
          </p>
        </div>
      </div>
    </div>
  </span>
)

const EquationCard = () => {
  return (
    <CalcCard title="Governing Equation">
      <>
        <p>
          This calculator finds agitation scale up factors for a vessel given the dimentions and operating conditions of
          a base vessel.
        </p>
        <br />
        <p>Tip Speed</p>
        <Equation equation={`$$v_{t} = \\pi d_{im} N$$`} />
        <p>Reynolds Number</p>
        <Equation equation={`$$Re = d_{im}^{2} N \\rho / \\mu  $$`} />
        <p>Pumping Rate</p>
        <Equation equation={`$$Q = N_{q} N d_{im}^{3}$$`} />
        <p>Power Consumption</p>
        <Equation equation={`$$P = N_{p} \\rho N^{3} d_{im}^{5}$$`} />
        <p>Bulk Velocity</p>
        <Equation equation={`$$b_{b} = 4 Q / \\pi d_{v}$$`} />

        <p className="text-lg font-medium">Definitions</p>
        <VariableDefinition equation={`$$v_{t} = $$`} definition="Tip speed" />
        <VariableDefinition equation={`$$d_{im} = $$`} definition="Impeller diameter" />
        <VariableDefinition equation={`$$N = $$`} definition="Shaft speed" />
        <VariableDefinition equation={`$$\\rho = $$`} definition="Fluid density" />
        <VariableDefinition equation={`$$\\mu = $$`} definition="Fluid viscosity" />
        <VariableDefinition equation={`$$N_{q} = $$`} definition="Impeller pumping number" />
        <VariableDefinition equation={`$$N_{p} = $$`} definition="Impeller power number" />
        <VariableDefinition equation={`$$v_{b} = $$`} definition="Bulk velocity" />
        <VariableDefinition equation={`$$d_{bv} = $$`} definition="Vessel diameter" />
      </>
    </CalcCard>
  )
}
