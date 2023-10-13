import { NextPage } from 'next'
import React, { useContext, useEffect, useReducer } from 'react'
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
import { Chart, ChartData, Point, ChartOptions, LinearScale } from 'chart.js/auto'
import { extractColorFromCSS, extractThemeColorsFromDOM } from '../../utils/colors'
Chart.register(LinearScale)

var odex = require('odex')
const baseColor = extractColorFromCSS('--bc')

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

  const data = calculate(state)

  return <CalcCard title="Chart">{<Scatter options={options} data={data} className="text-red-500" />}</CalcCard>
}

export default OURPage

//Calculations:

enum Phase {
  growup,
  feed,
}

const calculate = (state: State): ChartData<'scatter'> => {
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

  // X = y[0]
  // S = y[1]
  // V = y[2]
  // x = t
  // y = [X, S, V]

  var ode = function (umax: number, Ks: number, Yxs_abs: number, Sf: number) {
    return function (x: number, y: [number, number, number]) {
      const dXdt = (y[0] * (umax * y[1])) / (y[1] + Ks) - (y[0] * F(x, Phase.feed)) / y[2] //X * (umax * S) / (S + Ks) - (X * F(x, Phase.feed)) / V
      const dSdt = (F(x, Phase.feed) * (Sf - y[1])) / y[2] - (y[0] * (umax * y[1])) / (y[1] + Ks) / Yxs_abs //(F(x, Phase.feed) * (Sf - S)) / V - X * (umax * S) / (S + Ks) / Yxs_abs
      const dVdt = F(x, 0) //F(x, 0)
      return [dXdt, dSdt, dVdt]
    }
  }

  const start = 0
  const end = 30
  const dt = 0.5
  const y0: timepoint = [X0, S0, V0]
  const s = new odex.Solver(ode(umax, Ks, Yxs_abs, Sf), 3)
  const f = s.integrate(0, y0)
  const xData: Point[] = [] // [{x: time, y:value}]
  const sData: Point[] = [] // [{x: time, y:value}]
  const vData: Point[] = [] // [{x: time, y:value}]

  for (let t = start; t <= end; t += dt) {
    let y = f(t)
    xData.push({ x: t, y: y[0] })
    sData.push({ x: t, y: y[1] })
    vData.push({ x: t, y: y[2] })
  }

  return {
    datasets: [
      {
        label: 'Cells',
        data: xData,
        pointRadius: 1,
        showLine: true,
        yAxisID: 'y',
        pointHitRadius: 2,
      },
      {
        label: 'Substrate',
        data: sData,
        pointRadius: 1,
        showLine: true,
        yAxisID: 'y',
        pointHitRadius: 2,
      },
      {
        label: 'Volume',
        data: vData,
        pointRadius: 1,
        showLine: true,
        yAxisID: 'y2',
        pointHitRadius: 2,
      },
    ],
  }
}

const options: ChartOptions<'scatter'> = {
  responsive: true,
  interaction: {
    intersect: false,
    mode: 'x',
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Time (hours)',
        color: baseColor,
      },
      ticks: {
        color: baseColor,
      },
      grid: {
        display: false,
      },
    },
    y: {
      type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
      position: 'left',
      min: 0,
      title: {
        display: true,
        text: 'Concentration (g/L)',
        color: baseColor,
      },
      ticks: {
        color: baseColor,
      },
      grid: {
        display: false,
      },
    },
    y2: {
      //Second axis for volum
      type: 'linear',
      position: 'right',

      title: {
        display: true,
        text: 'Volume (L)',
        color: baseColor,
      },
      ticks: {
        color: baseColor,
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: baseColor,
      },
    },

    tooltip: {
      enabled: true,
      position: 'nearest',
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || ''

          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            switch (context.dataset.label) {
              case 'Cells':
                label += `${context.parsed.y.toLocaleString('en-US', { maximumSignificantDigits: 2 })} g/L `
                break

              case 'Substrate':
                label += `${context.parsed.y.toLocaleString('en-US', { maximumSignificantDigits: 2 })} g/L `
                break

              case 'Volume':
                label += `${context.parsed.y.toLocaleString('en-US', { maximumSignificantDigits: 2 })} L `
                break
            }
          }
          return label
        },
        title: function (context) {
          return 'Hour ' + context[0]!.parsed.x.toLocaleString('en-US', { maximumSignificantDigits: 3 })
        },
      },
    },
  },
}
