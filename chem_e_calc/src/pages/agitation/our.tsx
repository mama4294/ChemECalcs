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
  O2_in: ShortInputType
  O2_out: ShortInputType
  CO2_in: ShortInputType
  CO2_out: ShortInputType
}

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
      unitType: 'airFlow',
      displayValue: { value: '1', unit: 'nlpm' },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'nlph',
          }),
          unit: 'nlph',
        }
      },
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
            toUnit: 'l',
          }),
          unit: 'l',
        }
      },
      selectiontext: '',
      focusText: 'Enter the liquid volume',
      error: '',
    },
    O2_in: {
      name: 'O2_in',
      label: 'Oxygen Concentration In',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '20.946', unit: '%' },
      calculatedValue: { value: 20.946, unit: '%' },
      selectiontext: '',
      focusText: 'Typically 20.946% unless enriching with pure O2',
      error: '',
    },
    O2_out: {
      name: 'O2_out',
      label: 'Oxygen Concentration Out',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '18', unit: '%' },
      calculatedValue: { value: 18, unit: '%' },
      selectiontext: '',
      focusText: 'Enter the exit gas analyzers oxygen concentration',
      error: '',
    },
    CO2_in: {
      name: 'CO2_in',
      label: 'Carbon Dioxide Concentration In',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '0.0412', unit: '%' },
      calculatedValue: { value: 0.0412, unit: '%' },
      selectiontext: '',
      focusText: 'Typically 0.0412%',
      error: '',
    },
    CO2_out: {
      name: 'CO2_out',
      label: 'Carbon Dioxide Concentration Out',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '2', unit: '%' },
      calculatedValue: { value: 2, unit: '%' },
      selectiontext: '',
      focusText: 'Enter the exit gas analyzers CO2 concentration',
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

  const { flowrate, volume, O2_in, O2_out, CO2_in, CO2_out } = state

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
                <div className="divider">Gas In</div>
                <InputFieldConstant
                  key={O2_in.name}
                  name={O2_in.name}
                  label={O2_in.label}
                  placeholder={O2_in.placeholder}
                  selected={false}
                  displayValue={O2_in.displayValue}
                  error={O2_in.error}
                  unitType={O2_in.unitType}
                  focusText={O2_in.focusText}
                  onChangeValue={handleChangeValueUnitless}
                />
                <InputFieldConstant
                  key={CO2_in.name}
                  name={CO2_in.name}
                  label={CO2_in.label}
                  placeholder={CO2_in.placeholder}
                  selected={false}
                  displayValue={CO2_in.displayValue}
                  error={CO2_in.error}
                  unitType={CO2_in.unitType}
                  focusText={CO2_in.focusText}
                  onChangeValue={handleChangeValueUnitless}
                />
                <div className="divider">Exit Gas Analyzer</div>
                <InputFieldConstant
                  key={O2_out.name}
                  name={O2_out.name}
                  label={O2_out.label}
                  placeholder={O2_out.placeholder}
                  selected={false}
                  displayValue={O2_out.displayValue}
                  error={O2_out.error}
                  unitType={O2_out.unitType}
                  focusText={O2_out.focusText}
                  onChangeValue={handleChangeValueUnitless}
                />
                <InputFieldConstant
                  key={CO2_out.name}
                  name={CO2_out.name}
                  label={CO2_out.label}
                  placeholder={CO2_out.placeholder}
                  selected={false}
                  displayValue={CO2_out.displayValue}
                  error={CO2_out.error}
                  unitType={CO2_out.unitType}
                  focusText={CO2_out.focusText}
                  onChangeValue={handleChangeValueUnitless}
                />
              </div>
            </>
          </CalcCard>
          <AnswerCard state={state} />
          <ExampleCard />
        </CalcBody>
      </PageContainer>
    </>
  )
}

const AnswerCard = ({ state }: { state: State }) => {
  const {
    flowrate: Objflow_in,
    volume: ObjVolume,
    O2_in: objO2_in,
    O2_out: objO2_out,
    CO2_in: objCO2_in,
    CO2_out: objCO2_out,
  } = state

  const O2_in = objO2_in.calculatedValue.value / 100 // % vol/vol
  const O2_out = objO2_out.calculatedValue.value / 100 // % vol/vol
  const CO2_in = objCO2_in.calculatedValue.value / 100 // % vol/vol
  const CO2_out = objCO2_out.calculatedValue.value / 100 // % vol/vol
  const flow_in = Objflow_in.calculatedValue.value //nlph
  const volume = ObjVolume.calculatedValue.value //L

  console.log(Objflow_in.calculatedValue, Objflow_in.displayValue)

  const flowToMoles = ({ flow, temp, pressure }: { flow: number; temp: number; pressure: number }): number => {
    //converts flow (liters), temperature (C), and pressure (atm) into mmoles using the ideal gas law
    const R = 8.20573660809596 * 10 ** -5 //units of L⋅atm⋅K-1⋅mmol-1
    return (flow * pressure) / (R * (temp + 273.15))
  }

  const flow_out = (flow_in * (1 - O2_in - CO2_in)) / (1 - O2_out - CO2_out) //Nitrogen balance assuming no nitrogen accumulation in the bioreactor
  const flow_O2_in = flow_in * O2_in
  const flow_O2_out = flow_out * O2_out
  const O2_moles_in = flowToMoles({ flow: flow_O2_in, temp: 0, pressure: 1 }) //mmoles/hr
  const O2_moles_out = flowToMoles({ flow: flow_O2_out, temp: 0, pressure: 1 }) //mmoles/hr
  const OUR = (O2_moles_in - O2_moles_out) / volume

  // console.table({ flow_in, flow_out, O2_in, O2_out, CO2_in, CO2_out, O2_moles_in, O2_moles_out })

  return (
    <CalcCard title="Answer">
      <>
        <p>
          This calculator finds the steady state oxygen ouptake rate of a fermenting organism through an oxygen mass
          balance
        </p>

        <br />
        <InputFieldConstant
          name="Oxygen In"
          label="Oxygen In"
          placeholder="0"
          selected={true}
          displayValue={{ value: O2_moles_in.toLocaleString(), unit: 'mmoles/hr' }}
          error=""
          unitType=""
          focusText=""
          onChangeValue={() => console.log()}
        />
        <InputFieldConstant
          name="Oxygen Out"
          label="Oxygen Out"
          placeholder="0"
          selected={true}
          displayValue={{ value: O2_moles_out.toLocaleString(), unit: 'mmoles/hr' }}
          error=""
          unitType=""
          focusText=""
          onChangeValue={() => console.log()}
        />
        <InputFieldConstant
          name="OUR"
          label="Oxygen Uptake Rate"
          placeholder="0"
          selected={true}
          displayValue={{ value: OUR.toLocaleString(), unit: 'mmoles/L/hr' }}
          error=""
          unitType=""
          focusText=""
          onChangeValue={() => console.log()}
        />
      </>
    </CalcCard>
  )
}

