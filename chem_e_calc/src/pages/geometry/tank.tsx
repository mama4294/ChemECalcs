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
import {
  calculateASMEVolumebyHeight,
  capacityOfASMEDish,
  heightOfTriangle,
  volumeOfConeFromAngle,
  volumeOfConeFromHeight,
  volumeOfCylinder,
} from '../../utils/geometry'
import { tankHeadParameters } from '../../constants/ASME'

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
  totalHeight: string
  liquidHeight: string
}

const Tank: NextPage = () => {
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
    totalHeight: 'm',
    liquidHeight: 'm',
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

  const diameterValue = state.diameter.calculatedValue.value
  const heightValue = state.height.calculatedValue.value
  const topConeAngleValue = state.topConeAngle.calculatedValue.value
  const bottomConeAngleValue = state.bottomConeAngle.calculatedValue.value

  //Determine max head dimensions for scaling
  const topDishHeight = calculateHeadHeight({
    type: state.head,
    diameter: diameterValue,
    angle: topConeAngleValue,
  })
  const bottomDishHeight = calculateHeadHeight({
    type: state.bottom,
    diameter: diameterValue,
    angle: bottomConeAngleValue,
  })

  const totalHeight = heightValue + topDishHeight + bottomDishHeight //m
  const liquidHeight = totalHeight * (state.liquidPercent / 100) //m
  const liquidVolumeValue = tankVolumeByLevel({ state, liquidHeight, bottomDishHeight, topDishHeight, totalHeight })
  const totalVolumeValue = tankVolumeByLevel({
    state,
    liquidHeight: totalHeight,
    bottomDishHeight,
    topDishHeight,
    totalHeight,
  })

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
          resultsState={resultsState}
          handleChangeResultsState={handleChangeResultsState}
          liquidVolumeValue={liquidVolumeValue}
          totalVolumeValue={totalVolumeValue}
          totalHeightValue={totalHeight}
          liquidHeightValue={liquidHeight}
        />
      </CalcBody>
    </PageContainer>
  )
}

type ResultsCard = {
  resultsState: ResultsState
  handleChangeResultsState?: (e: React.ChangeEvent<HTMLInputElement>) => void
  liquidVolumeValue: number
  totalVolumeValue: number
  liquidHeightValue: number
  totalHeightValue: number
}

const ResultsCard = ({
  resultsState,
  handleChangeResultsState,
  liquidVolumeValue,
  totalVolumeValue,
  totalHeightValue,
  liquidHeightValue,
}: ResultsCard) => {
  const totalVolume = convertUnits({
    value: totalVolumeValue,
    fromUnit: 'm3',
    toUnit: resultsState.totalVolume,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const totalHeight = convertUnits({
    value: totalHeightValue,
    fromUnit: 'm',
    toUnit: resultsState.totalHeight,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const liquidVolume = convertUnits({
    value: liquidVolumeValue,
    fromUnit: 'm3',
    toUnit: resultsState.liquidVolume,
  }).toLocaleString('en-US', { maximumSignificantDigits: 3 })

  const liquidHeight = convertUnits({
    value: liquidHeightValue,
    fromUnit: 'm',
    toUnit: resultsState.liquidHeight,
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
          key="totalHeight"
          name="totalHeight"
          label="Total Height"
          placeholder="0"
          selected={true}
          displayValue={{ value: totalHeight, unit: resultsState.totalHeight }}
          error=""
          unitType="length"
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
          displayValue={{ value: liquidVolume, unit: resultsState.liquidVolume }}
          error=""
          unitType="volume"
          focusText=""
          onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
          onChangeUnit={handleChangeResultsState}
        />
        <InputFieldWithUnit
          key="liquidHeight"
          name="liquidHeight"
          label="Liquid Height"
          placeholder="0"
          selected={true}
          displayValue={{ value: liquidHeight, unit: resultsState.liquidHeight }}
          error=""
          unitType="length"
          focusText=""
          onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
          onChangeUnit={handleChangeResultsState}
        />
      </>
    </CalcCard>
  )
}

export const calculateHeadHeight = ({
  type,
  diameter,
  angle,
}: {
  type: keyof typeof tankHeadParameters
  diameter: number
  angle: number
}) => {
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

const tankVolumeByLevel = ({
  state,
  liquidHeight,
  bottomDishHeight,
  topDishHeight,
  totalHeight,
}: {
  state: State
  liquidHeight: number
  bottomDishHeight: number
  topDishHeight: number
  totalHeight: number
}) => {
  const diameter = state.diameter.calculatedValue.value
  const bottomConeAngle = state.bottomConeAngle.calculatedValue.value

  const calculateBottomRegionVolume = (): number => {
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
      return calculateASMEVolumebyHeight(state, liquidHeight, totalHeight, false)
    }
  }

  const calculateCylinderRegionVolume = () => {
    const cylinderHeight = liquidHeight - bottomDishHeight - topDishHeight
    const yBottom = bottomDishHeight
    const yTop = totalHeight - topDishHeight

    if (liquidHeight < yBottom) return 0 //liquid is below cylinder
    else if (liquidHeight > yTop)
      return volumeOfCylinder({ diameter: diameter, height: cylinderHeight }) //liquid is above cylinder
    else return volumeOfCylinder({ diameter: diameter, height: liquidHeight - yBottom }) //liquid is in cylinder
  }

  const calculateTopRegionVolume = () => {
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
      return calculateASMEVolumebyHeight(state, liquidHeight, totalHeight, true)
    }
  }

  const bottomVolume = calculateBottomRegionVolume()
  const middleVolume = calculateCylinderRegionVolume()
  const topVolume = calculateTopRegionVolume()

  console.table({ bottomVolume, middleVolume, topVolume })

  return bottomVolume + middleVolume + topVolume
}

export default Tank
