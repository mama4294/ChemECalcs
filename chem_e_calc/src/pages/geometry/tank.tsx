import { NextPage } from 'next'
import { useContext, useReducer, useState } from 'react'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import {
  InputDropdown,
  InputFieldConstant,
  InputFieldWithUnit,
  InputSlider,
} from '../../components/inputs/inputFieldObj'
import { DefaultUnitContext, DefaultUnitContextType } from '../../contexts/defaultUnitContext'
import { updateCalculatedValue } from '../../logic/logic'
import { ShortInputType } from '../../types'
import { convertUnits } from '../../utils/units'
import Canvas from '../../icons/tankCanvas'
import { heightOfTriangle, volumeOfConeFromAngle, volumeOfConeFromHeight, volumeOfCylinder } from '../../utils/geometry'

type Head = 'ellipsoidal (2:1)' | 'hemisphere' | 'ASME 80/6 F&D' | 'ASME 80/10 F&D' | 'ASME F&D' | 'flat' | 'cone'

//https://www.chemengonline.com/wp-content/uploads/2017/05/sept11_ep_sas2.pdf

export type State = {
  orientation: 'vertical' | 'horizontal'
  head: Head
  bottom: Head
  diameter: ShortInputType
  height: ShortInputType
  liquidPercent: number
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

  type StateData = Omit<State, 'orientation' | 'head' | 'bottom' | 'liquidPercent'>

  const initialState: State = {
    orientation: 'vertical',
    head: 'ellipsoidal (2:1)',
    bottom: 'ellipsoidal (2:1)',
    liquidPercent: 50,
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
    CHANGE_LIQUID_HEIGHT = 'CHANGE_LIQUID_LEVEL',
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
        type: ActionKind.CHANGE_LIQUID_HEIGHT
        payload: { value: number }
      }
    | {
        type: ActionKind.REFRESH
      }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.CHANGE_DROPDOWN:
        return { ...state, [action.payload.name]: action.payload.value }
      case ActionKind.CHANGE_LIQUID_HEIGHT:
        let liquidPercent = action.payload.value // 0 - 100
        if (liquidPercent > 100) liquidPercent = 100
        else if (liquidPercent <= 0) liquidPercent = 0
        else if (!Number(liquidPercent)) liquidPercent = state.liquidPercent
        return { ...state, liquidPercent: liquidPercent }
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

  const handleChangeLiquidHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (value == '') value = '0'
    dispatch({
      type: ActionKind.CHANGE_LIQUID_HEIGHT,
      payload: { value: Number(value) },
    })
  }

  //Determine max head dimensions for scaling
  const topHeadHeight = calculateHeadHeight({
    type: state.head,
    diameter: state.diameter.calculatedValue.value,
    angle: state.topConeAngle.calculatedValue.value,
  })
  const bottomHeadHeight = calculateHeadHeight({
    type: state.bottom,
    diameter: state.diameter.calculatedValue.value,
    angle: state.bottomConeAngle.calculatedValue.value,
  })

  const totalHeight = state.height.calculatedValue.value + topHeadHeight + bottomHeadHeight //m
  const liquidHeight = totalHeight * (state.liquidPercent / 100) //m

  const { head, bottom, orientation, diameter, height, liquidPercent, topConeAngle, bottomConeAngle } = state

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
              {/* <InputDropdown
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
              /> */}
              <InputDropdown
                name="head"
                label={orientation === 'vertical' ? 'Top Head Type' : 'Left Side Type'}
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
                label={orientation === 'vertical' ? 'Bottom Head Type' : 'Right Side Type'}
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
              <InputSlider
                name="liquidHeight"
                label="Liquid Height"
                error=""
                value={liquidPercent}
                onChange={handleChangeLiquidHeight}
                max={100}
                min={0}
              />
            </div>
          </>
        </CalcCard>
        <CalcCard title={'Tank'}>
          <Canvas state={state} />
          {/* <CanvasTank state={state} /> */}
        </CalcCard>
        <ResultsCard
          state={state}
          resultsState={resultsState}
          handleChangeResultsState={handleChangeResultsState}
          liquidHeight={liquidHeight}
          totalHeight={totalHeight}
        />
      </CalcBody>
    </PageContainer>
  )
}

