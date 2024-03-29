import { useContext, useEffect } from 'react'
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
import { InputFieldWithUnit } from '../../components/inputs/inputField'
import { SolveForDropdown } from '../../components/inputs/solveForDropdown'
import {
  ActionKind,
  handleChangeSolveSelection,
  handleChangeUnit,
  handleChangeValue,
  useGeomentryStateReducer,
} from '../../logic/geometry'
import { IconSphereUnits } from '../../icons/iconSphereUnits'
import ShapeContainer from '../../components/3D shapes/DyanmicShapes'
import { Sphere3D } from '../../components/3D shapes/StaticShapes'

const Shape = () => {
  const paths = [
    { title: 'Geometry', href: '/geometry' },
    { title: 'Sphere', href: '/geometry/sphere' },
  ]

  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  type SolveSelectionOptions = 'diameter' | 'volume'
  type StateWithoutSolveSelection = Omit<State, 'solveSelection'>

  type State = {
    solveSelection: SolveSelectionOptions
    diameter: ShortInputType
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
      focusText: 'Enter diameter (D)',
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
    { label: initialState.volume.label, value: initialState.volume.name },
  ]

  const calculateAnswerState = (inputArray: State): State => {
    const solveSelection = inputArray.solveSelection
    console.log(solveSelection)
    console.log(inputArray)
    if (solveSelection === 'volume') return calcVolume(inputArray)
    if (solveSelection === 'diameter') return calcDiameter(inputArray)
    return state
  }

  const calcVolume = (inputArray: State): State => {
    const diameter = inputArray.diameter.calculatedValue.value
    const volume = (4 / 3) * Math.PI * (diameter / 2) ** 3
    const displayValue = convertUnits({ value: volume, fromUnit: 'm3', toUnit: inputArray.volume.displayValue.unit })
    const volumeObj = {
      ...inputArray.volume,
      calculatedValue: { value: volume, unit: 'm3' },
      displayValue: { value: displayValue.toLocaleString(), unit: inputArray.volume.displayValue.unit },
    }

    return { ...inputArray, volume: volumeObj }
  }

  const calcDiameter = (inputArray: State): State => {
    const volume = inputArray.volume.calculatedValue.value
    const diameter = 2 * (volume / ((4 / 3) * Math.PI)) ** (1 / 3)
    const displayValue = convertUnits({ value: diameter, fromUnit: 'm', toUnit: inputArray.diameter.displayValue.unit })
    const diameterObj = {
      ...inputArray.diameter,
      calculatedValue: { value: diameter, unit: 'm' },
      displayValue: { value: displayValue.toLocaleString(), unit: inputArray.diameter.displayValue.unit },
    }

    return { ...inputArray, diameter: diameterObj }
  }

  const [state, dispatch] = useGeomentryStateReducer<SolveSelectionOptions, State>(initialState, calculateAnswerState)

  useEffect(() => {
    //refresh calculated answer on initial page load
    dispatch({ type: ActionKind.REFRESH })
  }, [dispatch])

  return (
    <>
      <Metadata
        title="Sphere"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="sphere, volume, lenght, width, height, calculator, chemical engineering, process engineering, chemical engineering calculations, process engineering calculations"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Sphere'} text={'This calculates the volume of a sphere'} />
        <CalcBody>
          <CalcCard title="Calculator">
            <>
              <SolveForDropdown
                options={solveForOptions}
                selection={state.solveSelection}
                onChange={handleChangeSolveSelection<SolveSelectionOptions>(dispatch)}
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
          <CalcCard title="Sphere">
            <div className="h-[500px]">
              <ShapeContainer>
                <Sphere3D />
              </ShapeContainer>
            </div>
          </CalcCard>
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default Shape
