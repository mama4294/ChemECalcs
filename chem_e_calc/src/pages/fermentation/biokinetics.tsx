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
  umax: ShortInputType
  volume: ShortInputType
  OD: ShortInputType
}

const OURPage: NextPage = () => {
  const paths = [
    { title: 'Fermentation', href: '/fermentation' },
    { title: 'Biokinetics', href: '/fermentation/biokinetics' },
  ]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  const initialState: State = {
    umax: {
      name: 'umax',
      label: 'umax',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '0.2', unit: '1/hr' },
      calculatedValue: { value: 0.2, unit: '1/hr' },
      selectiontext: '',
      focusText: 'The max growth rate of the organism',
      error: '',
    },
    volume: {
      name: 'volume',
      label: 'Fermentation Volume',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '1', unit: defaultUnits.volume },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'l',
          }),
          unit: 'l',
        }
      },
      selectiontext: '',
      focusText: 'Enter the liquid volume',
      error: '',
    },
    OD: {
      name: 'OD',
      label: 'Initial Optical Density',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '0.2', unit: 'OD600' },
      calculatedValue: { value: 0.2, unit: 'OD600' },
      selectiontext: '',
      focusText: 'Optical Density at OD600 at the start of fermentation',
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

      case ActionKind.CHANGE_UNIT:
        name = action.payload.name
        const existingValue = state[name as keyof State].displayValue.value
        payload = {
          ...state[name as keyof State],
          displayValue: { value: existingValue, unit: action.payload.value },
        }
        payloadWithCalculatedValue = updateCalculatedValue(payload)
        return { ...state, [name]: payloadWithCalculatedValue }
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

  const { umax, volume, OD } = state

  return (
    <>
      <Metadata
        title="Biokinetics Calculation"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Agitation, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Biokinetics'} text={'Model fermentation growth rate and substrate consumption'} />
        <CalcBody>
          <CalcCard title={'Calculator'}>
            <>
              <div className="mb-0 flex flex-col">
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
                  key={umax.name}
                  name={umax.name}
                  label={umax.label}
                  placeholder={umax.placeholder}
                  selected={false}
                  displayValue={umax.displayValue}
                  error={umax.error}
                  unitType={umax.unitType}
                  focusText={umax.focusText}
                  onChangeValue={handleChangeValueUnitless}
                />
                <InputFieldConstant
                  key={OD.name}
                  name={OD.name}
                  label={OD.label}
                  placeholder={OD.placeholder}
                  selected={false}
                  displayValue={OD.displayValue}
                  error={OD.error}
                  unitType={OD.unitType}
                  focusText={OD.focusText}
                  onChangeValue={handleChangeValueUnitless}
                />
              </div>
            </>
          </CalcCard>
          <AnswerCard state={state} />
        </CalcBody>
      </PageContainer>
    </>
  )
}

const AnswerCard = ({ state }: { state: State }) => {
  const { umax: Objflow_in, volume: ObjVolume, OD: objO2_in } = state

  const flowToMoles = ({ flow, temp, pressure }: { flow: number; temp: number; pressure: number }): number => {
    //converts flow (liters), temperature (C), and pressure (atm) into mmoles using the ideal gas law
    const R = 8.20573660809596 * 10 ** -5 //units of L⋅atm⋅K-1⋅mmol-1
    return (flow * pressure) / (R * (temp + 273.15))
  }

  // const O2_in = objO2_in.calculatedValue.value / 100 // % vol/vol
  // const O2_out = objO2_out.calculatedValue.value / 100 // % vol/vol
  // const CO2_in = objCO2_in.calculatedValue.value / 100 // % vol/vol
  // const CO2_out = objCO2_out.calculatedValue.value / 100 // % vol/vol
  // const flow_in = Objflow_in.calculatedValue.value //nlph
  const volume = ObjVolume.calculatedValue.value //L
  // const flow_out = (flow_in * (1 - O2_in - CO2_in)) / (1 - O2_out - CO2_out) //Nitrogen balance assuming no nitrogen accumulation in the bioreactor
  // const moles_in = flowToMoles({ flow: flow_in, temp: 0, pressure: 1 }) //mmoles/hr
  // const moles_out = flowToMoles({ flow: flow_out, temp: 0, pressure: 1 }) //mmoles/hr
  // const OUR = (moles_in * O2_in - moles_out * O2_out) / volume
  // const CER = (moles_out / volume) * (CO2_out - CO2_in)
  // const RQ = CER / OUR

  return (
    <CalcCard title="Answer">
      <>
        <InputFieldConstant
          name="flow in"
          label="Flow In"
          placeholder="0"
          selected={true}
          displayValue={{ value: volume.toLocaleString(), unit: 'mmoles/hr' }}
          error=""
          unitType=""
          focusText=""
          onChangeValue={() => console.log()}
        />
      </>
    </CalcCard>
  )
}

export default OURPage

//Calculations:

enum Phase {
  growup,
  feed,
}

const calculate = (state: State) => {
  const V0 = state.volume.calculatedValue.value //l
  const OD0 = state.OD.calculatedValue.value //OD600
  const umax = state.umax.calculatedValue.value //1/hr

  // Biokinetic Parameters
  const usp = umax * 0.2 //Scaling factor
  const ms = 0.0031 // g substrate/g dry cells/hr, Cell maintenance consumption rate
  const Ks = 0.1823 // g substrate/L, Monod constant
  const YDCW_OD = 0.41 // g dry cells/OD, Conversion between OD and dry cell weight
  const Yxs_max = 0.49 // g dry cells/g substrate, Max biomass/substrate yield
  const Yxs_abs = Yxs_max * (umax / (umax - Yxs_max * ms)) // Asymptotic biomass/substrate yield
  const tspan = 300

  // Define Initial Conditions ---------------------------------------------------------------------------------
  const X0 = OD0 * YDCW_OD // g dry cells/L
  const S0 = 20 // g glucose/L
  const Sf = 500 // Feed concentration, g glucose/L

  // Define and Solve System of Differential Equations ---------------------------------------------------------

  const mu = (S: number) => {
    //Specific Growth Rate
    return (umax * S) / (S + Ks)
  }
  const rX = (X: number, S: number) => {
    //Rate of Cell Growth
    return mu(S) * X
  }
  const F = (t: number, phase: Phase) => {
    // Volumetric Feed Flowrate
    if (phase == Phase.feed) return 0
    if (phase == Phase.growup) {
      //const F0 = (usp/Yxs_abs + ms)*(max(X1)*V0/Sf)
      // return F0*usp**t
      return 0
    }
    return 0
  }

  type timepoint = [number, number, number]

  const Batch = (y: timepoint, t: number): timepoint => {
    const [X, S, V] = y
    const dXdt = rX(X, S) - (X * F(t, Phase.feed)) / V
    const dSdt = (F(t, Phase.feed) * (Sf - S)) / V - rX(X, S) / Yxs_abs
    const dVdt = F(t, 0)
    return [dXdt, dSdt, dVdt]
  }
}
