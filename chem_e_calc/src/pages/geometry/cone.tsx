import { useContext } from 'react'
import { convertUnits } from '../../utils/units'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { IconContainer } from '../../icons/IconContainer'
import { DefaultUnitContext, DefaultUnitContextType } from '../../contexts/defaultUnitContext'
import { Metadata } from '../../components/Layout/Metadata'
import { ShortInputType } from '../../types'
import { InputFieldWithUnit } from '../../components/inputs/inputFieldObj'
import { SolveForDropdown } from '../../components/inputs/solveForObj'
import { ActionKind, useGeomentryStateReducer } from '../../logic/geometry'
import { IconConeUnits } from '../../icons/iconConeUnits'

const Box = () => {
  const paths = [
    { title: 'Geometry', href: '/geometry' },
    { title: 'Cone', href: '/geometry/cone' },
  ]

  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  type SolveSelectionOptions = 'diameter' | 'height' | 'volume'
  type StateWithoutSolveSelection = Omit<State, 'solveSelection'>

  type State = {
    solveSelection: SolveSelectionOptions
    diameter: ShortInputType
    height: ShortInputType
    volume: ShortInputType
  }

  const initialState: State = {
    solveSelection: 'volume',
    diameter: {
      name: 'diameter',
      label: 'Diameter',
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
      focusText: 'Enter diameter (d)',
      error: '',
    },
    height: {
      name: 'height',
      label: 'Height',
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
      focusText: 'Enter height (h)',
      error: '',
    },
    volume: {
      name: 'volume',
      label: 'Volume',
      placeholder: '0',
      unitType: 'volume',
      displayValue: { value: '0', unit: defaultUnits.volume },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'm3',
          }),
          unit: 'm3',
        }
      },
      selectiontext: '',
      focusText: 'Enter volume',
      error: '',
    },
  }

  const solveForOptions: { label: string; value: string }[] = [
    { label: initialState.diameter.label, value: initialState.diameter.name },
    { label: initialState.height.label, value: initialState.height.name },
    { label: initialState.volume.label, value: initialState.volume.name },
  ]

  const handleChangeSolveSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionKind.CHANGE_SOLVE_SELECTION, payload: e.target.value as SolveSelectionOptions })
  }

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericValue = value.replace(/[^\d.-]/g, '')
    const unit = state[name as keyof StateWithoutSolveSelection].displayValue.unit
    const payload = { ...state[name as keyof StateWithoutSolveSelection], displayValue: { value: numericValue, unit } }
    dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const existingValue = state[name as keyof StateWithoutSolveSelection].displayValue.value
    const payload = {
      ...state[name as keyof StateWithoutSolveSelection],
      displayValue: { value: existingValue, unit: value },
    }
    dispatch({ type: ActionKind.CHANGE_VALUE, payload })
  }

  const calculateAnswerState = (inputArray: State): State => {
    console.log('Calculating Answer')
    const solveSelection = inputArray.solveSelection
    if (solveSelection === 'volume') return calcVolume(inputArray)
    if (solveSelection === 'height') return calcHeight(inputArray)
    if (solveSelection === 'diameter') return calcDiameter(inputArray)
    return state
  }

  const calcVolume = (inputArray: State): State => {
    const diameter = inputArray.diameter.calculatedValue.value
    const height = inputArray.height.calculatedValue.value
    const volume = (Math.PI * (diameter / 2) ** 2 * height) / 3

    const displayValue = convertUnits({ value: volume, fromUnit: 'm3', toUnit: inputArray.volume.displayValue.unit })
    const volumeObj = {
      ...inputArray.volume,
      calculatedValue: { value: volume, unit: 'm3' },
      displayValue: { value: displayValue.toLocaleString(), unit: inputArray.volume.displayValue.unit },
    }

    return { ...inputArray, volume: volumeObj }
  }

  const calcHeight = (inputArray: State): State => {
    const diameter = inputArray.diameter.calculatedValue.value
    const volume = inputArray.volume.calculatedValue.value
    const height = (volume * 3) / (Math.PI * (diameter / 2) ** 2)

    const displayValue = convertUnits({ value: height, fromUnit: 'm', toUnit: inputArray.height.displayValue.unit })
    const heightObj = {
      ...inputArray.height,
      calculatedValue: { value: height, unit: 'm' },
      displayValue: { value: displayValue.toLocaleString(), unit: inputArray.height.displayValue.unit },
    }

    return { ...inputArray, height: heightObj }
  }

  const calcDiameter = (inputArray: State): State => {
    const height = initialState.height.calculatedValue.value
    const volume = initialState.volume.calculatedValue.value

    const diameter = Math.sqrt((volume * 3) / (height * Math.PI))

    const displayValue = convertUnits({ value: diameter, fromUnit: 'm', toUnit: inputArray.diameter.displayValue.unit })
    const diameterObj = {
      ...inputArray.diameter,
      calculatedValue: { value: diameter, unit: 'm' },
      displayValue: { value: displayValue.toLocaleString(), unit: inputArray.diameter.displayValue.unit },
    }

    return { ...inputArray, diameter: diameterObj }
  }

  const [state, dispatch] = useGeomentryStateReducer<SolveSelectionOptions, State>(initialState, calculateAnswerState)

  return (
    <>
      <Metadata
        title="Cone"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Cone, volume, lenght, width, height, calculator, chemical engineering, process engineering, chemical engineering calculations, process engineering calculations"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Cone'} text={'This calculates the volume of a cone'} />
        <CalcBody>
          <CalcCard title="Calculator">
            <>
              <SolveForDropdown
                options={solveForOptions}
                selection={state.solveSelection}
                onChange={handleChangeSolveSelection}
              />

              <div className="mb-8 flex flex-col">
                {(Object.keys(state) as (keyof State)[]).map(key => {
                  if (key != 'solveSelection') {
                    const { name, label, placeholder, displayValue, error, unitType, focusText } = state[key]
                    return (
                      <InputFieldWithUnit
                        key={name}
                        name={name}
                        label={label}
                        placeholder={placeholder}
                        selected={state.solveSelection === name}
                        displayValue={{ value: displayValue.value, unit: displayValue.unit }}
                        error={error}
                        unitType={unitType}
                        focusText={focusText}
                        onChangeValue={handleChangeValue}
                        onChangeUnit={handleChangeUnit}
                      />
                    )
                  }
                })}
              </div>
            </>
          </CalcCard>
          <CalcCard title="Cone">
            <IconContainer>
              <IconConeUnits />
            </IconContainer>
          </CalcCard>
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default Box
