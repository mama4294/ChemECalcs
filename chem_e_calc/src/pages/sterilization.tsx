import React, { useContext, useEffect, useReducer } from 'react'
import { Breadcrumbs } from '../components/calculators/breadcrumbs'
import { CalcBody } from '../components/calculators/calcBody'
import { CalcCard } from '../components/calculators/calcCard'
import { PageContainer } from '../components/calculators/container'
import { CalcHeader } from '../components/calculators/header'
import { Equation, VariableDefinition } from '../components/Equation'
import { InputDropdown, InputFieldWithUnit } from '../components/inputs/inputFieldObj'
import { MicrobeNames, microbialData, MicrobialData } from '../constants/sterilizationData'
import { DefaultUnitContext, DefaultUnitContextType } from '../contexts/defaultUnitContext'
import { updateCalculatedValue } from '../logic/logic'
import { ShortInputType } from '../types'
import { convertUnits } from '../utils/units'

//TODO add equations

type State = {
  temperature: ShortInputType
  holdTime: ShortInputType
  zValue: ShortInputType
  dValue: ShortInputType
  tRef: ShortInputType
  microbe: MicrobeNames
}

type StateWithoutSolveSelection = Omit<State, 'microbe'>

const resetErrorMessages = (state: State): State => {
  return {
    ...state,
    temperature: { ...state.temperature, error: '' },
    holdTime: { ...state.holdTime, error: '' },
  }
}

const calculateAnswer = (state: State): State => {
  const { temperature, holdTime } = state
  const inputTemp = temperature.calculatedValue.value //C
  const inputTime = holdTime.calculatedValue.value //s

  let validatedState = resetErrorMessages(state)

  // switch (state.solveSelection) {
  //   case 'volumeFlowRate':
  //     if (inputDiameter <= inputThickness * 2) {
  //       validatedState = { ...validatedState, thickness: { ...validatedState.thickness, error: 'Thickness too large' } }
  //     }
  //     if (inputDiameter < 0) {
  //       validatedState = {
  //         ...validatedState,
  //         outerDiameter: { ...validatedState.outerDiameter, error: 'Diameter must be positive' },
  //       }
  //     }
  //     if (inputThickness < 0) {
  //       validatedState = {
  //         ...validatedState,
  //         thickness: { ...validatedState.thickness, error: 'Thickness must be positive' },
  //       }
  //     }
  //     let innerDiameter = inputDiameter - 2 * inputThickness //m
  //     let area = Math.PI * (innerDiameter / 2) ** 2 //m2
  //     let answer = inputVelocity * area //m3/s

  //     let updatedAnswer = updatedisplayValue({
  //       ...volumeFlowRate,
  //       calculatedValue: { value: answer, unit: volumeFlowRate.calculatedValue.unit },
  //     })

  //     return {
  //       ...validatedState,
  //       volumeFlowRate: updatedAnswer,
  //     }
  //   case 'velocity':
  //     if (inputDiameter <= inputThickness * 2) {
  //       validatedState = { ...validatedState, thickness: { ...validatedState.thickness, error: 'Thickness too large' } }
  //     }
  //     if (inputDiameter < 0) {
  //       validatedState = {
  //         ...validatedState,
  //         outerDiameter: { ...validatedState.outerDiameter, error: 'Diameter must be positive' },
  //       }
  //     }
  //     if (inputThickness < 0) {
  //       validatedState = {
  //         ...validatedState,
  //         thickness: { ...validatedState.thickness, error: 'Thickness must be positive' },
  //       }
  //     }
  //     innerDiameter = inputDiameter - 2 * inputThickness //m
  //     area = Math.PI * (innerDiameter / 2) ** 2 //m2
  //     answer = inputFlowrate / area //m/2

  //     updatedAnswer = updatedisplayValue({
  //       ...velocity,
  //       calculatedValue: { value: answer, unit: velocity.calculatedValue.unit },
  //     })

  //     return {
  //       ...validatedState,
  //       velocity: updatedAnswer,
  //     }
  //   case 'outerDiameter':
  //     area = inputFlowrate / inputVelocity //m2
  //     innerDiameter = 2 * Math.sqrt(area / Math.PI) //m
  //     answer = innerDiameter + 2 * inputThickness //m

  //     if (inputThickness < 0) {
  //       validatedState = {
  //         ...validatedState,
  //         thickness: { ...validatedState.thickness, error: 'Thickness must be positive' },
  //       }
  //     }

  //     updatedAnswer = updatedisplayValue({
  //       ...outerDiameter,
  //       calculatedValue: { value: answer, unit: outerDiameter.calculatedValue.unit },
  //     })

  //     return {
  //       ...validatedState,
  //       outerDiameter: updatedAnswer,
  //     }
  //   default:
  //     const neverEver: never = state.solveSelection
  //     console.error('Error: State reducer action not recognized, ', neverEver)
  //     return state
  // }

  return validatedState
}

