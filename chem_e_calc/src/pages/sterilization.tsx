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

const calculateAnswer = (state: State) => {
  console.log(state)
  const { temperature, holdTime, tRef, zValue, dValue } = state
  const inputTemp = temperature.calculatedValue.value //C
  const inputTime = holdTime.calculatedValue.value //s
  const inputTRef = tRef.calculatedValue.value //C
  const inputZValue = zValue.calculatedValue.value //C
  const inputDValue = dValue.calculatedValue.value //s

  const lethality = inputTemp <= 121 ? 0 : (inputTemp - inputTRef) / (inputZValue * inputDValue) //1/s
  const accumulatedLethality = lethality * inputTime
  const logReduction = accumulatedLethality / inputDValue
  return { accumulatedLethality, logReduction }
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
      focusText: 'Enter sterilization temperature',
      error: '',
    },
    holdTime: {
      name: 'holdTime',
      label: 'Hold Time',
      placeholder: '0',
      unitType: 'time',
      displayValue: { value: '1', unit: 'min' },
      calculatedValue: { value: 1, unit: 's' },
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
      focusText: 'Reference temperature for the D value',
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
      focusText: 'Temperature increase at which rate of inactivation doubles',
      error: '',
    },
    dValue: {
      name: 'dValue',
      label: 'D value',
      placeholder: '0',
      unitType: 'time',
      displayValue: { value: '1', unit: 'min' },
      calculatedValue: { value: 1, unit: 's' },
      selectiontext: '',
      focusText: 'Time for inactivation to reach 90%',
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
        return { ...state, [action.payload.name]: payloadWithCalculatedValue }
      case ActionKind.REFRESH:
        return { ...state }
      case ActionKind.CHANGE_MICROBE:
        return { ...state, microbe: action.payload }
      case ActionKind.CHANGE_MICROBE_AND_VALUES:
        const { microbe } = action.payload
        const tRef = { ...state.tRef, displayValue: { value: action.payload.tRef.toString(), unit: 'C' } }
        const zValue = { ...state.zValue, displayValue: { value: action.payload.zValue.toString(), unit: 'C' } }
        const dValue = { ...state.dValue, displayValue: { value: action.payload.dValue.toString(), unit: 's' } }
        return { ...state, microbe, tRef, zValue, dValue }
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
  const answer = calculateAnswer(state)

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader
        title={'Sterilization'}
        text={'Calculate the thermal treatment using moist-heat steriliation kinetics'}
      />
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
        <AnswerCard state={state} />
        <EquationCard />
        <EquivalentExposureCard />
      </CalcBody>
    </PageContainer>
  )
}

export default Sterilization

type AnswerType = {
  state: State
}

const AnswerCard = ({ state }: AnswerType) => {
  const answer = calculateAnswer(state)
  return (
    <CalcCard title={'Results'}>
      <>
        <InputFieldWithUnit
          key="accumulatedLethality"
          name="accumulatedLethality"
          label="Accumulated Lethality"
          placeholder="0"
          selected={true}
          displayValue={{
            value: answer.accumulatedLethality.toLocaleString('en-US', { maximumSignificantDigits: 3 }),
            unit: 'slkdf',
          }}
          error=""
          unitType="volume"
          focusText=""
          onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
          onChangeUnit={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
        />
        <InputFieldWithUnit
          key="logReduction"
          name="logReduction"
          label="Log Reduction"
          placeholder="0"
          selected={true}
          displayValue={{
            value: answer.logReduction.toLocaleString('en-US', { maximumSignificantDigits: 3 }),
            unit: 'slkdf',
          }}
          error=""
          unitType="volume"
          focusText=""
          onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
          onChangeUnit={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
        />
      </>
    </CalcCard>
  )
}

const EquationCard = () => {
  return (
    <CalcCard title="Governing Equations">
      <>
        <p>
          A system contaminated by a microbial organism immersed in saturated steam at constant temperature has been
          shown to degrade over time according to the following 1st order chemical reaction:
        </p>
        <Equation equation={`$$\\frac{dN}{dt} = -kN$$`} />
        <p>This can be converted to the more useful base 10 form:</p>
        <Equation equation={`$$\\frac{N}{N_0} = 10^{-kt}$$`} />
        <p>Where</p>
        <br />
        <VariableDefinition equation={`$$N_0 = $$`} definition="Initial population of the mircoorganism" />
        <VariableDefinition equation={`$$t = $$`} definition="Steriliaiton time" />
        <VariableDefinition equation={`$$N = $$`} definition="Population of the microorganism after sterilization" />
        <VariableDefinition
          equation={`$$K = $$`}
          definition="Rate constant which is typical for the organism and conditions"
        />
        <br />

        <p className="text-lg font-medium">D-Value</p>
        <p>
          The D-value is defined as the time requires, at a specific reference temperature, to reduce the microbial
          population by one log reduction, i.e. from 100% to 10%.
        </p>
        <p>It is easily calculated as the reciprocal of the rate constant.</p>
        <Equation equation={`$$D = \\frac{1}{k}$$`} />
        <br />

        <p className="text-lg font-medium">Z-Value</p>
        <p>
          The D-value is only useful for the reference temperature it was calculated at. The Z-value can be used to
          extrapolate to different temperatures.
        </p>
        <p>
          The Z-value is defined as the temperature coefficient of microbial destruction which causes a 10-fold
          variation of the D-value
        </p>
        <p>
          For steam at temperatures between 100°C and 130°C, the Z-value is typically between 6 and 13°C. In the absense
          of experimental data, 10°C is typically chosen{' '}
        </p>
        <br />
      </>
    </CalcCard>
  )
}

const EquivalentExposureCard = () => {
  return (
    <CalcCard title="Equivalent Exposure">
      <>
        <p>
          The equivalent exposure time is the amount of time at the reference temperature, typically 121°C, the organism
          experienced.
        </p>
        <p>
          This can be used to determine the time required at accheive equivalent exposure if temperatures higher or
          lower than 121°C are used.
        </p>
        <Equation equation={`$$F_0 = \\Delta t\\sum 10^{\\frac{T-T_r}{Z}}$$`} />
        <VariableDefinition equation={`$$F_0 = $$`} definition="Equivalent exposure time" />
        <VariableDefinition equation={`$$\\Delta t = $$`} definition="Time interval" />
        <VariableDefinition equation={`$$T_r = $$`} definition="Reference temperature" />
        <VariableDefinition equation={`$$T = $$`} definition="Actual temperature" />
        <VariableDefinition equation={`$$Z = $$`} definition="Microorganism's Z-value" />

        <br />
        <p className="text-lg font-medium">Example</p>
        <p>
          If an contaminant with a D-value of 10 minutes at 121°C is exposed to 130°C for 2 minutes, what is the
          equivalent exposure time at 121°C?
        </p>
        <Equation equation={`$$F_0 = \\Delta t\\sum 10^{\\frac{T-T_r}{Z}}$$`} />
        <Equation equation={`$$F_0 = 2 min \\times 10^{\\frac{130-121}{10}}$$`} />
        <Equation equation={`$$F_0 = 15.8 min$$`} />
        <p>
          Therefore, the sterilziation of this organism at 130°C for 2 minutes is equivalent to 15.8 minutes at 121°C.
        </p>
      </>
    </CalcCard>
  )
}