const ExampleCard = () => {
  return (
    <CalcCard title="Example">
      <>
        <p className="mb-6">
          Use a global mass balance to determine the oxygen update rate of the organism in a bioreactor with an air
          flowrate of 60 nlph entering into a 1L working volume bioreactor with an exit gas analzyer displaying the
          following readings: O2: 18%, CO2: 2%.
        </p>

        <p>
          <span className="font-bold">Step 1:</span> Calculate gas flow out of the vessel using a nitrogen balance
        </p>
        <p className="text-sm italic">
          Assume all nitrogen which enters the vessel exits through the vent. No accumulation in the fermenter.
        </p>
        <div className="mb-6">
          <Equation equation={`$$\\dot{V}_{in} ⋅ C_{in N_{2}} = \\dot{V}_{out} ⋅ C_{out N_{2}}$$`} />
          <Equation equation={`$$ C_{N_{2}} = 1 - C_{O_{2}} - C_{CO_{2}}$$`} />
          <Equation
            equation={`$$\\dot{V}_{out} = \\frac{\\dot{V}_{in} ⋅ C_{in N_{2}}}{1 - C_{out O_{2}} - C_{out CO_{2}}}$$`}
          />
          <Equation equation={`$$\\dot{V}_{out} = \\frac{60 nlpm ⋅ 78\\%}{1 - 18\\% - 2\\%}$$`} />
          <Equation equation={`$$\\dot{V}_{out} = 58.5 nlpm$$`} />
        </div>

        <p>
          <span className="font-bold">Step 2:</span> Calculate the oxygen flow in and out of the bioreactor
        </p>
        <div className="mb-6">
          <Equation equation={`$$\\dot{V}_{O_{2}} = \\dot{V}*C_{O_{2}}$$`} />
          <Equation equation={`$$\\dot{V}_{in O_{2}} = 60 nlpm * 21\\% = 12.6 nlpm$$`} />
          <Equation equation={`$$\\dot{V}_{out O_{2}} = 58.5 nlpm * 18\\% = 10.53 nlpm$$`} />
        </div>
        <p>
          <span className="font-bold">Step 3:</span> Calculate molar oxygen flow into the bioreactor using the ideal gas
          law
        </p>
        <p className="text-sm italic">
          Normal flow is assumed to be 1 atm and 0°C. Standard flow is assumed to be 14.696 psia and 60°F.
        </p>
        <div className="mb-6">
          <Equation equation={`$$P\\dot{V} = \\dot{n}RT$$`} />
          <Equation equation={`$$\\dot{n} = \\frac{P\\dot{V}}{RT}$$`} />
          <Equation
            equation={`$$\\dot{n}_{in O_{2}} = \\frac{1 atm ⋅ 12.6 nlph}{8.2*10^{-5} \\frac{L⋅atm}{K⋅mmol} ⋅ 273.15K} = 562 mmol/hr$$`}
          />
          <Equation
            equation={`$$\\dot{n}_{out O_{2}} = \\frac{1 atm ⋅ 10.53 nlph}{8.2*10^{-5} \\frac{L⋅atm}{K⋅mmol} ⋅ 273.15K} = 476 mmol/hr$$`}
          />
        </div>

        <p>
          <span className="font-bold">Step 4:</span>Calculate oxygen update rate
        </p>
        <div className="mb-6">
          <Equation equation={`$$OUR = \\frac{\\dot{n}_{in O_{2}} - \\dot{n}_{out O_{2}}}{V_l}$$`} />
          <Equation equation={`$$OUR = \\frac{562 - 476 mmol/hr}{1 L}$$`} />
          <Equation equation={`$$OUR = 86.3 mmol/L/hr$$`} />
        </div>

        <p className="mb-2 text-lg font-medium">Definitions</p>
        <VariableDefinition equation={`$$\\dot{V} = $$`} definition="Volumetric air flowrate" />
        <VariableDefinition equation={`$$C = $$`} definition="Volumetric concentration" />
        <VariableDefinition equation={`$$P = $$`} definition="Pressure at standard conditions" />
        <VariableDefinition equation={`$$T = $$`} definition="Temperature at standard conditions" />
        <VariableDefinition equation={`$$R = $$`} definition="Ideal gas constant" />
        <VariableDefinition equation={`$$\\dot{n} = $$`} definition="Molar air flowrate" />
        <VariableDefinition equation={`$$OUR = $$`} definition="Oxygen uptake rate" />
      </>
    </CalcCard>
  )
}

export default OURPage