const updatedisplayValue = (object: ShortInputType): ShortInputType => {
  const { calculatedValue, displayValue } = object
  const convertedValue = convertUnits({
    value: calculatedValue.value,
    fromUnit: calculatedValue.unit,
    toUnit: displayValue.unit,
  })
  return {
    ...object,
    displayValue: { value: convertedValue.toLocaleString(), unit: displayValue.unit },
  }
}

const Sterilization = () => {
  const paths = [{ title: 'Sterilization', href: '/sterilization' }]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  const initialState: State = {
    microbe: 'Escherichia coli',
    temperature: {
      name: 'temperature',
      label: 'Temperature',
      placeholder: '0',
      unitType: 'temperature',
      displayValue: { value: '5', unit: defaultUnits.temperature },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'C',
          }),
          unit: 'C',
        }
      },
      selectiontext: '',
      focusText: 'Enter sterilization temperature',
      error: '',
    },
    holdTime: {
      name: 'holdTime',
      label: 'Hold Time',
      placeholder: '0',
      unitType: 'time',
      displayValue: { value: '1', unit: 'min' },
      calculatedValue: { value: 1, unit: 'min' },
      selectiontext: '',
      focusText: 'Enter the time the media is held at the sterilizaiton temp',
      error: '',
    },
    tRef: {
      name: 'tRef',
      label: 'Reference Temperature',
      placeholder: '0',
      unitType: 'temperature',
      displayValue: { value: '121', unit: defaultUnits.temperature },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'C',
          }),
          unit: 'C',
        }
      },
      selectiontext: '',
      focusText: 'Enter reference temperature of the Dvalue',
      error: '',
    },
    zValue: {
      name: 'zValue',
      label: 'Z Value',
      placeholder: '0',
      unitType: 'temperature',
      displayValue: { value: '10', unit: defaultUnits.temperature },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'C',
          }),
          unit: 'C',
        }
      },
      selectiontext: '',
      focusText: 'Enter Z Value',
      error: '',
    },
    dValue: {
      name: 'dValue',
      label: 'D value',
      placeholder: '0',
      unitType: 'time',
      displayValue: { value: '1', unit: 'min' },
      calculatedValue: { value: 1, unit: 'min' },
      selectiontext: '',
      focusText: 'Enter D-value',
      error: '',
    },
  }

  type MicrobeAndData = {
    microbe: MicrobeNames
    tRef: number
    zValue: number
    dValue: number
  }

  type Action =
    | {
        type: ActionKind.CHANGE_MICROBE_AND_VALUES
        payload: MicrobeAndData
      }
    | {
        type: ActionKind.CHANGE_MICROBE
        payload: MicrobeNames
      }
    | {
        type: ActionKind.CHANGE_VALUE
        payload: ShortInputType
      }
    | {
        type: ActionKind.REFRESH
      }

  enum ActionKind {
    CHANGE_VALUE = 'CHANGE_VALUE',
    CHANGE_MICROBE = 'CHANGE_MICROBE',
    CHANGE_MICROBE_AND_VALUES = 'CHANGE_MICROBE_AND_VALUES',
    REFRESH = 'REFRESH',
  }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.CHANGE_VALUE:
        const payloadWithCalculatedValue = updateCalculatedValue(action.payload)
        return calculateAnswer({ ...state, [action.payload.name]: payloadWithCalculatedValue })
      case ActionKind.REFRESH:
        return calculateAnswer({ ...state })
      case ActionKind.CHANGE_MICROBE:
        return calculateAnswer({ ...state, microbe: action.payload })
      case ActionKind.CHANGE_MICROBE_AND_VALUES:
        const { microbe } = action.payload
        const tRef = { ...state.tRef, displayValue: { value: action.payload.tRef.toString(), unit: 'C' } }
        const zValue = { ...state.zValue, displayValue: { value: action.payload.zValue.toString(), unit: 'C' } }
        const dValue = { ...state.dValue, displayValue: { value: action.payload.dValue.toString(), unit: 's' } }
        return calculateAnswer({ ...state, microbe, tRef, zValue, dValue })
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

    const unit = state[name as keyof StateWithoutSolveSelection].displayValue.unit
    const payload = { ...state[name as keyof StateWithoutSolveSelection], displayValue: { value: numericValue, unit } }
    dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const existingValue = state[name as keyof StateWithoutSolveSelection].displayValue.value
    const payload = {
      ...state[name as keyof StateWithoutSolveSelection],
      displayValue: { value: existingValue, unit: value },
    }
    dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

  const handleChangeMicrobe = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = e.target.value as MicrobeNames
    const microbeObject = microbialData.find(microbe => microbe.value === payload)
    if (microbeObject) {
      const { tRef, zValue, dValue } = microbeObject
      console.log(microbeObject)
      dispatch({ type: ActionKind.CHANGE_MICROBE_AND_VALUES, payload: { microbe: payload, tRef, zValue, dValue } })
    } else {
      dispatch({ type: ActionKind.CHANGE_MICROBE, payload })
    }
  }

  //Solve answer on initial page load
  useEffect(() => {
    const refresh = () => {
      console.log('Refreshing')
      dispatch({ type: ActionKind.REFRESH })
    }
    refresh()
  }, [])

  const { temperature, holdTime, tRef, zValue, dValue, microbe } = state

  const isCustom = microbe === 'Custom'

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Sterilization'} text={'Calculate the thermal treatment in a system'} />
      <CalcBody>
        <CalcCard title={'Calculator'}>
          <>
            <div className="mb-8 flex flex-col">
              <InputFieldWithUnit
                key={temperature.name}
                name={temperature.name}
                label={temperature.label}
                placeholder={temperature.label}
                selected={false}
                displayValue={temperature.displayValue}
                error={temperature.error}
                unitType={temperature.unitType}
                focusText={temperature.focusText}
                onChangeValue={handleChangeValue}
                onChangeUnit={handleChangeUnit}
              />
              <InputFieldWithUnit
                key={holdTime.name}
                name={holdTime.name}
                label={holdTime.label}
                placeholder={holdTime.label}
                selected={false}
                displayValue={holdTime.displayValue}
                error={holdTime.error}
                unitType={holdTime.unitType}
                focusText={holdTime.focusText}
                onChangeValue={handleChangeValue}
                onChangeUnit={handleChangeUnit}
              />
              <InputDropdown
                name="microbe"
                label="Microorganism"
                selected={false}
                error=""
                value={microbe}
                options={[...microbialData, { value: 'Custom', label: 'Custom' }]}
                focusText={'Enter microorganism of interest'}
                onChange={handleChangeMicrobe}
              />
              {isCustom && (
                <InputFieldWithUnit
                  key={zValue.name}
                  name={zValue.name}
                  label={zValue.label}
                  placeholder={zValue.label}
                  selected={false}
                  displayValue={zValue.displayValue}
                  error={zValue.error}
                  unitType={zValue.unitType}
                  focusText={zValue.focusText}
                  onChangeValue={handleChangeValue}
                  onChangeUnit={handleChangeUnit}
                />
              )}
              {isCustom && (
                <InputFieldWithUnit
                  key={dValue.name}
                  name={dValue.name}
                  label={dValue.label}
                  placeholder={dValue.label}
                  selected={false}
                  displayValue={dValue.displayValue}
                  error={dValue.error}
                  unitType={dValue.unitType}
                  focusText={dValue.focusText}
                  onChangeValue={handleChangeValue}
                  onChangeUnit={handleChangeUnit}
                />
              )}{' '}
              {isCustom && (
                <InputFieldWithUnit
                  key={tRef.name}
                  name={tRef.name}
                  label={tRef.label}
                  placeholder={tRef.label}
                  selected={false}
                  displayValue={tRef.displayValue}
                  error={tRef.error}
                  unitType={tRef.unitType}
                  focusText={tRef.focusText}
                  onChangeValue={handleChangeValue}
                  onChangeUnit={handleChangeUnit}
                />
              )}
            </div>
          </>
        </CalcCard>
        <EquationCard />
      </CalcBody>
    </PageContainer>
  )
}

