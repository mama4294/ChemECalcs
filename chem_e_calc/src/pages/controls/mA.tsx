import { NextPage } from 'next'
import React, { useReducer } from 'react'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { Equation, VariableDefinition } from '../../components/Equation'
import { InputFieldConstant, InputSlider } from '../../components/inputs/inputField'
import { Metadata } from '../../components/Layout/Metadata'
import { linearInterpolation } from '../../logic/logic'

type State = {
  milliAmps: string
  percent: string
  transmitter: string
  url: string
  lrl: string
  unit: string
  urlError: string
  lrlError: string
}

const Page: NextPage = () => {
  const paths = [
    { title: 'Controls', href: '/controls/' },
    { title: 'Analog Signals', href: '/controls/mA' },
  ]

  const initialState: State = {
    milliAmps: '12',
    percent: '50',
    transmitter: '75',
    url: '150',
    lrl: '0',
    unit: '°C',
    urlError: '',
    lrlError: '',
  }

  type Action = {
    type:
      | ActionKind.CHANGE_MA
      | ActionKind.CHANGE_PERCENT
      | ActionKind.CHANGE_TRANSMITTER
      | ActionKind.CHANGE_LRL
      | ActionKind.CHANGE_URL
      | ActionKind.CHANGE_UNIT
    payload: string
  }

  enum ActionKind {
    CHANGE_MA = 'CHANGE_MA',
    CHANGE_PERCENT = 'CHANGE_PERCENT',
    CHANGE_TRANSMITTER = 'CHANGE_TRANSMITTER',
    CHANGE_LRL = 'CHANGE_LRL',
    CHANGE_URL = 'CHANGE_URL',
    CHANGE_UNIT = 'CHANGE_UNIT',
  }

  const stateReducer = (state: State, action: Action) => {
    const input = Number(action.payload)
    const numLrl = Number(state.lrl)
    const numUrl = Number(state.url)

    switch (action.type) {
      case ActionKind.CHANGE_MA:
        let percent = mAToPercent(input)
        let transmitter = linearInterpolation(percent, 0, 100, numLrl, numUrl)
        return {
          ...state,
          milliAmps: action.payload,
          percent: percent.toLocaleString(),
          transmitter: transmitter.toLocaleString(),
        }
      case ActionKind.CHANGE_PERCENT:
        let milliAmps = percentToMA(input)
        transmitter = linearInterpolation(input, 0, 100, numLrl, numUrl)
        return {
          ...state,
          percent: action.payload,
          milliAmps: milliAmps.toLocaleString(),
          transmitter: transmitter.toLocaleString(),
        }
      case ActionKind.CHANGE_TRANSMITTER:
        percent = linearInterpolation(input, numLrl, numUrl, 0, 100)
        milliAmps = percentToMA(percent)
        return {
          ...state,
          transmitter: action.payload,
          percent: percent.toLocaleString(),
          milliAmps: milliAmps.toLocaleString(),
        }
      case ActionKind.CHANGE_LRL:
        percent = linearInterpolation(Number(state.transmitter), input, numUrl, 0, 100)
        milliAmps = percentToMA(percent)
        let lrlError = ''
        if (input > Number(state.url)) {
          lrlError = 'Must be smaller than URL'
        } else if (isNaN(input)) {
          lrlError = 'Must be a number'
        }
        input > Number(state.url) ? 'Must be smaller than URL' : ''
        return {
          ...state,
          lrl: action.payload,
          lrlError,
          percent: percent.toLocaleString(),
          milliAmps: milliAmps.toLocaleString(),
        }
      case ActionKind.CHANGE_URL:
        percent = linearInterpolation(Number(state.transmitter), numLrl, input, 0, 100)
        milliAmps = percentToMA(percent)
        let urlError = ''
        if (input < Number(state.lrl)) {
          urlError = 'Must be larger than LRL'
        } else if (isNaN(input)) {
          urlError = 'Must be a number'
        }
        return {
          ...state,
          url: action.payload,
          urlError,
          percent: percent.toLocaleString(),
          milliAmps: milliAmps.toLocaleString(),
        }
      case ActionKind.CHANGE_UNIT:
        return { ...state, unit: action.payload }
      default:
        // const neverEver: never = action
        // console.error('Error: State reducer action not recognized', neverEver)
        return state
    }
  }

  const mAToPercent = (mA: number): number => {
    return ((mA - 4) / 16) * 100
  }

  const percentToMA = (percent: number): number => {
    return (percent / 100) * 16 + 4
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const cleanedValue = value.replace(/[^\d.-]/g, '')
    const type = determineType(name)
    if (type != undefined) dispatch({ type: type, payload: cleanedValue })
  }

  const determineType = (name: string) => {
    switch (name) {
      case 'milliAmps':
        return ActionKind.CHANGE_MA
      case 'percent':
        return ActionKind.CHANGE_PERCENT
      case 'transmitter':
        return ActionKind.CHANGE_TRANSMITTER
    }
  }

  return (
    <>
      <Metadata
        title="Analog Signal Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Fluid Dynamics, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />

      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader
          title={'Analog Signal Calculator'}
          text={
            '4-20mA analog signals are a widely used method of transmitting information in industrial settings. They work by sending a current of between 4 and 20 milliamps through a circuit, with the magnitude of the current indicating the value being transmitted.'
          }
        />
        <CalcBody>
          <CalcCard title={'Calculator'}>
            <div className="mb-8 flex flex-col">
              <InputSlider
                name="milliAmps"
                label="Milliamps"
                error=""
                value={state.milliAmps}
                onChange={handleChangeValue}
                max="20"
                min="4"
                unit=" mA"
                step="0.1"
              />

              <InputSlider
                name="percent"
                label="Percent"
                error=""
                value={state.percent}
                onChange={handleChangeValue}
                max="100"
                min="0"
                unit="%"
                step="0.1"
              />
              <InputSlider
                name="transmitter"
                label="Transmitter"
                error=""
                value={state.transmitter}
                onChange={handleChangeValue}
                max={state.url}
                min={state.lrl}
                unit={state.unit}
                step="0.1"
              />
              <div className="flex flex-row justify-between">
                <InputFieldConstant
                  name="lrl"
                  label="LRL"
                  placeholder="0"
                  selected={false}
                  displayValue={{ value: state.lrl, unit: '' }}
                  focusText=""
                  error={state.lrlError}
                  onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch({ type: ActionKind.CHANGE_LRL, payload: e.target.value })
                  }
                />
                <InputFieldConstant
                  name="url"
                  label="URL"
                  placeholder="0"
                  selected={false}
                  displayValue={{ value: state.url, unit: '' }}
                  focusText=""
                  error={state.urlError}
                  onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch({ type: ActionKind.CHANGE_URL, payload: e.target.value })
                  }
                />

                <InputFieldConstant
                  name="unit"
                  label="Unit"
                  placeholder="0"
                  selected={false}
                  displayValue={{ value: state.unit, unit: '' }}
                  focusText=""
                  error=""
                  onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch({ type: ActionKind.CHANGE_UNIT, payload: e.target.value })
                  }
                />
              </div>
            </div>
          </CalcCard>
          <EquationCard />
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default Page

