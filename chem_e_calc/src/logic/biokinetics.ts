import { ChartData, Point, ChartOptions } from 'chart.js/auto'
import { State } from '../pages/fermentation/biokinetics'
import * as odex from 'odex'
import { extractColorFromCSS } from '../utils/colors'

const baseColor = extractColorFromCSS('--bc')

export type Calculate = {
  chart: ChartData<'scatter'>
  details: {
    batchDuration: number
    feedDuration: number
    cellConc: number
  }
  error: string
}

enum Phase {
  GROWUP,
  FEED,
}

export const calculate = (state: State): Calculate => {
  const xData: Point[] = [] // [{x: time, y:value}]
  const sData: Point[] = [] // [{x: time, y:value}]
  const vData: Point[] = [] // [{x: time, y:value}]
  let error = ''

  //ChartData<'scatter'>
  const V0 = state.volume.calculatedValue.value //l
  const Vfeed = state.feedVolume.calculatedValue.value //l
  const OD0 = state.OD.calculatedValue.value //OD600
  const umax = state.umax.calculatedValue.value //1/hr
  const S0 = state.substrateConc.calculatedValue.value //g/L glucose
  const Sf = state.feedConc.calculatedValue.value //g/L glucose
  const Vfinal = V0 + Vfeed //l
  const isFeeding = state.isFeeding //boolean

  //Advnanced Constants

  // Biokinetic Parameters

  const z = state.z.calculatedValue.value //Scaling factor for specific growth rate setpoint
  const usp = (umax * z) / 100 //Scaled specific growth rate
  const ms = state.ms.calculatedValue.value // g substrate/g dry cells/hr, Cell maintenance consumption rate
  const Ks = state.ks.calculatedValue.value // g substrate/L, Half velocity constant
  const YDCW_OD = state.YDCW_OD.calculatedValue.value // g dry cells/OD, Conversion between OD and dry cell weight
  const Yxs_max = state.Yxs_max.calculatedValue.value // g dry cells/g substrate, Max biomass/substrate yield
  const Yxs_abs = Yxs_max * (umax / (umax - Yxs_max * ms)) // Asymptotic biomass/substrate yield

  // const z = 25 //Scaling factor for specific growth rate setpoint
  // const usp = (umax * z) / 100 //Scaled specific growth rate
  // const ms = 0.0031 // g substrate/g dry cells/hr, Cell maintenance consumption rate
  // const Ks = 0.1823 // g substrate/L, Monod constant
  // const YDCW_OD = 0.41 // g dry cells/OD, Conversion between OD and dry cell weight
  // const Yxs_max = 0.49 // g dry cells/g substrate, Max biomass/substrate yield
  // const Yxs_abs = Yxs_max * (umax / (umax - Yxs_max * ms)) // Asymptotic biomass/substrate yield

  // console.table({ usp, Yxs_abs, ms, V0, Sf })

  // Define Initial Conditions ---------------------------------------------------------------------------------
  const X0 = OD0 * YDCW_OD // g dry cells/L
  const S1_lim = 0.001 // Concentration of substrate to proceed to fed-batch phase
  let cellConc = 0 //final concentation to be updated

  // Define and Solve System of Differential Equations ---------------------------------------------------------

  type timepoint = number[]
  let tf0 = 0 //hours until batch phase completion. Will be overwritten in for loop
  let yf0: timepoint = [0, 0, 0] //Final concentration of cells, substrate, and volume. Will be overwritten in for loop.
  let tf1 = tf0 //hours until batch phase completion. Will be overwritten in for loop

  // X = y[0]
  // S = y[1]
  // V = y[2]

  try {
    const ode = function (
      umax: number,
      Ks: number,
      Yxs_abs: number,
      Sf: number,
      V0: number,
      usp: number,
      ms: number,
      x1: number,
      phase: Phase
    ) {
      return function (x: number, y: number[]) {
        // x = t
        // y = [X, S, V]
        if (y[0] == undefined || y[1] == undefined || y[2] == undefined) {
          throw new Error('y[0], y[1], or y[2] is undefined')
        }

        const mu = (umax * y[1]) / (y[1] + Ks) //Specific Growth Rate
        const rX = mu * y[0]
        const F = () => {
          // Volumetric Feed Flowrate
          if (phase == Phase.GROWUP) return 0
          if (phase == Phase.FEED) {
            const F0 = (usp / Yxs_abs + ms) * ((x1 * V0) / Sf)
            return F0 * Math.exp(usp * x)
          }
          return 0
        }

        const dXdt = rX - (y[0] * F()) / y[2] //X * (umax * S) / (S + Ks) - (X * F(x, Phase)) / V
        const dSdt = (F() * (Sf - y[1])) / y[2] - rX / Yxs_abs //(F(x, Phase) * (Sf - S)) / V - X * (umax * S) / (S + Ks) / Yxs_abs
        const dVdt = F() //F(x, 0)
        return [dXdt, dSdt, dVdt]
      }
    }

    const start = 0
    const end = 1000
    const dt = 0.1
    let tEnd = 0

    //Batch phase ---------------------------------------------------------
    const y0: timepoint = [X0, S0, V0]
    const batchODE = new odex.Solver(ode(umax, Ks, Yxs_abs, Sf, V0, usp, ms, 0, Phase.GROWUP), 3)
    const f = batchODE.integrate(0, y0)

    for (let t = start; t <= end; t += dt) {
      const y = f(t)
      if (y[0] == undefined || y[1] == undefined || y[2] == undefined) {
        throw new Error('y[0], y[1], or y[2] is undefined for the batch phase integration')
      }
      xData.push({ x: t, y: y[0] })
      sData.push({ x: t, y: y[1] })
      isFeeding && vData.push({ x: t, y: y[2] })
      if (y[1] < S1_lim) {
        //Stop when substrate concentration runs out
        tEnd = t
        tf0 = t
        yf0 = [y[0], y[1], y[2]]
        cellConc = y[0]
        break
      }
    }

    //Fed Batch phase ---------------------------------------------------------

    if (state.isFeeding && Vfeed > 0) {
      if (yf0[0] == undefined) {
        throw new Error('yf0[0] is undefined for the fed batch phase integration')
      }
      const feedODE = new odex.Solver(ode(umax, Ks, Yxs_abs, Sf, V0, usp, ms, yf0[0], Phase.FEED), 3)
      const ff = feedODE.integrate(0, yf0)

      for (let t = 0; t <= end; t += dt) {
        const y = ff(t)
        if (y[0] == undefined || y[1] == undefined || y[2] == undefined) {
          throw new Error('y[0], y[1], or y[2] is undefined for the batch phase integration')
        }
        xData.push({ x: t + tf0 + dt, y: y[0] })
        sData.push({ x: t + tf0 + dt, y: y[1] })
        isFeeding && vData.push({ x: t + tf0 + dt, y: y[2] })
        if (y[2] > Vfinal) {
          //Stop when volume reaches final volume
          tf1 = t + tf0 + dt
          tEnd = tf1
          cellConc = y[0]
          break
        }
      }
    }

    //Statonary Phase ---------------------------------------------------------
    //Adds extra to graph
    for (let t = tEnd + dt; t <= tEnd + tf0 / 2; t += dt) {
      xData.push({ x: t, y: cellConc })
      sData.push({ x: t, y: 0 })
      isFeeding && vData.push({ x: t, y: Vfinal })
    }
  } catch (e: any) {
    error = e.message
    console.log(e)
  }

  return {
    chart: {
      datasets: [
        {
          label: 'Dry Cells',
          data: xData,
          pointRadius: 0,
          showLine: true,
          yAxisID: 'y',
          pointHitRadius: 1,
        },
        {
          label: 'Substrate',
          data: sData,
          pointRadius: 1,
          showLine: true,
          yAxisID: 'y',
          pointHitRadius: 1,
        },
        {
          label: 'Volume',
          data: vData,
          pointRadius: 1,
          showLine: true,
          yAxisID: 'y2',
          pointHitRadius: 1,
        },
      ],
    },
    details: {
      batchDuration: tf0,
      feedDuration: tf1 - tf0,
      cellConc: cellConc,
    },
    error: error,
  }
}

export const chartOptions: ChartOptions<'scatter'> = {
  responsive: true,
  interaction: {
    intersect: false,
    mode: 'index',
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
      //Second axis for volume
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
              case 'Dry Cells':
                label += `${context.parsed.y.toLocaleString('en-US', { maximumSignificantDigits: 2 })} g/L `
                break

              case 'Substrate':
                label += `${context.parsed.y.toLocaleString('en-US', { maximumSignificantDigits: 2 })} g/L `
                break

              case 'Volume':
                label += `${context.parsed.y.toLocaleString('en-US', { maximumSignificantDigits: 5 })} L `
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
