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
import { Equation, VariableDefinition } from '../../components/Layout/Equation'
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
    { title: 'Fermentation', href: '/fermentation' },
    { title: 'Respiration', href: '/agitation/respiration' },
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
        title="Fermentation Respiration Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Agitation, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Fermentation Respiration'} text={'Calculate OUR, CER, and RQ'} />
        <CalcBody>
          <CalcCard title={'Calculator'}>
            <>
              <p>
                The global mass balance calculation requires a air flowmeter and an exit gas analyzer. The measurement
                can be performined online and continuously trended over the course of fermentation.
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

  const flowToMoles = ({ flow, temp, pressure }: { flow: number; temp: number; pressure: number }): number => {
    //converts flow (liters), temperature (C), and pressure (atm) into mmoles using the ideal gas law
    const R = 8.20573660809596 * 10 ** -5 //units of L⋅atm⋅K-1⋅mmol-1
    return (flow * pressure) / (R * (temp + 273.15))
  }

  const O2_in = objO2_in.calculatedValue.value / 100 // % vol/vol
  const O2_out = objO2_out.calculatedValue.value / 100 // % vol/vol
  const CO2_in = objCO2_in.calculatedValue.value / 100 // % vol/vol
  const CO2_out = objCO2_out.calculatedValue.value / 100 // % vol/vol
  const flow_in = Objflow_in.calculatedValue.value //nlph
  const volume = ObjVolume.calculatedValue.value //L
  const flow_out = (flow_in * (1 - O2_in - CO2_in)) / (1 - O2_out - CO2_out) //Nitrogen balance assuming no nitrogen accumulation in the bioreactor
  const moles_in = flowToMoles({ flow: flow_in, temp: 0, pressure: 1 }) //mmoles/hr
  const moles_out = flowToMoles({ flow: flow_out, temp: 0, pressure: 1 }) //mmoles/hr
  const OUR = (moles_in * O2_in - moles_out * O2_out) / volume
  const CER = (moles_out / volume) * (CO2_out - CO2_in)
  const RQ = CER / OUR

  return (
    <CalcCard title="Answer">
      <>
        <p>
          This calculator find the oxygen uptake rate (OUR), carbion dioxide evolution rate (CER), and the repiratory
          quotent (RQ).
        </p>

        <br />
        <InputFieldConstant
          name="flow in"
          label="Flow In"
          placeholder="0"
          selected={true}
          displayValue={{ value: moles_in.toLocaleString(), unit: 'mmoles/hr' }}
          error=""
          unitType=""
          focusText=""
          onChangeValue={() => console.log()}
        />
        <InputFieldConstant
          name="flow Out"
          label="Flow Out"
          placeholder="0"
          selected={true}
          displayValue={{ value: moles_out.toLocaleString(), unit: 'mmoles/hr' }}
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
          topRight={<OURHint />}
        />
        <InputFieldConstant
          name="CER"
          label="Carbon Dioxide Evolution Rate"
          placeholder="0"
          selected={true}
          displayValue={{ value: CER.toLocaleString(), unit: 'mmoles/L/hr' }}
          error=""
          unitType=""
          focusText=""
          onChangeValue={() => console.log()}
          topRight={<CERHint />}
        />
        <InputFieldConstant
          name="RQ"
          label="Respiratory Quotent"
          placeholder="0"
          selected={true}
          displayValue={{ value: RQ.toLocaleString(), unit: 'mmoles/L/hr' }}
          error=""
          unitType=""
          focusText=""
          onChangeValue={() => console.log()}
          topRight={<RQHint />}
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
          Use a global mass balance to determine the respiration parameters (OUR, CER, RQ) of the organism in a
          bioreactor with an air flowrate of 60 nlph entering into a 1L working volume bioreactor with an exit gas
          analzyer displaying the following readings: O2: 18%, CO2: 2%.
        </p>

        <p>
          <span className="font-bold">Step 1:</span> Calculate the molar air flowrate into the vessel
        </p>
        <p className="text-sm italic">
          Use the ideal gas law. Normal flow is assumed to be 1 atm and 0°C. Standard flow is assumed to be 14.696 psia
          and 60°F.
        </p>
        <div className="mb-6">
          <Equation equation={`$$P\\dot{V} = \\dot{n}RT$$`} />
          <Equation equation={`$$\\dot{n} = \\frac{P\\dot{V}}{RT}$$`} />
          <Equation
            equation={`$$\\dot{n} = \\frac{1 atm ⋅ 60 nlph}{8.2*10^{-5} \\frac{L⋅atm}{K⋅mmol} ⋅ 273.15K} = 2,677 mmol/hr$$`}
          />
        </div>

        <p>
          <span className="font-bold">Step 2:</span> Calculate oxygen uptake rate
        </p>
        <p className="text-sm italic">
          Assume all nitrogen which enters the vessel exits through the vent. Use a nitrogen balance to determine the
          exit gas rate.
        </p>
        <div className="mb-6">
          <Equation equation={`$$OUR = \\frac{\\dot{n} ⋅ C_{in CO_{2}} - \\dot{n}_{out} ⋅ C_{out CO_{2}}}{V_l}$$`} />
          <Equation
            equation={`$$\\dot{n}_{out} = \\dot{n} ⋅ \\frac{1 - C_{in O_{2}}- C_{in CO_{2}}}{1 - C_{out O_{2}}- C_{out CO_{2}}}$$`}
          />
          <Equation
            equation={`$$OUR = \\frac{\\dot{n}}{V_l} (C_{in O_{2}} - \\frac{1 - C_{in O_{2}}- C_{in CO_{2}}}{1 - C_{out O_{2}}- C_{out CO_{2}}} ⋅ C_{out O_{2}})$$`}
          />
          <Equation
            equation={`$$OUR = \\frac{2,677 mmol/hr}{1 L} (21\\% - \\frac{1 - 0\\% - 21\\%}{1 - 18\\% - 2\\%} ⋅ 18\\% )$$`}
          />
          <Equation equation={`$$OUR = 84.8 mmol/L/hr$$`} />
        </div>
        <p>
          <span className="font-bold">Step 3:</span> Calculate carbon dioxide evolution rate
        </p>
        <div className="mb-6">
          <Equation equation={`$$CER = \\frac{\\dot{n}_{out}}{V_l} ⋅ (C_{out CO_{2}} - C_{in CO_{2}}) $$`} />
          <Equation
            equation={`$$\\dot{n}_{out} = \\dot{n} ⋅ \\frac{1 - C_{in O_{2}}- C_{in CO_{2}}}{1 - C_{out O_{2}}- C_{out CO_{2}}}$$`}
          />
          <Equation
            equation={`$$CER = \\frac{\\dot{n}}{V_l} ⋅ \\frac{1 - C_{in O_{2}}- C_{in CO_{2}}}{1 - C_{out O_{2}}- C_{out CO_{2}}} ⋅ (C_{out CO_{2}} - C_{in CO_{2}}) $$`}
          />
          <Equation
            equation={`$$CER = \\frac{2,677 mmol/hr}{1 L} ⋅ \\frac{1 - 0\\% - 21\\%}{1 - 18\\% - 2\\%} ⋅ (2\\% - 0\\%) $$`}
          />
          <Equation equation={`$$CER = 52.9 mmol/L/hr $$`} />
        </div>

        <p>
          <span className="font-bold">Step 4:</span> Calculate respiratory quotent
        </p>
        <div className="mb-6">
          <Equation equation={`$$RQ = CER/OUR$$`} />
          <Equation equation={`$$RQ = \\frac{52.9 mmol/L/hr}{84.8 mmol/L/hr}$$`} />
          <Equation equation={`$$RQ = 0.62$$`} />
        </div>

        <p className="mb-2 text-lg font-medium">Definitions</p>
        <VariableDefinition equation={`$$\\dot{V} = $$`} definition="Volumetric air flowrate" />
        <VariableDefinition equation={`$$C = $$`} definition="Volumetric concentration" />
        <VariableDefinition equation={`$$P = $$`} definition="Pressure at standard conditions" />
        <VariableDefinition equation={`$$T = $$`} definition="Temperature at standard conditions" />
        <VariableDefinition equation={`$$R = $$`} definition="Ideal gas constant" />
        <VariableDefinition equation={`$$\\dot{n} = $$`} definition="Molar air flowrate in" />
        <VariableDefinition equation={`$$\\dot{n}_{out} = $$`} definition="Molar air flowrate out" />
        <VariableDefinition equation={`$$OUR = $$`} definition="Oxygen uptake rate" />
        <VariableDefinition equation={`$$CER = $$`} definition="Carbon dioxide evolution rate" />
        <VariableDefinition equation={`$$OUR = $$`} definition="respiratory quotient" />
      </>
    </CalcCard>
  )
}

