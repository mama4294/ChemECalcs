import { NextPage } from 'next'
import { useContext, useReducer, useState } from 'react'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { InputDropdown, InputFieldConstant, InputFieldWithUnit } from '../../components/inputs/inputFieldObj'
import { DefaultUnitContext, DefaultUnitContextType } from '../../contexts/defaultUnitContext'
import { updateCalculatedValue } from '../../logic/logic'
import { ShortInputType } from '../../types'
import { convertUnits } from '../../utils/units'
import Canvas from '../../icons/tankCanvas'

import dynamic from 'next/dynamic'

const CanvasTank = dynamic(() => import('../../icons/CanvasTank'), {
  ssr: false,
})

type Head = 'ellipsoidal (2:1)' | 'hemisphere' | 'ASME 80/6 F&D' | 'ASME 80/10 F&D' | 'ASME F&D' | 'flat' | 'cone'

//https://www.chemengonline.com/wp-content/uploads/2017/05/sept11_ep_sas2.pdf

export type State = {
  orientation: 'vertical' | 'horizontal'
  head: Head
  bottom: Head
  diameter: ShortInputType
  height: ShortInputType
  liquidHeight: ShortInputType
  topConeAngle: ShortInputType
  bottomConeAngle: ShortInputType
}

type ResultsState = {
  totalVolume: string
  liquidVolume: string
}

