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

type State = {
  flowrate: ShortInputType
  volume: ShortInputType
  conc_in: ShortInputType
  conc_out: ShortInputType
}

const airFlowrateOptions = ['nlpm', 'scfm', 'nVVM', 'sVVM']

const OURPage: NextPage = () => {
  const paths = [
    { title: 'Agitation', href: '/agitation' },
    { title: 'Oxygen Uptake Rate', href: '/agitation/our' },
  ]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  const initialState: State = {
    flowrate: {
      name: 'flowrate',
      label: 'Air Flowrate',
      placeholder: '0',
      unitType: 'volumeFlowRate',
      displayValue: { value: '1', unit: airFlowrateOptions[0]! },
      calculatedValue: { value: 21, unit: airFlowrateOptions[0]! },
      selectiontext: '',
      focusText: 'Enter the air flowrate into the bioreactor',
      error: '',
    },
    volume: {
      name: 'volume',
      label: 'Volume',
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
      focusText: 'Enter the liquid volume',
      error: '',
    },
    conc_in: {
      name: 'conc_in',
      label: 'Oxygen Concentration In',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '21', unit: '%' },
      calculatedValue: { value: 21, unit: '%' },
      selectiontext: '',
      focusText: 'Typically 21% unless enriching with pure O2',
      error: '',
    },
    conc_out: {
      name: 'conc_out',
      label: 'Oxygen Concentration Out',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '20', unit: '%' },
      calculatedValue: { value: 20, unit: '%' },
      selectiontext: '',
      focusText: 'Enter the exit gas analyzers oxygen concentration',
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
        <CalcHeader
          title={'Oxygen Uptake'}
          text={'Calculate the oxygen uptake rate of an organism using the global mass balance method'}
        />
        <CalcBody>
          <CalcCard title={'Calculator'}>
            <>
              <p>
                The global mass balance OUR calculation requires a air flowmeter and an exit gas analyzer. The
                measurement can be performined online without impacting fermentation.
              </p>
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
                <InputFieldWithUnit
                  key={volume.name}
                  name={volume.name}
                  label={volume.label}
                  placeholder={volume.placeholder}
                  selected={false}
                  displayValue={volume.displayValue}
                  error={volume.error}
                  unitType={volume.unitType}
                  focusText={volume.focusText}
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
              </div>
            </>
          </CalcCard>
          <AnswerCard state={state} />
          <EquationCard />
        </CalcBody>
      </PageContainer>
    </>
  )
}

const AnswerCard = ({ state }: { state: State }) => {
  return (
    <CalcCard title="Answer">
      <>
        <p>
          This calculator finds the steady state oxygen ouptake rate of a fermenting organism through an oxygen mass
          balance
        </p>

        <br />
        <Equation equation={`$$OUR = \\frac{o2in - o2out}{V}$$`} />

        <p className="text-lg font-medium">Definitions</p>
        <VariableDefinition equation={`$$OUR = $$`} definition="Oxygen update rate" />
        <VariableDefinition equation={`$$V = $$`} definition="Ungassed liquid volume" />
        <VariableDefinition equation={`$$N = $$`} definition="Shaft speed" />
      </>
    </CalcCard>
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
