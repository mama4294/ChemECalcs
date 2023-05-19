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
import { InputFieldConstant, InputFieldWithUnit } from '../../components/inputs/inputField'
import { updateCalculatedValue } from '../../logic/logic'
import { Equation, VariableDefinition } from '../../components/Equation'
import { Metadata } from '../../components/Layout/Metadata'

const OURPage: NextPage = () => {
  const paths = [
    { title: 'Agitation', href: '/agitation' },
    { title: 'Oxygen Update Rate', href: '/agitation/our' },
  ]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType



  type State = {
    flowrate: ShortInputType
    volume: ShortInputType
    conc_in: ShortInputType
    conc_out: ShortInputType
  }



  const initialState: State = {
    flowrate: {
      name: 'flowrate',
      label: 'Flowrate',
      placeholder: '0',
      unitType: 'volumeFlowRate',
      displayValue: { value: '1', unit: defaultUnits.volumeFlowRate },
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
      selectiontext: '',
      focusText: 'Enter impeller outer diameter',
      error: '',
    },    
    volume: {
      name: 'flowrate',
      label: 'Flowrate',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '1', unit: defaultUnits.volume },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'm3',
          }),
          unit: 'm3',
        }
      },
      selectiontext: '',
      focusText: 'Enter impeller outer diameter',
      error: '',
    },
    conc_in: {
      name: 'conc_in',
      label: 'Concentration In',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '21', unit: "%" },
      calculatedValue: {value: 21, unit: "%"},
      selectiontext: '',
      focusText: 'Enter the oxygen contentration of the air going in',
      error: '',
    },
    conc_out: {
      name: 'conc_out',
      label: 'Concentration Out',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '0', unit: "%" },
      calculatedValue: {value: 0, unit: "%"},
      selectiontext: '',
      focusText: 'Enter oxygen measured coming out of the fermenter',
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
        return { ...state, [name]: payloadWithCalculatedValue }
        // return calculateAnswer({ ...state, [name]: payloadWithCalculatedValue })

      case ActionKind.CHANGE_VALUE_WITHOUT_UNIT:
        name = action.payload.name
        numericValue = action.payload.value.replace(/[^\d.-]/g, '')
        unit = state[name as keyof State].displayValue.unit
        payload = {
          ...state[name as keyof State],
          displayValue: { value: numericValue, unit },
          calculatedValue: { value: Number(numericValue), unit },
        }
        return { ...state, [name]: payload }
        // return calculateAnswer({ ...state, [name]: payload })

      case ActionKind.CHANGE_UNIT:
        name = action.payload.name
        const existingValue = state[name as keyof State].displayValue.value
        payload = {
          ...state[name as keyof State],
          displayValue: { value: existingValue, unit: action.payload.value },
        }
        payloadWithCalculatedValue = updateCalculatedValue(payload)
        return { ...state, [name]: payloadWithCalculatedValue }
        // return calculateAnswer({ ...state, [name]: payloadWithCalculatedValue })
      default:
        alert('Error: State reducer action not recognized')
        return state
    }
  }

  // const calculateAnswer = (state: State) => {
  //   const { diameter, shaftSpeed, tipSpeed } = state
  //   const answer = (diameter.calculatedValue.value * shaftSpeed.calculatedValue.value * Math.PI) / 60 // m/s
  //   const convertedAnswer = convertUnits({
  //     value: answer,
  //     fromUnit: 'm/s',
  //     toUnit: tipSpeed.displayValue.unit,
  //   })
  //   const answerObj = {
  //     ...tipSpeed,
  //     displayValue: { value: convertedAnswer.toLocaleString(), unit: tipSpeed.displayValue.unit }, //user specified unit
  //     calculatedValue: { value: answer, unit: 'm/s' }, //m/s
  //   }
  //   return { ...state, tipSpeed: answerObj }
  // }

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

  const { flowrate, volume, conc_in, conc_out } = state

  return (
    <>
      <Metadata
        title="Oxygen Uptake Rate Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Agitation, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Oxygen Uptake'} text={'Calculate the oxygen uptake rate of an organism during fermentation'} />
        <CalcBody>
          <CalcCard title={'Calculator'}>
            <>
              <div className="mb-0 flex flex-col">
                <InputFieldWithUnit
                  key={flowrate.name}
                  name={flowrate.name}
                  label={flowrate.label}
                  placeholder={flowrate.placeholder}
                  selected={false}
                  displayValue={flowrate.displayValue}
                  error={flowrate.error}
                  unitType={flowrate.unitType}
                  focusText={flowrate.focusText}
                  onChangeValue={handleChangeValue}
                  onChangeUnit={handleChangeUnit}
                />
                <InputFieldConstant
                  key={conc_in.name}
                  name={conc_in.name}
                  label={conc_in.label}
                  placeholder={conc_in.placeholder}
                  selected={false}
                  displayValue={conc_in.displayValue}
                  error={conc_in.error}
                  unitType={conc_in.unitType}
                  focusText={conc_in.focusText}
                  onChangeValue={handleChangeValueUnitless}
                />
                                <InputFieldConstant
                  key={conc_out.name}
                  name={conc_out.name}
                  label={conc_out.label}
                  placeholder={conc_out.placeholder}
                  selected={false}
                  displayValue={conc_out.displayValue}
                  error={conc_out.error}
                  unitType={conc_out.unitType}
                  focusText={conc_out.focusText}
                  onChangeValue={handleChangeValueUnitless}
                />
                <InputFieldWithUnit
                  key={volume.name}
                  name={volume.name}
                  label={volume.label}
                  placeholder={volume.placeholder}
                  selected={true}
                  displayValue={volume.displayValue}
                  error={volume.error}
                  unitType={volume.unitType}
                  focusText={volume.focusText}
                  onChangeValue={handleChangeValue}
                  onChangeUnit={handleChangeUnit}
                />
              </div>
            </>
          </CalcCard>
          <EquationCard />
        </CalcBody>
      </PageContainer>
    </>
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

export default OURPage