const Vessel: NextPage = () => {
  const paths = [
    { title: 'Geometery', href: '/geometry' },
    { title: 'Vessel', href: '/geometry/tank' },
  ]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  const headTypes = [
    { value: 'hemisphere', label: 'Hemisphere' },
    { value: 'ellipsoidal (2:1)', label: 'Ellipsoidal (2:1)' },
    { value: 'ASME 80/10 F&D', label: 'ASME 80/10 F&D' },
    { value: 'ASME 80/6 F&D', label: 'ASME 80/6 F&D' },
    { value: 'ASME F&D', label: 'ASME F&D' },
    { value: 'cone', label: 'Cone' },
    { value: 'flat', label: 'Flat' },
  ]

  const [resultsState, setResultsState] = useState<ResultsState>({
    totalVolume: 'm3',
    liquidVolume: 'm3',
  })

  const handleChangeResultsState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResultsState({
      ...resultsState,
      [e.target.name]: e.target.value,
    })
  }

  type StateData = Omit<State, 'orientation' | 'head' | 'bottom'>

  const initialState: State = {
    orientation: 'vertical',
    head: 'flat',
    bottom: 'flat',
    diameter: {
      name: 'diameter',
      label: 'Body Diameter',
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
      focusText: 'Enter vessel inner diameter',
      error: '',
    },
    height: {
      name: 'height',
      label: 'Body Height',
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
      focusText: 'Enter vessel body height',
      error: '',
    },
    liquidHeight: {
      name: 'liquidHeight',
      label: 'Liquid Height',
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
      focusText: 'Enter liquid height measured from the tank bottom',
      error: '',
    },
    topConeAngle: {
      name: 'topConeAngle',
      label: 'Cone Angle',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '45', unit: 'deg' },
      calculatedValue: { value: 45, unit: 'deg' },
      selectiontext: '',
      focusText: 'Enter the cone angle',
      error: '',
    },
    bottomConeAngle: {
      name: 'bottomConeAngle',
      label: 'Cone Angle',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '45', unit: 'deg' },
      calculatedValue: { value: 45, unit: 'deg' },
      selectiontext: '',
      focusText: 'Enter the cone angle',
      error: '',
    },
  }

  enum ActionKind {
    CHANGE_DROPDOWN = 'CHANGE_DROPDOWN',
    CHANGE_VALUE = 'CHANGE_VALUE_WITH_UNIT',
    CHANGE_CONE_ANGLE = 'CHANGE_CONE_ANGLE',
    CHANGE_UNIT = 'CHANGE_UNIT',
    REFRESH = 'REFRESH',
  }

  type Action =
    | {
        type:
          | ActionKind.CHANGE_VALUE
          | ActionKind.CHANGE_CONE_ANGLE
          | ActionKind.CHANGE_UNIT
          | ActionKind.CHANGE_DROPDOWN
        payload: { name: string; value: string }
      }
    | {
        type: ActionKind.REFRESH
      }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.CHANGE_DROPDOWN:
        return { ...state, [action.payload.name]: action.payload.value }
      case ActionKind.CHANGE_CONE_ANGLE:
        console.log(action.payload)
        let { name, value } = action.payload
        let angle = validateAngle(value)
        let unit = state[name as keyof StateData].displayValue.unit
        let payload = {
          ...state[name as keyof StateData],
          displayValue: { value: angle.toString(), unit },
          calculatedValue: { value: angle, unit },
        }
        return { ...state, [name]: payload }
      default:
        alert('Error: State reducer action not recognized')
        return state
      case ActionKind.CHANGE_VALUE:
        name = action.payload.name
        let numericValue = action.payload.value.replace(/[^\d.-]/g, '')
        unit = state[name as keyof StateData].displayValue.unit
        payload = { ...state[name as keyof StateData], displayValue: { value: numericValue, unit } }
        let payloadWithCalculatedValue = updateCalculatedValue(payload)
        return { ...state, [name]: payloadWithCalculatedValue }
      case ActionKind.CHANGE_UNIT:
        name = action.payload.name
        const existingValue = state[name as keyof StateData].displayValue.value
        payload = {
          ...state[name as keyof StateData],
          displayValue: { value: existingValue, unit: action.payload.value },
        }
        payloadWithCalculatedValue = updateCalculatedValue(payload)
        return { ...state, [name]: payloadWithCalculatedValue }
    }
  }

  const validateAngle = (value: string) => {
    const numericValue = value.replace(/[^\d.-]/g, '')
    let answer = Number(numericValue)
    if (answer > 90) {
      return 90
    } else if (answer < 0) {
      return 0
    }
    return answer
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionKind.CHANGE_VALUE,
      payload: { name: e.target.name, value: e.target.value },
    })
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionKind.CHANGE_UNIT,
      payload: { name: e.target.name, value: e.target.value },
    })
  }

  const { head, bottom, orientation, diameter, height, liquidHeight, topConeAngle, bottomConeAngle } = state

  return (
    <PageContainer>
      <Breadcrumbs paths={paths} />
      <CalcHeader
        title={'Tank'}
        text={'Calculate the volume of a tank with flat, conical, ellipsoidal, hemispherical, or torisoidal heads'}
      />
      <CalcBody>
        <CalcCard title={'Calculator'}>
          <>
            <div className="mb-0 flex flex-col">
              <InputDropdown
                name="orientation"
                label="Orientation"
                selected={false}
                error=""
                focusText="Select orientation"
                value={state.orientation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({
                    type: ActionKind.CHANGE_DROPDOWN,
                    payload: { name: e.target.name, value: e.target.value },
                  })
                }
                options={[
                  { value: 'vertical', label: 'Vertical' },
                  { value: 'horizontal', label: 'Horizontal' },
                ]}
              />
              <InputDropdown
                name="head"
                label={orientation === 'vertical' ? 'Head Type' : 'Left Side Type'}
                selected={false}
                error=""
                focusText="Select orientation"
                value={state.head}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({
                    type: ActionKind.CHANGE_DROPDOWN,
                    payload: { name: e.target.name, value: e.target.value },
                  })
                }
                options={headTypes}
              />
              {head === 'cone' && (
                <InputFieldConstant
                  name={topConeAngle.name}
                  label={topConeAngle.label}
                  placeholder={topConeAngle.placeholder}
                  selected={false}
                  unitType={topConeAngle.unitType}
                  displayValue={topConeAngle.displayValue}
                  error={topConeAngle.error}
                  focusText={topConeAngle.focusText}
                  onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch({
                      type: ActionKind.CHANGE_CONE_ANGLE,
                      payload: { name: e.target.name, value: e.target.value },
                    })
                  }}
                />
              )}

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
              <InputFieldWithUnit
                key={height.name}
                name={height.name}
                label={orientation === 'vertical' ? height.label : 'Body Length'}
                placeholder={height.placeholder}
                selected={false}
                displayValue={height.displayValue}
                error={height.error}
                unitType={height.unitType}
                focusText={height.focusText}
                onChangeValue={handleChangeValue}
                onChangeUnit={handleChangeUnit}
              />
              <InputDropdown
                name="bottom"
                label={orientation === 'vertical' ? 'Bottom Type' : 'Right Side Type'}
                selected={false}
                error=""
                focusText="Select orientation"
                value={state.bottom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({
                    type: ActionKind.CHANGE_DROPDOWN,
                    payload: { name: e.target.name, value: e.target.value },
                  })
                }
                options={headTypes}
              />
              {bottom === 'cone' && (
                <InputFieldConstant
                  name={bottomConeAngle.name}
                  label={bottomConeAngle.label}
                  placeholder={bottomConeAngle.placeholder}
                  selected={false}
                  unitType={bottomConeAngle.unitType}
                  displayValue={bottomConeAngle.displayValue}
                  error={bottomConeAngle.error}
                  focusText={bottomConeAngle.focusText}
                  onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch({
                      type: ActionKind.CHANGE_CONE_ANGLE,
                      payload: { name: e.target.name, value: e.target.value },
                    })
                  }}
                />
              )}
            </div>
          </>
        </CalcCard>
        <CalcCard title={'Tank'}>
          <Canvas state={state} />
          {/* <CanvasTank state={state} /> */}
        </CalcCard>
        <ResultsCard state={state} resultsState={resultsState} handleChangeResultsState={handleChangeResultsState} />
      </CalcBody>
    </PageContainer>
  )
}