export default Sterilization

const EquationCard = () => {
  return (
    <CalcCard title="Governing Equation">
      <>
        <p>
          This calculator finds the velocity of fluid in a pipe. This is useful for more advanced calculations like
          determining the Reynolds number and pressure drop through a system. The governing equation is a function of
          flow rate and pipe geometery
        </p>
        <Equation equation={`$$v = Q/A_{i}$$`} />
        <p>The following equations are used to find the pipe geometery:</p>
        <Equation equation={`$$d_{i} = d_{0} - 2x_{w}$$`} />
        <Equation equation={`$$r_{i} = d_{i}/2$$`} />
        <Equation equation={`$$A_{i} = \\pi{r_{i}^{2}}$$`} />
        <p className="text-lg font-medium">Definitions</p>
        <VariableDefinition equation={`$$v = $$`} definition="Fluid velocity" />
        <VariableDefinition equation={`$$Q = $$`} definition="Fluid volumentric flow rate" />
        <VariableDefinition equation={`$$A_{i} = $$`} definition="Inner pipe area" />
        <VariableDefinition equation={`$$d_{i} = $$`} definition="Inner pipe diameter" />
        <VariableDefinition equation={`$$d_{o} = $$`} definition="Inner pipe diameter" />
        <VariableDefinition equation={`$$r_{i} = $$`} definition="Inner pipe radius" />
      </>
    </CalcCard>
  )
}
