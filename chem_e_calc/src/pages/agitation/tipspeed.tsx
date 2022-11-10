import { NextPage } from 'next'
import React, { useContext, useReducer } from 'react'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { DefaultUnitContext, DefaultUnitContextType } from '../../contexts/defaultUnitContext'
import { convertUnits } from '../../utils/units'
import { ShortInputType } from '../../types'
import { InputFieldConstant, InputFieldWithUnit } from '../../components/inputs/inputFieldObj'
import { updateCalculatedValue } from '../../logic/logic'
import { Equation, VariableDefinition } from '../../components/Equation'

const TipSpeedPage: NextPage = () => {
  const paths = [
    { title: 'Agitation', href: '/agitation' },
    { title: 'Tip Speed', href: '/agitation/tipspeed' },
  ]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  type State = {
    diameter: ShortInputType
    shaftSpeed: ShortInputType
    tipSpeed: ShortInputType
  }

  const initialState: State = {
    diameter: {
      name: 'diameter',
      label: 'Diameter',
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
      focusText: 'Enter impeller outer diameter',
      error: '',
    },
    shaftSpeed: {
      name: 'shaftSpeed',
      label: 'Shaft Speed',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '250', unit: 'rpm' },
      calculatedValue: { value: 250, unit: 'rpm' },
      selectiontext: '',
      focusText: 'Enter impeller shaft speed',
      error: '',
    },
    tipSpeed: {
      name: 'tipSpeed',
      label: 'Tip Speed',
      placeholder: '0',
      unitType: 'speed',
      displayValue: { value: '1', unit: defaultUnits.speed },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'm/s',
          }),
          unit: 'm/s',
        }
      },
      selectiontext: '',
      focusText: 'Enter impeller tip speed',
      error: '',
    },
  }

  enum ActionKind {
    CHANGE_VALUE_WITH_UNIT = 'CHANGE_VALUE_WITH_UNIT',
    CHANGE_VALUE_WITHOUT_UNIT = 'CHANGE_VALUE_WITHOUT_UNIT',
    CHANGE_UNIT = 'CHANGE_UNIT',
    REFRESH = 'REFRESH',
  }

  type Action =
    | {
        type: ActionKind.CHANGE_VALUE_WITH_UNIT | ActionKind.CHANGE_VALUE_WITHOUT_UNIT | ActionKind.CHANGE_UNIT
        payload: { name: string; value: string }
      }
    | {
        type: ActionKind.REFRESH
      }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.REFRESH:
        return { ...state }
      case ActionKind.CHANGE_VALUE_WITH_UNIT:
        let name = action.payload.name
        let numericValue = action.payload.value.replace(/[^\d.-]/g, '')
        let unit = state[name as keyof State].displayValue.unit
        let payload = { ...state[name as keyof State], displayValue: { value: numericValue, unit } }
        let payloadWithCalculatedValue = updateCalculatedValue(payload)
        return calculateAnswer({ ...state, [name]: payloadWithCalculatedValue })

      case ActionKind.CHANGE_VALUE_WITHOUT_UNIT:
        name = action.payload.name
        numericValue = action.payload.value.replace(/[^\d.-]/g, '')
        unit = state[name as keyof State].displayValue.unit
        payload = {
          ...state[name as keyof State],
          displayValue: { value: numericValue, unit },
          calculatedValue: { value: Number(numericValue), unit },
        }
        return calculateAnswer({ ...state, [name]: payload })

      case ActionKind.CHANGE_UNIT:
        name = action.payload.name
        const existingValue = state[name as keyof State].displayValue.value
        payload = {
          ...state[name as keyof State],
          displayValue: { value: existingValue, unit: action.payload.value },
        }
        payloadWithCalculatedValue = updateCalculatedValue(payload)
        return calculateAnswer({ ...state, [name]: payloadWithCalculatedValue })
      default:
        alert('Error: State reducer action not recognized')
        return state
    }
  }

  const calculateAnswer = (state: State) => {
    const { diameter, shaftSpeed, tipSpeed } = state
    const answer = (diameter.calculatedValue.value * shaftSpeed.calculatedValue.value * Math.PI) / 60 // m/s
    const convertedAnswer = convertUnits({
      value: answer,
      fromUnit: 'm/s',
      toUnit: tipSpeed.displayValue.unit,
    })
    const answerObj = {
      ...tipSpeed,
      displayValue: { value: convertedAnswer.toLocaleString(), unit: tipSpeed.displayValue.unit }, //user specified unit
      calculatedValue: { value: answer, unit: 'm/s' }, //m/s
    }
    return { ...state, tipSpeed: answerObj }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionKind.CHANGE_VALUE_WITH_UNIT,
      payload: { name: e.target.name, value: e.target.value },
    })
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionKind.CHANGE_UNIT,
      payload: { name: e.target.name, value: e.target.value },
    })
  }

  const handleChangeValueUnitless = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionKind.CHANGE_VALUE_WITHOUT_UNIT,
      payload: { name: e.target.name, value: e.target.value },
    })
  }

  const { diameter, shaftSpeed, tipSpeed } = state

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader title={'Tip Speed'} text={'Calculate speed of an impeller tip'} />
      <CalcBody>
        <CalcCard title={'Calculator'}>
          <>
            <div className="mb-0 flex flex-col">
              <InputFieldWithUnit
                key={diameter.name}
                name={diameter.name}
                label={diameter.label}
                placeholder={diameter.placeholder}
                selected={false}
                displayValue={diameter.displayValue}
                error={diameter.error}
                unitType={diameter.unitType}
                focusText={diameter.focusText}
                onChangeValue={handleChangeValue}
                onChangeUnit={handleChangeUnit}
              />
              <InputFieldConstant
                key={shaftSpeed.name}
                name={shaftSpeed.name}
                label={shaftSpeed.label}
                placeholder={shaftSpeed.placeholder}
                selected={false}
                displayValue={shaftSpeed.displayValue}
                error={shaftSpeed.error}
                unitType={shaftSpeed.unitType}
                focusText={shaftSpeed.focusText}
                onChangeValue={handleChangeValueUnitless}
              />
              <InputFieldWithUnit
                key={tipSpeed.name}
                name={tipSpeed.name}
                label={tipSpeed.label}
                placeholder={tipSpeed.placeholder}
                selected={true}
                displayValue={tipSpeed.displayValue}
                error={tipSpeed.error}
                unitType={tipSpeed.unitType}
                focusText={tipSpeed.focusText}
                onChangeValue={handleChangeValue}
                onChangeUnit={handleChangeUnit}
              />
            </div>
          </>
        </CalcCard>
        <EquationCard />
      </CalcBody>
    </PageContainer>
  )
}

const EquationCard = () => {
  return (
    <CalcCard title="Governing Equation">
      <>
        <p>
          This calculator finds how fast the tip of an agitator impeller is moving given a specific shaft speed and
          impeller diameter.
        </p>

        <br />
        <p>Tip Speed</p>
        <Equation equation={`$$v_{t} = \\pi d_{im} N$$`} />

        <p className="text-lg font-medium">Definitions</p>
        <VariableDefinition equation={`$$v_{t} = $$`} definition="Tip speed" />
        <VariableDefinition equation={`$$d_{im} = $$`} definition="Impeller diameter" />
        <VariableDefinition equation={`$$N = $$`} definition="Shaft speed" />
      </>
    </CalcCard>
  )
}

export default TipSpeedPage