const OURHint = () => (
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
          <h2 className="card-title">Oxygen Uptake Rate</h2>
          <p>
            The <span className="font-bold">OUR</span> is the measurment of the organism&apos;s oxygen consumption.
          </p>
          <Equation equation={`$$OUR = \\frac{\\dot{n} ⋅ C_{in CO_{2}} - \\dot{n}_{out} ⋅ C_{out CO_{2}}}{V_l}$$`} />
          <p>
            The max <span className="font-bold">OUR</span> is used for the scale-up and design of fermentation vessels.
            A higher <span className="font-bold">OUR</span> requires the fermenter to be designed with a higher target
            <span className="font-bold">OTR </span> with increased agitation and aeration. (Oxygen Transfer Rate)
          </p>
          <p>
            The max <span className="font-bold">OUR</span> shows how difficult the fermention will be in terms of oxygen
            transfer
          </p>
          <table className="table w-full">
            <tbody>
              {/* row 1 */}
              <tr>
                <td>Easy</td>
                <td>{`< 150 mmol/L/hr`}</td>
              </tr>
              {/* row 2 */}
              <tr>
                <td>Average</td>
                <td>{`150-300 mmol/L/hr`}</td>
              </tr>
              {/* row 3 */}
              <tr>
                <td>Difficult</td>
                <td>{`> 300 mmol/L/hr`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </span>
)

const CERHint = () => (
  <span className="label-text-alt">
    <div className="dropdown-end dropdown">
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
          <h2 className="card-title">CO2 Evolution Rate</h2>
          <p>
            The <span className="font-bold">CER</span> is the measurment of the organism&apos;s carbon dioxide
            production.
          </p>
          <Equation equation={`$$CER = \\frac{\\dot{n}_{out}}{V_l} ⋅ (C_{out CO_{2}} - C_{in CO_{2}}) $$`} />
          <p>
            Changes in <span className="font-bold">CER</span> can be used to identify different fermentation stages
            (lag, exponential, stationary, death) or to calculate the specific growth rate of the organism
            <span className="font-bold"> µ</span>.
          </p>
        </div>
      </div>
    </div>
  </span>
)

const RQHint = () => (
  <span className="label-text-alt">
    <div className="dropdown-end dropdown">
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
          <h2 className="card-title">Respiratory Quotient </h2>
          <p>
            The <span className="font-bold">RQ</span> is the ratio between carbon dioxide production and oxygen
            consumption.
          </p>
          <Equation equation={`$$RQ = CER/OUR$$`} />
          <p>
            In an optimal system, the <span className="font-bold">RQ</span> should not exceed{' '}
            <span className="font-bold">1.0</span>
          </p>
        </div>
      </div>
    </div>
  </span>
)

export default OURPage
