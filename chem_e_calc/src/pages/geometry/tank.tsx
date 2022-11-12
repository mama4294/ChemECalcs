import { NextPage } from 'next'
import { useContext, useReducer } from 'react'
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

type Head = 'ellipsoidal (2:1)' | 'hemispherical' | 'ASME Dish' | 'flat' | 'conical'

type State = {
  orientation: 'vertical' | 'horizontal'
  head: Head
  bottom: Head
  diameter: ShortInputType
  height: ShortInputType
  liquidHeight: ShortInputType
  topConeAngle: ShortInputType
  bottomConeAngle: ShortInputType
}

const Vessel: NextPage = () => {
  const paths = [
    { title: 'Geometery', href: '/geometry' },
    { title: 'Vessel', href: '/geometry/tank' },
  ]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  const headTypes = [
    { value: 'ellipsoidal (2:1)', label: 'Ellipsoidal (2:1)' },
    { value: 'hemisphere', label: 'Hemisphere' },
    { value: 'ASME Dish', label: 'ASME Dish' },
    { value: 'flat', label: 'Flat' },
    { value: 'conical', label: 'Conical' },
  ]

  type StateData = Omit<State, 'orientation' | 'head' | 'bottom'>

  const initialState: State = {
    orientation: 'vertical',
    head: 'flat',
    bottom: 'ASME Dish',
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
      focusText: 'Enter vessel diameter',
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
        return calculateAnswer({ ...state, [name]: payloadWithCalculatedValue })
      case ActionKind.CHANGE_UNIT:
        name = action.payload.name
        const existingValue = state[name as keyof StateData].displayValue.value
        payload = {
          ...state[name as keyof StateData],
          displayValue: { value: existingValue, unit: action.payload.value },
        }
        payloadWithCalculatedValue = updateCalculatedValue(payload)
        return calculateAnswer({ ...state, [name]: payloadWithCalculatedValue })
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

  const calculateAnswer = (state: State) => {
    // const { diameter, shaftSpeed, liquidHeight } = state
    // const answer = (diameter.calculatedValue.value * shaftSpeed.calculatedValue.value * Math.PI) / 60 // m/s
    // const convertedAnswer = convertUnits({
    //   value: answer,
    //   fromUnit: 'm/s',
    //   toUnit: liquidHeight.displayValue.unit,
    // })
    // const answerObj = {
    //   ...liquidHeight,
    //   displayValue: { value: convertedAnswer.toLocaleString(), unit: liquidHeight.displayValue.unit }, //user specified unit
    //   calculatedValue: { value: answer, unit: 'm/s' }, //m/s
    // }
    return state
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
              {head === 'conical' && (
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
              {bottom === 'conical' && (
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
              {/* <InputFieldWithUnit
                key={liquidHeight.name}
                name={liquidHeight.name}
                label={liquidHeight.label}
                placeholder={liquidHeight.placeholder}
                selected={false}
                displayValue={liquidHeight.displayValue}
                error={liquidHeight.error}
                unitType={liquidHeight.unitType}
                focusText={liquidHeight.focusText}
                onChangeValue={handleChangeValue}
                onChangeUnit={handleChangeUnit}
              /> */}
            </div>
          </>
        </CalcCard>
        <ResultsCard state={state} />
      </CalcBody>
    </PageContainer>
  )
}

type ResultsCard = {
  state: State
}

const ResultsCard = ({ state }: ResultsCard) => {
  const { diameter, height } = state

  const volumeShell = (Math.PI * Math.pow(diameter.calculatedValue.value, 2) * height.calculatedValue.value) / 4 //m3

  const totalVolume = volumeShell

  return (
    <CalcCard title={'Results'}>
      <InputFieldWithUnit
        key="volume"
        name="volume"
        label="Tank Volume"
        placeholder="0"
        selected={true}
        displayValue={{ value: totalVolume.toLocaleString(), unit: 'gal' }}
        error=""
        unitType="volume"
        focusText=""
        onChangeValue={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
        onChangeUnit={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e)}
      />
    </CalcCard>
  )
}
export default Vessel