type ResultsCard = {
  state: State
  resultsState: ResultsState
  handleChangeResultsState?: (e: React.ChangeEvent<HTMLInputElement>) => void
  liquidHeight: number
  totalHeight: number
}

export type TankHeadParameter = {
  [key: string]: {
    fd: number
    fk: number
    a1: number
    a2: number
    b1: number
    b2: number
    c: number
    CR: number
    KR: number
  }
}

export const tankHeadParameters: TankHeadParameter = {
  'ASME F&D': {
    fd: 1,
    fk: 0.06,
    a1: 0.1163166103,
    b1: 0.4680851064,
    a2: 0.1693376137,
    b2: 0.5,
    c: 0.080999,
    CR: 1,
    KR: 0.1,
  },
  'ASME 80/10 F&D': {
    fd: 0.8,
    fk: 0.1,
    a1: 0.1434785547,
    b1: 0.4571428571,
    a2: 0.2255437353,
    b2: 0.5,
    c: 0.109884,
    CR: 0.8,
    KR: 0.1,
  },
  'ASME 80/6 F&D': {
    fd: 0.8,
    fk: 0.06,
    a1: 0.1567794689,
    b1: 0.4756756757,
    a2: 0.2050210088,
    b2: 0.5,
    c: 0.0945365,
    CR: 0.8,
    KR: 0.06,
  },
  'ellipsoidal (2:1)': {
    fd: 0.875,
    fk: 0.17,
    a1: 0.101777034,
    b1: 0.4095744681,
    a2: 0.2520032103,
    b2: 0.5,
    c: 0.1337164,
    CR: 0.9,
    KR: 0.17,
  },
  hemisphere: {
    fd: 0.5,
    fk: 0.5,
    a1: 0.5,
    b1: 0.5,
    a2: 0.5,
    b2: 0.5,
    c: 0.2617994,
    CR: 1,
    KR: 0,
  },
}

type VolumeOfDish = {
  diameter: number
  type: string
}

const volumeOfDish = ({ diameter, type }: VolumeOfDish) => {
  const capacityFactor = tankHeadParameters[type]?.c || 0
  return capacityFactor * Math.pow(diameter, 3) //m3
}

