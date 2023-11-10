import { NextPage } from 'next'
import React, { useContext, useReducer, useState } from 'react'
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
import { Metadata } from '../../components/Layout/Metadata'
import { Scatter } from 'react-chartjs-2'
import { Chart, LinearScale, Point } from 'chart.js/auto'
import { Equation, VariableDefinition } from '../../components/Layout/Equation'
import { calculate, createChart, createChartOptions, timepointsToArray } from '../../logic/biokinetics'
import { CSVLink } from 'react-csv'
Chart.register(LinearScale)

//TODO: Fix chart tooltip with userData
//TODO: Add local storage to user data

export type State = {
  isFeeding: boolean
  umax: ShortInputType
  volume: ShortInputType
  substrateConc: ShortInputType
  OD: ShortInputType
  feedVolume: ShortInputType
  feedConc: ShortInputType
  z: ShortInputType
  ms: ShortInputType
  ks: ShortInputType
  YDCW_OD: ShortInputType
  Yxs_max: ShortInputType
}

type ShortInputState = Omit<State, 'isFeeding'>

const OURPage: NextPage = () => {
  const paths = [
    { title: 'Fermentation', href: '/fermentation' },
    { title: 'Biokinetics', href: '/fermentation/biokinetics' },
  ]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  const initialState: State = {
    isFeeding: false,
    umax: {
      name: 'umax',
      label: 'Max Specific Growth Rate (umax)',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '0.25', unit: '1/hr' },
      calculatedValue: { value: 0.25, unit: '1/hr' },
      selectiontext: '',
      focusText: 'The emprically found max growth rate of the organism',
      error: '',
    },
    volume: {
      name: 'volume',
      label: 'Fermentation Volume',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '1000', unit: defaultUnits.volume },
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
      focusText: 'The initial fermenter liquid volume',
      error: '',
    },
    substrateConc: {
      name: 'substrateConc',
      label: 'Initial Substrate Concentration',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '20', unit: 'g/L' },
      calculatedValue: { value: 20, unit: 'g/L' },
      selectiontext: '',
      focusText: 'Initial substrate concentration in the media',
      error: '',
    },
    feedVolume: {
      name: 'feedVolume',
      label: 'Feed Volume',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '500', unit: defaultUnits.volume },
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
      focusText: 'Liquid volume of the feed to be added to the fermenter',
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
    feedConc: {
      name: 'feedConc',
      label: 'Feed Concentration',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '500', unit: 'g/L' },
      calculatedValue: { value: 500, unit: 'g/L' },
      selectiontext: '',
      focusText: 'Substrate concentration in the feed stream',
      error: '',
    },
    z: {
      name: 'z',
      label: 'Growth Rate Factor',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '25', unit: '%' },
      calculatedValue: { value: 25, unit: '%' },
      selectiontext: '',
      focusText: 'The specific growth rate as a percentage of umax',
      error: '',
    },
    ms: {
      name: 'ms',
      label: 'Cell Maintenance Consumption Rate',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '0.0031', unit: '1/hr' },
      calculatedValue: { value: 0.0031, unit: '1/hr' },
      selectiontext: '',
      focusText: 'The cell maintenance substrate consumption in units of g substrate/g dry cells/hr',
      error: '',
    },
    ks: {
      name: 'ks',
      label: 'Half-Velocity Constant',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '0.1823', unit: '1/hr' },
      calculatedValue: { value: 0.1823, unit: '1/hr' },
      selectiontext: '',
      focusText: 'An emperically found constant indicating the substrate concentration at 50% of umax',
      error: '',
    },
    YDCW_OD: {
      name: 'YDCW_OD',
      label: 'Cells per OD',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '0.41', unit: 'g/OD' },
      calculatedValue: { value: 0.41, unit: 'g/OD' },
      selectiontext: '',
      focusText: 'Conversion between OD and dry cell weight in units of grams dry cells per OD',
      error: '',
    },
    Yxs_max: {
      name: 'Yxs_max',
      label: 'Max Yield',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '0.49', unit: 'w/w' },
      calculatedValue: { value: 0.49, unit: 'w/w' },
      selectiontext: '',
      focusText: 'The max cells produced per substrate in units of mass per mass ',
      error: '',
    },
  }

  enum ActionKind {
    CHANGE_VALUE_WITH_UNIT = 'CHANGE_VALUE_WITH_UNIT',
    CHANGE_VALUE_WITHOUT_UNIT = 'CHANGE_VALUE_WITHOUT_UNIT',
    CHANGE_UNIT = 'CHANGE_UNIT',
    REFRESH = 'REFRESH',
    TOGGLE_FEEDING = 'TOGGLE_FEEDING',
  }

  type Action =
    | {
        type: ActionKind.CHANGE_VALUE_WITH_UNIT | ActionKind.CHANGE_VALUE_WITHOUT_UNIT | ActionKind.CHANGE_UNIT
        payload: { name: string; value: string }
      }
    | {
        type: ActionKind.REFRESH | ActionKind.TOGGLE_FEEDING
      }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.REFRESH:
        return { ...state }
      case ActionKind.TOGGLE_FEEDING:
        return { ...state, isFeeding: !state.isFeeding }
      case ActionKind.CHANGE_VALUE_WITH_UNIT:
        let name = action.payload.name
        let numericValue = action.payload.value.replace(/[^\d.-]/g, '')
        let unit = state[name as keyof ShortInputState].displayValue.unit
        let payload = { ...state[name as keyof ShortInputState], displayValue: { value: numericValue, unit } }
        let payloadWithCalculatedValue = updateCalculatedValue(payload)
        return validateState({ ...state, [name]: payloadWithCalculatedValue })

      case ActionKind.CHANGE_VALUE_WITHOUT_UNIT:
        name = action.payload.name
        numericValue = action.payload.value.replace(/[^\d.-]/g, '')
        unit = state[name as keyof ShortInputState].displayValue.unit
        payload = {
          ...state[name as keyof ShortInputState],
          displayValue: { value: numericValue, unit },
          calculatedValue: { value: Number(numericValue), unit },
        }
        return validateState({ ...state, [name]: payload })

      case ActionKind.CHANGE_UNIT:
        name = action.payload.name
        const existingValue = state[name as keyof ShortInputState].displayValue.value
        payload = {
          ...state[name as keyof ShortInputState],
          displayValue: { value: existingValue, unit: action.payload.value },
        }
        payloadWithCalculatedValue = updateCalculatedValue(payload)
        return validateState({ ...state, [name]: payloadWithCalculatedValue })
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

  const toggleFeeding = () => {
    dispatch({
      type: ActionKind.TOGGLE_FEEDING,
    })
  }

  const { umax, volume, OD, feedVolume, feedConc, substrateConc, isFeeding, z, ms, ks, YDCW_OD, Yxs_max } = state

  const [showAdvanced, setShowAdvanced] = useState(false)

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
          <CalcCard title={'Inputs'}>
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
                  key={substrateConc.name}
                  name={substrateConc.name}
                  label={substrateConc.label}
                  placeholder={substrateConc.placeholder}
                  selected={false}
                  displayValue={substrateConc.displayValue}
                  error={substrateConc.error}
                  unitType={substrateConc.unitType}
                  focusText={substrateConc.focusText}
                  onChangeValue={handleChangeValueUnitless}
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

                <label className="text-md label cursor-pointer pl-0">
                  <span className="label">Fed Batch</span>
                  <input type="checkbox" className="toggle" checked={isFeeding} onChange={toggleFeeding} />
                </label>
                {isFeeding && (
                  <InputFieldWithUnit
                    key={feedVolume.name}
                    name={feedVolume.name}
                    label={feedVolume.label}
                    placeholder={feedVolume.placeholder}
                    selected={false}
                    displayValue={feedVolume.displayValue}
                    error={feedVolume.error}
                    unitType={feedVolume.unitType}
                    focusText={feedVolume.focusText}
                    onChangeValue={handleChangeValue}
                    onChangeUnit={handleChangeUnit}
                  />
                )}
                {isFeeding && (
                  <InputFieldConstant
                    key={feedConc.name}
                    name={feedConc.name}
                    label={feedConc.label}
                    placeholder={feedConc.placeholder}
                    selected={false}
                    displayValue={feedConc.displayValue}
                    error={feedConc.error}
                    unitType={feedConc.unitType}
                    focusText={feedConc.focusText}
                    onChangeValue={handleChangeValueUnitless}
                  />
                )}

                <label className="text-md label cursor-pointer pl-0">
                  <span className="label">Advanced</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={showAdvanced}
                    onChange={() => setShowAdvanced(!showAdvanced)}
                  />
                </label>

                {showAdvanced && (
                  <InputFieldConstant
                    key={z.name}
                    name={z.name}
                    label={z.label}
                    placeholder={z.placeholder}
                    selected={false}
                    displayValue={z.displayValue}
                    error={z.error}
                    unitType={z.unitType}
                    focusText={z.focusText}
                    onChangeValue={handleChangeValueUnitless}
                  />
                )}
                {showAdvanced && (
                  <InputFieldConstant
                    key={ms.name}
                    name={ms.name}
                    label={ms.label}
                    placeholder={ms.placeholder}
                    selected={false}
                    displayValue={ms.displayValue}
                    error={ms.error}
                    unitType={ms.unitType}
                    focusText={ms.focusText}
                    onChangeValue={handleChangeValueUnitless}
                  />
                )}
                {showAdvanced && (
                  <InputFieldConstant
                    key={ks.name}
                    name={ks.name}
                    label={ks.label}
                    placeholder={ks.placeholder}
                    selected={false}
                    displayValue={ks.displayValue}
                    error={ks.error}
                    unitType={ks.unitType}
                    focusText={ks.focusText}
                    onChangeValue={handleChangeValueUnitless}
                  />
                )}
                {showAdvanced && (
                  <InputFieldConstant
                    key={YDCW_OD.name}
                    name={YDCW_OD.name}
                    label={YDCW_OD.label}
                    placeholder={YDCW_OD.placeholder}
                    selected={false}
                    displayValue={YDCW_OD.displayValue}
                    error={YDCW_OD.error}
                    unitType={YDCW_OD.unitType}
                    focusText={YDCW_OD.focusText}
                    onChangeValue={handleChangeValueUnitless}
                  />
                )}
                {showAdvanced && (
                  <InputFieldConstant
                    key={Yxs_max.name}
                    name={Yxs_max.name}
                    label={Yxs_max.label}
                    placeholder={Yxs_max.placeholder}
                    selected={false}
                    displayValue={Yxs_max.displayValue}
                    error={Yxs_max.error}
                    unitType={Yxs_max.unitType}
                    focusText={Yxs_max.focusText}
                    onChangeValue={handleChangeValueUnitless}
                  />
                )}
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
// const z = 25 //Scaling factor for specific growth rate setpoint
// const usp = (umax * z) / 100 //Scaled specific growth rate
// const ms = 0.0031 // g substrate/g dry cells/hr, Cell maintenance consumption rate
// const Ks = 0.1823 // g substrate/L, Monod constant
// const YDCW_OD = 0.41 // g dry cells/OD, Conversion between OD and dry cell weight
// const Yxs_max = 0.49 // g dry cells/g substrate, Max biomass/substrate yield
// const Yxs_abs = Yxs_max * (umax / (umax - Yxs_max * ms)) // Asymptotic biomass/substrate yield

