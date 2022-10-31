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
import { InputType } from '../types'

type State = {
  solveSelection: string
  baseDiameter: InputType
  baseHeight: InputType
  baseRPM: InputType
  baseImpellerDiameter: InputType
  baseImpellerType: string
  baseFlowNumber: InputType
  basePowerNumber: InputType
  scaledDiameter: InputType
  scaledHeight: InputType
  fluidDensity: InputType
  fluidViscosity: InputType
}

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

    baseFlowNumber: {
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
    basePowerNumber: {
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
      unitType: 'length',
      displayValue: { value: '1000', unit: 'kg/L' },
      calculatedValue: { value: 1000, unit: 'kg/L' },
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
        type: ActionKind.CHANGE_SOLVE_SELECTION
        payload: string
      }
    | {
        type: ActionKind.CHANGE_VALUE
        payload: InputType
      }
    | {
        type: ActionKind.CHANGE_IMPELLER_TYPE
        payload: string
      }
    | {
        type: ActionKind.REFRESH
      }

  enum ActionKind {
    CHANGE_VALUE = 'CHANGE_VALUE',
    CHANGE_SOLVE_SELECTION = 'CHANGE_SOLVE_SELECTION',
    CHANGE_IMPELLER_TYPE = 'CHANGE_IMPELLER_TYPE',
    REFRESH = 'REFRESH',
  }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.CHANGE_SOLVE_SELECTION:
        return {
          ...state,
          solveSelection: action.payload,
        }
      case ActionKind.CHANGE_IMPELLER_TYPE:
        return {
          ...state,
          baseImpellerType: action.payload,
        }
      default:
        alert('Error: State reducer action not recognized')
        return state
    }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  //   const handleChangeSolveSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     dispatch({ type: ActionKind.CHANGE_SOLVE_SELECTION, payload: e.target.value })
  //   }

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    //   const { name, value } = e.target
    //   const numericValue = value.replace(/[^\d.-]/g, '')
    //   const unit = state[name as keyof InputState].displayValue.unit
    //   const payload = { ...state[name as keyof InputState], displayValue: { value: numericValue, unit } }
    //   dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    //   const { name, value } = e.target
    //   const existingValue = state[name as keyof InputState].displayValue.value
    //   const payload = { ...state[name as keyof InputState], displayValue: { value: existingValue, unit: value } }
    //   dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

  //   //Solve answer on initial page load
  //   useEffect(() => {
  //     const refresh = () => {
  //       console.log('Refreshing')
  //       dispatch({ type: ActionKind.REFRESH })
  //     }
  //     refresh()
  //   }, [])

  const {
    solveSelection,
    baseDiameter,
    baseHeight,
    baseRPM,
    baseImpellerDiameter,
    baseImpellerType,
    baseFlowNumber,
    basePowerNumber,
    scaledDiameter,
    scaledHeight,
    fluidDensity,
    fluidViscosity,
  } = state

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Agitation Scaleup'} text={'Scaleup from a small scale reactor to a larger scale'} />
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
              onChangeValue={handleChangeValue}
              onChangeUnit={handleChangeUnit}
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
              onChangeValue={handleChangeValue}
              onChangeUnit={handleChangeUnit}
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
              onChangeValue={handleChangeValue}
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
              onChangeValue={handleChangeValue}
              onChangeUnit={handleChangeUnit}
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
                key={baseFlowNumber.name}
                name={baseFlowNumber.name}
                label={baseFlowNumber.label}
                placeholder={baseFlowNumber.placeholder}
                selected={false}
                displayValue={{
                  value: baseFlowNumber.displayValue.value,
                  unit: baseFlowNumber.displayValue.unit,
                }}
                error={baseFlowNumber.error}
                unitType={baseFlowNumber.unitType}
                focusText={baseFlowNumber.focusText}
                onChangeValue={handleChangeValue}
              />
            )}
            {baseImpellerType === 'custom' && (
              <InputFieldConstant
                key={basePowerNumber.name}
                name={basePowerNumber.name}
                label={basePowerNumber.label}
                placeholder={basePowerNumber.placeholder}
                selected={false}
                displayValue={{
                  value: basePowerNumber.displayValue.value,
                  unit: basePowerNumber.displayValue.unit,
                }}
                error={basePowerNumber.error}
                unitType={basePowerNumber.unitType}
                focusText={basePowerNumber.focusText}
                onChangeValue={handleChangeValue}
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
              onChangeValue={handleChangeValue}
              onChangeUnit={handleChangeUnit}
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
              onChangeValue={handleChangeValue}
              onChangeUnit={handleChangeUnit}
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
              onChangeValue={handleChangeValue}
              onChangeUnit={handleChangeUnit}
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
              onChangeValue={handleChangeValue}
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

        {/* <EquationCard /> */}
        {/* <ExampleCard data={state} /> */}
      </CalcBody>
    </PageContainer>
  )
}

export default Agitation