const EquationCard = () => {
  return (
    <CalcCard title="Details">
      <>
        <p className="mb-2 ">
          4-20mA analog signals are known for their simplicity, reliability, and resistance to interference. Because 4mA
          is the minimum value that can be transmitted, it&apos;s easy to tell if the signal has failed, making
          troubleshooting straightforward. Additionally, this type of signal can be transmitted over long distances with
          minimal loss of accuracy.
        </p>
        <p className="mb-2 ">Use linear interpolation to convert 4-20mA signals to process values</p>
        <p className="mb-2 font-semibold">Linear interpolation </p>
        <div className="mb-4">
          <Equation equation={`$$y = y_{1} + \\frac{x - x_1}{x_2 - x_1} * \\left( y_2 - y_1 \\right) $$`} />
        </div>
        <div className="mb-4">
          <Equation equation={`$$y = lrl + \\frac{x - 4mA}{20mA - 4mA} * \\left(url - lrl \\right) $$`} />
        </div>

        <div className="mb-2">
          <VariableDefinition equation={`$$x = $$`} definition="4-20mA signal" />
          <VariableDefinition equation={`$$y = $$`} definition="Transmitter process value" />
          <VariableDefinition equation={`$$url = $$`} definition="Transmitter upper range limit" />
          <VariableDefinition equation={`$$lrl = $$`} definition="Transmitter lower range limit" />
        </div>
      </>
    </CalcCard>
  )
}
