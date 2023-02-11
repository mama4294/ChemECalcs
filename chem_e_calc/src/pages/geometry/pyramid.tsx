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
import {
  handleChangeSolveSelection,
  handleChangeUnit,
  handleChangeValue,
  useGeomentryStateReducer,
} from '../../logic/geometry'
import { IconPyramidUnits } from '../../icons/iconPyramidUnits'

const Pyramid = () => {
  const paths = [
    { title: 'Geometry', href: '/geometry' },
    { title: 'Pyramid', href: '/geometry/pyramid' },
  ]

  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  type SolveSelectionOptions = 'width' | 'length' | 'height' | 'volume'
  type StateWithoutSolveSelection = Omit<State, 'solveSelection'>

  type State = {
    solveSelection: SolveSelectionOptions
    width: ShortInputType
    height: ShortInputType
    length: ShortInputType
    volume: ShortInputType
  }

  const initialState: State = {
    solveSelection: 'volume',
    width: {
      name: 'width',
      label: 'Width',
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
      focusText: 'Enter width (w)',
      error: '',
    },
    length: {
      name: 'length',
      label: 'Length',
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
      focusText: 'Enter length (l)',
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
      displayValue: { value: '1', unit: defaultUnits.volume },
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
    { label: initialState.width.label, value: initialState.width.name },
    { label: initialState.length.label, value: initialState.length.name },
    { label: initialState.height.label, value: initialState.height.name },
    { label: initialState.volume.label, value: initialState.volume.name },
  ]

  const calculateAnswerState = (inputArray: State): State => {
    console.log('Calculating Answer')
    const solveSelection = inputArray.solveSelection
    if (solveSelection === 'volume') return calcVolume(inputArray)
    if (solveSelection === 'height') return calcHeight(inputArray)
    if (solveSelection === 'width') return calcWidth(inputArray)
    if (solveSelection === 'length') return calcLength(inputArray)
    return state
  }

  const calcVolume = (inputArray: State): State => {
    const width = inputArray.width.calculatedValue.value
    const length = inputArray.length.calculatedValue.value
    const height = inputArray.height.calculatedValue.value
    const volume = (width * length * height) / 3

    const displayValue = convertUnits({ value: volume, fromUnit: 'm3', toUnit: inputArray.volume.displayValue.unit })
    const volumeObj = {
      ...inputArray.volume,
      calculatedValue: { value: volume, unit: 'm3' },
      displayValue: { value: displayValue.toLocaleString(), unit: inputArray.volume.displayValue.unit },
    }

    return { ...inputArray, volume: volumeObj }
  }

  const calcHeight = (inputArray: State): State => {
    const width = inputArray.width.calculatedValue.value
    const length = inputArray.length.calculatedValue.value
    const volume = inputArray.volume.calculatedValue.value
    const height = (3 * volume) / (width * length)

    const displayValue = convertUnits({ value: height, fromUnit: 'm', toUnit: inputArray.height.displayValue.unit })
    const heightObj = {
      ...inputArray.height,
      calculatedValue: { value: height, unit: 'm' },
      displayValue: { value: displayValue.toLocaleString(), unit: inputArray.height.displayValue.unit },
    }

    return { ...inputArray, height: heightObj }
  }

  const calcWidth = (inputArray: State): State => {
    const height = initialState.height.calculatedValue.value
    const length = initialState.length.calculatedValue.value
    const volume = initialState.volume.calculatedValue.value

    const width = (3 * volume) / (height * length)
    const displayValue = convertUnits({ value: width, fromUnit: 'm', toUnit: inputArray.width.displayValue.unit })
    const widthObj = {
      ...inputArray.width,
      calculatedValue: { value: width, unit: 'm' },
      displayValue: { value: displayValue.toLocaleString(), unit: inputArray.width.displayValue.unit },
    }

    return { ...inputArray, width: widthObj }
  }

  const calcLength = (inputArray: State): State => {
    const height = inputArray.height.calculatedValue.value
    const width = inputArray.width.calculatedValue.value
    const volume = inputArray.volume.calculatedValue.value
    const length = (3 * volume) / (height * width)

    const displayValue = convertUnits({ value: length, fromUnit: 'm', toUnit: inputArray.length.displayValue.unit })
    const lengthObj = {
      ...inputArray.length,
      calculatedValue: { value: length, unit: 'm' },
      displayValue: { value: displayValue.toLocaleString(), unit: inputArray.length.displayValue.unit },
    }

    return { ...inputArray, length: lengthObj }
  }

  const [state, dispatch] = useGeomentryStateReducer<SolveSelectionOptions, State>(initialState, calculateAnswerState)

  return (
    <>
      <Metadata
        title="Pyramid"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="pyramid, volume, lenght, width, height, calculator, chemical engineering, process engineering, chemical engineering calculations, process engineering calculations"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Pyramid'} text={'This calculates the volume of a pyramid'} />
        <CalcBody>
          <CalcCard title="Calculator">
            <>
              <SolveForDropdown
                options={solveForOptions}
                selection={state.solveSelection}
                onChange={handleChangeSolveSelection(dispatch)}
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
                        onChangeValue={handleChangeValue(state[name as keyof StateWithoutSolveSelection], dispatch)}
                        onChangeUnit={handleChangeUnit(state[name as keyof StateWithoutSolveSelection], dispatch)}
                      />
                    )
                  }
                })}
              </div>
            </>
          </CalcCard>
          <CalcCard title="Pyramid">
            <IconContainer>
              <IconPyramidUnits />
            </IconContainer>
          </CalcCard>
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default Pyramid