const ResultsCard = ({ state, resultsState, handleChangeResultsState, liquidHeight, totalHeight }: ResultsCard) => {
  const { diameter, height, topConeAngle, bottomConeAngle, head, bottom } = state

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
        return volumeOfConeFromAngle({ diameter: diameter, angle: angle })
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

  type VolumeByLevelProps = {
    state: State
    liquidHeight: number
  }

  const calcVolumeByLevel = ({ state, liquidHeight }: VolumeByLevelProps) => {
    const diameter = state.diameter.calculatedValue.value
    const bottomConeAngle = state.bottomConeAngle.calculatedValue.value

    const calculateBottomVolume = (state: State, liquidHeight: number): number => {
      if (state.bottom === 'flat') {
        return 0
      }
      if (state.bottom === 'cone') {
        //TODO fix this. Not correct
        const coneHeight = heightOfTriangle({ base: diameter, angle: bottomConeAngle })
        console.table({ coneHeight, liquidHeight })
        if (liquidHeight < coneHeight) {
          const radius = liquidHeight * Math.tan(state.bottomConeAngle.calculatedValue.value * (Math.PI / 180))
          return (1 / 3) * Math.PI * Math.pow(radius, 2) * liquidHeight
        } else {
          return volumeOfConeFromHeight({ diameter: diameter, height: coneHeight })
        }
      } else {
        return calculateASMEVolumebyHeight(state, liquidHeight, false)
      }
    }

    const calculateTopVolume = (state: State, liquidHeight: number) => {
      if (state.head === 'flat') {
        return 0
      }
      if (state.head === 'cone') {
        //TODO fix this. Not correct
        const coneHeight = heightOfTriangle({ base: diameter, angle: bottomConeAngle })
        console.table({ coneHeight, liquidHeight })
        if (liquidHeight < coneHeight) {
          const radius = liquidHeight * Math.tan(state.bottomConeAngle.calculatedValue.value * (Math.PI / 180))
          return (1 / 3) * Math.PI * Math.pow(radius, 2) * liquidHeight
        } else {
          return volumeOfConeFromHeight({ diameter: diameter, height: coneHeight })
        }
      } else {
        return calculateASMEVolumebyHeight(state, liquidHeight, true)
      }
    }

    const calcV1 = ({ diameter, fd, a }: { diameter: number; fd: number; a: number }) => {
      return Math.PI * diameter ** 3 * (fd * a ** 2 + (1 / 3) * a ** 3)
    }

    const calcV2 = ({
      a,
      a1,
      a2,
      fk,
      diameter,
    }: {
      a: number
      a1: number
      a2: number
      fk: number
      diameter: number
    }) => {
      const v2_1 = (Math.pow(0.5 - fk, 2) + Math.pow(fk, 2)) * (a - a1)
      const v2_2 = (1 / 3) * (Math.pow(a - a2, 3) - Math.pow(a1 - a2, 3))
      const v2_3 =
        (0.5 - fk) *
        ((a - a2) * Math.sqrt(Math.pow(fk, 2) - Math.pow(a - a2, 2)) -
          (a1 - a2) * Math.sqrt(Math.pow(fk, 2) - Math.pow(a1 - a2, 2)) +
          Math.pow(fk, 2) * Math.asin((a - a2) / fk) -
          Math.pow(fk, 2) * Math.asin((a1 - a2) / fk))
      return Math.PI * Math.pow(diameter, 3) * (v2_1 + v2_2 + v2_3)
    }

    const calcV4 = ({
      a,
      a1,
      a2,
      a5,
      fk,
      diameter,
    }: {
      a: number
      a1: number
      a2: number
      a5: number
      fk: number
      diameter: number
    }) => {
      const v4_1 = (Math.pow(0.5 - fk, 2) + Math.pow(fk, 2)) * (a5 - a - a1)
      const v4_2 = (1 / 3) * (Math.pow(a5 - a - a2, 3) - Math.pow(a1 - a2, 3))
      const v4_3 =
        (0.5 - fk) *
        ((a5 - a - a2) * Math.sqrt(Math.pow(fk, 2) - Math.pow(a5 - a - a2, 2)) -
          (a1 - a2) * Math.sqrt(Math.pow(fk, 2) - Math.pow(a1 - a2, 2)) +
          Math.pow(fk, 2) * Math.asin((a5 - a - a2) / fk) -
          Math.pow(fk, 2) * Math.asin((a1 - a2) / fk))

      return Math.PI * Math.pow(diameter, 3) * (v4_1 + v4_2 + v4_3)
    }

    const calcV5 = ({ diameter, fd, a, a5 }: { diameter: number; fd: number; a: number; a5: number }) => {
      return Math.PI * diameter ** 3 * (fd * Math.pow(a5 - a, 2) - (1 / 3) * Math.pow(a5 - a, 3))
    }

    const calculateASMEVolumebyHeight = (state: State, liquidHeight: number, top: boolean): number => {
      const a = liquidHeight / state.diameter.calculatedValue.value //m
      const diameter = state.diameter.calculatedValue.value //m

      if (top) {
        //Top Dish
        const dish = state.head
        const fd = tankHeadParameters[dish]?.fd || 0
        const fk = tankHeadParameters[dish]?.fk || 0
        const a1 = tankHeadParameters[dish]?.a1 || 0
        const a2 = tankHeadParameters[dish]?.a2 || 0
        const a5 = totalHeight / state.diameter.calculatedValue.value
        const a3 = a5 - a2
        const a4 = a5 - a1

        console.table({ a, a1, a2, a3, a4, a5, liquidHeight })

        let v4 = 0
        if (a <= a3) v4 = 0
        else if (a >= a4) v4 = calcV2({ a: a2, a1, a2, diameter, fk }) - calcV4({ a: a4, a1, a2, a5, diameter, fk })
        else v4 = calcV2({ a: a2, a1, a2, diameter, fk }) - calcV4({ a: a, a1, a2, a5, diameter, fk })

        let v5 = 0
        if (a <= a4) v5 = 0
        else if (a >= a5) v5 = calcV1({ diameter, fd, a: a1 }) - calcV5({ diameter, fd, a: a5, a5 })
        else v5 = calcV1({ diameter, fd, a: a1 }) - calcV5({ diameter, fd, a, a5 })

        return v4 + v5
      } else {
        //Bottom Dish
        const dish = state.bottom
        const fd = tankHeadParameters[dish]?.fd || 0
        const fk = tankHeadParameters[dish]?.fk || 0
        const a1 = tankHeadParameters[dish]?.a1 || 0
        const a2 = tankHeadParameters[dish]?.a2 || 0

        let v1 = 0
        if (a <= 0) v1 = 0 //v1 is empty
        else if (a >= a1) v1 = calcV1({ diameter, fd, a: a1 }) //v1 completely filled
        else v1 = calcV1({ diameter, fd, a: a1 }) //v1 partially filled

        let v2 = 0
        if (a <= a1) v2 = 0 //v2 is empty
        else if (a >= a2) {
          //v2 is completely filled
          v2 = calcV2({ a: a2, a1, a2, diameter, fk })
        } else {
          //v2 is partially filled
          v2 = calcV2({ a, a1, a2, diameter, fk })
        }
        return v1 + v2
      }
    }

    const bottomVolume = calculateBottomVolume(state, liquidHeight)
    const middleVolume = volumeOfCylinder({
      diameter: state.diameter.calculatedValue.value,
      height: state.height.calculatedValue.value,
    })
    const topVolume = calculateTopVolume(state, liquidHeight)

    return bottomVolume + middleVolume + topVolume
  }

  const liquidVolume = convertUnits({
    value: calcVolumeByLevel({ state, liquidHeight }),
    fromUnit: 'm3',
    toUnit: resultsState.liquidVolume,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  return (
    <CalcCard title={'Results'}>
      <>
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
        <InputFieldWithUnit
          key="liquidVolume"
          name="liquidVolume"
          label="Liquid Volume"
          placeholder="0"
          selected={true}
          displayValue={{ value: String(liquidVolume), unit: resultsState.liquidVolume }}
          error=""
          unitType="volume"
          focusText=""
          onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
          onChangeUnit={handleChangeResultsState}
        />
      </>
    </CalcCard>
  )
}

export const calculateHeadHeight = ({ type, diameter, angle }: { type: string; diameter: number; angle: number }) => {
  if (type === 'cone') {
    //calculate height of cone from angle
    if (angle <= 0) return 0
    if (angle >= 90) return diameter / 2
    return diameter / 2 / Math.tan((angle * Math.PI) / 180)
  } else if (type === 'hemisphere') {
    return diameter / 2
  } else if (type == 'ellipsoidal (2:1)' || type == 'ASME F&D' || type == 'ASME 80/10 F&D' || type == 'ASME 80/6 F&D') {
    const CR = tankHeadParameters[type as keyof typeof tankHeadParameters]?.CR
    const KR = tankHeadParameters[type as keyof typeof tankHeadParameters]?.KR
    if (!CR || !KR) {
      console.error('Error: CR or KR is undefined')
      return 0
    }
    const crownRadius = diameter * CR
    const knuckleRadius = diameter * KR
    const crownAngle = Math.asin((diameter / 2 - knuckleRadius) / (crownRadius - knuckleRadius)) //radians
    return crownRadius - (diameter / 2 - knuckleRadius) / Math.tan(crownAngle)
  } else return 0
}

export default Vessel