const AnswerCard = ({ state }: { state: State }) => {
  const isFeeding = state.isFeeding
  const { data, details, error } = calculate(state)
  const initalUserData: Timepoint[] = [{ t: 0, x: 0, s: 0 }]
  const [userTimepoints, setTimepoints] = useState(initalUserData)
  const userData = timepointsToArray(userTimepoints)
  const chart = createChart(data, userData, isFeeding)
  const chartOptions = createChartOptions(details)
  const [units, setUnits] = useState({
    batchDuration: 'h',
    feedDuration: 'h',
    totalDuration: 'h',
  })

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnits({ ...units, [e.target.name]: e.target.value })
  }

  const batchDuration = convertUnits({
    value: details.batchDuration,
    fromUnit: 'h',
    toUnit: units.batchDuration,
  })

  const feedDuration = convertUnits({
    value: details.feedDuration,
    fromUnit: 'h',
    toUnit: units.feedDuration,
  })

  const totalDuration = convertUnits({
    value: details.totalDuration,
    fromUnit: 'h',
    toUnit: units.totalDuration,
  })

  const dataToArray = () => {
    if (!chart) return [{ error: 'No chart' }]
    if (!chart.datasets[0]) return [{ error: 'No dataset[0]' }]
    if (!chart.datasets[1]) return [{ error: 'No dataset[1]' }]

    const xData = chart.datasets[0].data as Point[] // Use optional chaining to handle possible null values
    const sData = chart.datasets[1].data as Point[] // Use optional chaining to handle possible null values
    const table = []

    if (xData && sData) {
      // Check if both xData and sData are not null
      for (let index = 0; index < xData.length; index++) {
        if (xData[index] != undefined && sData[index] != undefined) {
          table.push({ t: xData[index]!.x.toFixed(2), x: xData[index]!.y, s: sData[index]!.y })
        }
      }
    } else {
      console.log('xData or sData is null') // Handle the case where data is null
    }
    return table
  }

  const fedDataToArray = () => {
    if (!chart) return [{ error: 'No chart' }]
    if (!chart.datasets[0]) return [{ error: 'No dataset[0]' }]
    if (!chart.datasets[1]) return [{ error: 'No dataset[1]' }]
    if (!chart.datasets[2]) return [{ error: 'No dataset[2]' }]

    const xData = chart.datasets[0].data as Point[] // Use optional chaining to handle possible null values
    const sData = chart.datasets[1].data as Point[] // Use optional chaining to handle possible null values
    const vData = chart.datasets[2].data as Point[] // Use optional chaining to handle possible null values
    const table = []

    if (xData && sData && vData) {
      for (let index = 0; index < xData.length; index++) {
        if (xData[index] != undefined && sData[index] != undefined) {
          table.push({ t: xData[index]!.x.toFixed(2), x: xData[index]!.y, s: sData[index]!.y, v: vData[index]!.y })
        }
      }
    } else {
      console.log('xData, sData, or vdata is null') // Handle the case where data is null
    }
    return table
  }

  if (error) {
    return (
      <CalcCard title="Solution">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-info"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>

          <span>Error! {error}</span>
        </div>
      </CalcCard>
    )
  }

  const standardCSVHeaders = [
    { label: 'Time (hr)', key: 't' },
    { label: 'Cell Concentration (g/L)', key: 'x' },
    { label: 'Substrate Concentration (g/L)', key: 's' },
  ]

  const fedCSVHeaders = [
    { label: 'Time (hr)', key: 't' },
    { label: 'Cell Concentration (g/L)', key: 'x' },
    { label: 'Substrate Concentration (g/L)', key: 's' },
    { label: 'Volume', key: 'v' },
  ]

  return (
    <CalcCard title="Model">
      <>
        <Scatter options={chartOptions} data={chart} />
        <div className="mb-2 flex justify-end gap-2">
          <div className="tooltip" data-tip="Download">
            <CSVLink
              className="btn btn-outline btn-sm"
              data={isFeeding ? fedDataToArray() : dataToArray()}
              headers={isFeeding ? fedCSVHeaders : standardCSVHeaders}
              target="_blank"
            >
              {' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </CSVLink>
          </div>
          {/* Add data modal Button*/}
          <div className="tooltip" data-tip="Add data">
            <label htmlFor="add_data_modal" className="btn btn-outline btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </label>
          </div>
          {/* Add Data Moda; */}
          <input type="checkbox" id="add_data_modal" className="modal-toggle" />
          <div className="modal">
            <div className="max-h-5xl modal-box h-auto w-11/12 max-w-5xl">
              <label htmlFor="add_data_modal" className="btn btn-ghost btn-circle btn-sm absolute right-2 top-2">
                ✕
              </label>
              <div className="flex h-full items-center justify-center">
                <UserData userData={userTimepoints} setData={setTimepoints} initialData={initalUserData} />
              </div>
            </div>
          </div>

          {/* The button to open modal */}
          <div className="tooltip" data-tip="Expand">
            <label htmlFor="expand_modal" className="btn btn-outline btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </label>
          </div>

          {/* Put this part before </body> tag */}
          <input type="checkbox" id="expand_modal" className="modal-toggle" />
          <div className="modal">
            <div className="max-h-5xl modal-box h-auto w-11/12 max-w-5xl">
              <label htmlFor="expand_modal" className="btn btn-ghost btn-circle btn-sm absolute right-2 top-2">
                ✕
              </label>
              <div className="flex h-full items-center justify-center">
                <Scatter options={chartOptions} data={chart} />
              </div>
            </div>
          </div>
        </div>
        <InputFieldConstant
          name="finalConc"
          label="Final Cell Concentration"
          placeholder="0"
          selected={true}
          displayValue={{
            value: details.cellConc.toLocaleString('en-US', { maximumSignificantDigits: 3 }),
            unit: 'g/L',
          }}
          error=""
          unitType=""
          focusText=""
          onChangeValue={() => console.log()}
        />
        <InputFieldWithUnit
          name="batchDuration"
          label="Batch Duration"
          placeholder="0"
          selected={true}
          displayValue={{
            value: batchDuration.toLocaleString('en-US', { maximumSignificantDigits: 3 }),
            unit: units.batchDuration,
          }}
          error=""
          unitType="time"
          focusText=""
          onChangeValue={() => console.log()}
          onChangeUnit={handleChangeUnit}
        />
        {isFeeding && (
          <InputFieldWithUnit
            name="feedDuration"
            label="Feed Duration"
            placeholder="0"
            selected={true}
            displayValue={{
              value: feedDuration.toLocaleString('en-US', { maximumSignificantDigits: 3 }),
              unit: units.feedDuration,
            }}
            error=""
            unitType="time"
            focusText=""
            onChangeValue={() => console.log()}
            onChangeUnit={handleChangeUnit}
          />
        )}
        {isFeeding && (
          <InputFieldWithUnit
            name="totalDuration"
            label="Total Duration"
            placeholder="0"
            selected={true}
            displayValue={{
              value: totalDuration.toLocaleString('en-US', { maximumSignificantDigits: 3 }),
              unit: units.totalDuration,
            }}
            error=""
            unitType="time"
            focusText=""
            onChangeValue={() => console.log()}
            onChangeUnit={handleChangeUnit}
          />
        )}
      </>
    </CalcCard>
  )
}