type ResultsCard = {
  state: State
  resultsState: ResultsState
  handleChangeResultsState?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type TankHeadParameter = {
  [key: string]: {
    fd: number
    fk: number
    a1: number
    a2: number
    b1: number
    b2: number
    c: number
  }
}

const tankHeadParameters: TankHeadParameter = {
  'ASME F&D': {
    fd: 1,
    fk: 0.06,
    a1: 0.1163166103,
    b1: 0.4680851064,
    a2: 0.1693376137,
    b2: 0.5,
    c: 0.080999,
  },
  'ASME 80/10 F&D': {
    fd: 0.8,
    fk: 0.1,
    a1: 0.1434785547,
    b1: 0.4571428571,
    a2: 0.2255437353,
    b2: 0.5,
    c: 0.109884,
  },
  'ASME 80/6 F&D': {
    fd: 0.8,
    fk: 0.06,
    a1: 0.1567794689,
    b1: 0.4756756757,
    a2: 0.2050210088,
    b2: 0.5,
    c: 0.0945365,
  },
  'ellipsoidal (2:1)': {
    fd: 0.875,
    fk: 0.17,
    a1: 0.101777034,
    b1: 0.4095744681,
    a2: 0.2520032103,
    b2: 0.5,
    c: 0.1337164,
  },
  hemisphere: {
    fd: 0.5,
    fk: 0.5,
    a1: 0.5,
    b1: 0.5,
    a2: 0.5,
    b2: 0.5,
    c: 0.2617994,
  },
}

const ResultsCard = ({ state, resultsState, handleChangeResultsState }: ResultsCard) => {
  const { diameter, height, topConeAngle, bottomConeAngle, head, bottom } = state

  type VolumeOfCone = {
    diameter: number
    angle: number
  }
  const volumeOfCone = ({ diameter, angle }: VolumeOfCone) => {
    const radius = diameter / 2
    const height = radius / Math.tan(angle * (Math.PI / 180))
    const volume = (1 / 3) * Math.PI * Math.pow(radius, 2) * height
    return volume
  }

  type VolumeOfDish = {
    diameter: number
    type: string
  }

  const volumeOfDish = ({ diameter, type }: VolumeOfDish) => {
    const capacityFactor = tankHeadParameters[type]?.c || 0
    return capacityFactor * Math.pow(diameter, 3) //m3
  }

  const calculateHeadVolume = (headType: string, diameter: number, angle: number) => {
    switch (headType) {
      case 'flat':
        return 0
      case 'hemisphere':
      case 'ASME F&D':
      case 'ASME 80/10 F&D':
      case 'ASME 80/6 F&D':
      case 'ellipsoidal (2:1)':
        return volumeOfDish({ diameter: diameter, type: headType })
      case 'cone':
        return volumeOfCone({ diameter: diameter, angle: angle })
      default:
        return 0
    }
  }

  const volumeTopHead = calculateHeadVolume(head, diameter.calculatedValue.value, topConeAngle.calculatedValue.value) //m3
  const volumeShell = (Math.PI * Math.pow(diameter.calculatedValue.value, 2) * height.calculatedValue.value) / 4 //m3
  const volumeBottomHead = calculateHeadVolume(
    bottom,
    diameter.calculatedValue.value,
    bottomConeAngle.calculatedValue.value
  ) //m3

  const totalVolume = convertUnits({
    value: volumeShell + volumeTopHead + volumeBottomHead,
    fromUnit: 'm3',
    toUnit: resultsState.totalVolume,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  return (
    <CalcCard title={'Results'}>
      <InputFieldWithUnit
        key="volume"
        name="totalVolume"
        label="Tank Volume"
        placeholder="0"
        selected={true}
        displayValue={{ value: totalVolume, unit: resultsState.totalVolume }}
        error=""
        unitType="volume"
        focusText=""
        onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
        onChangeUnit={handleChangeResultsState}
      />
    </CalcCard>
  )
}
export default Vessel