export default OURPage

export type Timepoint = {
  t: number | null
  x: number | null
  s: number | null
}
const UserData = ({
  userData,
  setData,
  initialData,
}: {
  userData: Timepoint[]
  setData: React.Dispatch<React.SetStateAction<Timepoint[]>>
  initialData: Timepoint[]
}) => {
  const addRow = () => {
    setData([...userData, { t: 0, x: 0, s: 0 }])
  }
  const clearData = () => {
    setData(initialData)
  }

  const deleteRow = (index: number) => () => {
    const newData = userData.filter((_, idx) => idx !== index)
    setData(newData)
  }

  const onChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericValue = value.replace(/[^\d.-]/g, '')
    const newData = userData.map((timepoint, idx) => {
      if (idx === index) {
        return {
          ...timepoint,
          [name]: numericValue,
        }
      }
      return timepoint
    })
    setData(newData)
  }

  const stringToArray = (str: string) => {
    const rows = str.split('\n') // Split the string by new lines to get individual rows
    const trimmedRow = rows.map(row => row.replace('\r', '')) //remove '\r'
    const dataArray = trimmedRow.map(row => row.split('\t')) // Use '\t' for tab separation or ' ' for space separation
    return dataArray
  }

  const getField = (index: number) => {
    switch (index) {
      case 0:
        return 't'
      case 1:
        return 'x'
      case 2:
        return 's'
      default:
        return null
    }
  }

  const onPaste = (index: number, column: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('text')
    const dataArray = stringToArray(pastedData)
    const newData = userData

    setTimeout(() => {
      //The setTimeout function with a delay of 0 milliseconds allows the default paste action to occur before changing the input value, preventing the entire pasted string from replacing the input value.
      dataArray.map((row, rowIndex) => {
        row.map((input, columnIndex) => {
          const field = getField(columnIndex + column)
          if (field) {
            const value = +input
            const rowIdxInQuetion = rowIndex + index

            userData.map((timepoint, idx) => {
              if (idx === rowIdxInQuetion) {
                newData[idx] = { ...timepoint, [field]: value }
              }
              if (rowIdxInQuetion > userData.length - 1) {
                newData.push({ ...{ t: 0, x: 0, s: 0 }, [field]: value })
              }
            })
          }
        })
      })
      setData(newData)
    }, 0)
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-2 flex gap-2">
        <button className="btn btn-ghost btn-sm" onClick={addRow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Row</span>
        </button>
        <button className="btn btn-ghost btn-sm" onClick={clearData}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>

          <span>Clear</span>
        </button>
      </div>
      <table className=" mb-4 table">
        {/* head */}
        <thead>
          <tr>
            <th className=""></th>
            <th className="">Hour</th>
            <th className="">Cells</th>
            <th className="">Substrate</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((timepoint: Timepoint, index: number) => {
            return (
              <tr key={index} className="">
                <td className="border border-base-300 p-1 opacity-50">
                  <button className="btn btn-ghost btn-sm" onClick={deleteRow(index)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
                <td className="relative border border-base-300 p-1">
                  <input
                    type="text"
                    placeholder="Null"
                    name="t"
                    className="input input-sm w-full max-w-xs rounded-none"
                    value={timepoint.t || timepoint.t == 0 ? timepoint.t : ''}
                    onChange={onChange(index)}
                    onPaste={onPaste(index, 0)}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-0 m-2 hidden items-center whitespace-nowrap rounded-lg bg-base-200 px-2 text-xs opacity-75 sm:flex ">
                    h
                  </span>
                </td>
                <td className="relative border border-base-300 p-1">
                  <input
                    type="text"
                    placeholder="Null"
                    name="x"
                    className="input input-sm w-full max-w-xs rounded-none"
                    value={timepoint.x ? timepoint.x : ''}
                    onChange={onChange(index)}
                    onPaste={onPaste(index, 1)}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-0 m-2 hidden items-center whitespace-nowrap rounded-lg bg-base-200 px-2 text-xs opacity-75 sm:flex ">
                    g/L
                  </span>
                </td>
                <td className="relative border border-base-300 p-1">
                  <input
                    type="text"
                    placeholder="Null"
                    name="s"
                    className="input input-sm w-full max-w-xs rounded-none"
                    value={timepoint.s ? timepoint.s : ''}
                    onChange={onChange(index)}
                    onPaste={onPaste(index, 2)}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-0 m-2 hidden items-center whitespace-nowrap rounded-lg bg-base-200 px-2 text-xs opacity-75 sm:flex ">
                    g/L
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        <kbd className="kbd">ctrl</kbd>+<kbd className="kbd">v</kbd> to paste data
      </div>
    </div>
  )
}

const resetErrorMessages = (state: State): State => {
  return {
    ...state,
    umax: { ...state.umax, error: '' },
    volume: { ...state.volume, error: '' },
    substrateConc: { ...state.substrateConc, error: '' },
    OD: { ...state.OD, error: '' },
    feedVolume: { ...state.feedVolume, error: '' },
    feedConc: { ...state.feedConc, error: '' },
    z: { ...state.z, error: '' },
    ms: { ...state.ms, error: '' },
    ks: { ...state.ks, error: '' },
    YDCW_OD: { ...state.YDCW_OD, error: '' },
    Yxs_max: { ...state.Yxs_max, error: '' },
  }
}

const validateState = (state: State) => {
  const validatedState = resetErrorMessages(state)

  const volume = state.volume.calculatedValue.value
  const feedVolume = state.feedVolume.calculatedValue.value
  const umax = state.umax.calculatedValue.value
  const od = state.OD.calculatedValue.value
  const feedConc = state.feedConc.calculatedValue.value
  const z = state.z.calculatedValue.value
  const ms = state.ms.calculatedValue.value
  const ks = state.ks.calculatedValue.value
  const YDCW_OD = state.YDCW_OD.calculatedValue.value
  const Yxs_max = state.Yxs_max.calculatedValue.value

  if (volume <= 0) {
    validatedState.volume.error = 'Volume must be positive'
  }
  if (volume > 10000000) {
    validatedState.volume.error = 'Volume must be less than 10,000,000 L'
  }
  if (feedVolume <= 0) {
    validatedState.feedVolume.error = 'Feed must be positive'
  }
  if (feedVolume > 1000000) {
    validatedState.feedVolume.error = 'Feed must be less than 1,000,000 L'
    validatedState.feedVolume.calculatedValue.value = 1000000
  }
  if (umax <= 0) {
    validatedState.umax.error = 'Must be positive'
  }
  if (od <= 0) {
    validatedState.OD.error = 'Must be positive'
  }
  if (feedConc <= 0) {
    validatedState.feedConc.error = 'Must be positive'
  }
  if (z <= 0) {
    validatedState.z.error = 'Must be positive'
  }
  if (z > 100) {
    validatedState.z.error = 'Must be less than 100%'
  }
  if (ms <= 0) {
    validatedState.ms.error = 'Must be positive'
  }
  if (ks <= 0) {
    validatedState.ks.error = 'Must be positive'
  }
  if (YDCW_OD <= 0) {
    validatedState.YDCW_OD.error = 'Must be positive'
  }
  if (Yxs_max <= 0) {
    validatedState.Yxs_max.error = 'Must be positive'
  }

  return validatedState
}

const ExampleCard = () => {
  return (
    <CalcCard title="Calculation">
      <>
        <p className="mb-6">
          The relationship between cell mass, substrate, and fermentation volume is determined through differential
          equations. The rate of change for each component depends on the fermentation phase:
        </p>

        <p>
          <span className="font-bold">Batch Phase</span> The initial growup of the cells at constant volume.
        </p>
        <div className="mb-6">
          <Equation equation={`$$\\frac{dX}{dt} = r⋅X = \\frac{\\mu_{max} ⋅ S}{K_{s}+S} ⋅ X$$`} />
          <Equation equation={`$$\\frac{dS}{dt} = -r⋅X/Y_{a} = -\\frac{\\mu_{max} ⋅ S}{K_{s}+S}/Y_{a} ⋅ X$$$$`} />
          <Equation equation={`$$\\frac{dV}{dt} = 0$$`} />
        </div>

        <p>
          <span className="font-bold">Fed Batch</span> Cell growth at increasing volume.
        </p>

        <div className="mb-6">
          <Equation
            equation={`$$\\frac{dX}{dt} = r⋅X - \\frac{F}{V}⋅X = \\frac{\\mu_{max} ⋅ S}{K_{s}+S} ⋅ X - \\frac{F}{V}⋅X$$ `}
          />
          <Equation
            equation={`$$\\frac{dS}{dt} = \\frac{F(t)*(S_f - S)}{V}-rX/Y_{a} = \\frac{F(t)*(S_f - S)}{V}-\\frac{\\mu_{max} ⋅ S}{K_{s}+S}/Y_{a} ⋅ X$$$$`}
          />
          <Equation equation={`$$\\frac{dV}{dt} = F(t)$$`} />
        </div>
        <p className="mb-6">Where</p>
        <Equation equation={`$$Y_{xs} = \\frac{Y_{xs max}⋅\\mu_{max}}{\\mu_{max}-Y_{xs max}⋅ms} $$`} />
        <Equation equation={`$$F_{0} = \\frac{V_{0}⋅X{b}}{S_{f}} ⋅ \\frac{\\mu_{max}⋅z}{Y_{xs max}}+ms  $$`} />
        <Equation equation={`$$F(t) = F_{0} e^{\\mu_{max}⋅z⋅t}$$`} />
        <Equation equation={`$$Y_{a} = \\frac{\\mu_{max}⋅Y_{xs max}}{\\mu_{max}-Y_{xs max}⋅ms}$$`} />

        <p className="mb-2 text-lg font-medium">Definitions</p>
        <VariableDefinition equation={`$$X = $$`} definition="Dry cell concentartion" />
        <VariableDefinition equation={`$$S = $$`} definition="Substrate concentration" />
        <VariableDefinition equation={`$$V = $$`} definition="Cummulative fermentation volume" />
        <VariableDefinition equation={`$$V_{0} = $$`} definition="Intial fermentation volume" />
        <VariableDefinition equation={`$$\\mu_{max}  = $$`} definition="Maximum specific growth rate" />
        <VariableDefinition equation={`$$K_{s} = $$`} definition="Half-velocity constant" />
        <VariableDefinition equation={`$$S_{f} = $$`} definition="Feed substrate concentration" />
        <VariableDefinition equation={`$$X_{b} = $$`} definition="Batch phase final cell concentration " />
        <VariableDefinition equation={`$$ms = $$`} definition="Cell maintenance consumption rate" />
        <VariableDefinition equation={`$$z = $$`} definition="Specific growth rate scaling factor" />
        <VariableDefinition equation={`$$Y_{xs max} = $$`} definition="Max biomass/substrate yield" />
        <VariableDefinition equation={`$$F(t) = $$`} definition="Feed rate" />
        <p className="italic">Created with help from Phil Vo</p>
      </>
    </CalcCard>
  )
}
