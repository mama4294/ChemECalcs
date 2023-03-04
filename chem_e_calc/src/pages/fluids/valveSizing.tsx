import { NextPage } from 'next'
import React, { useContext, useEffect, useReducer } from 'react'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { Equation, VariableDefinition } from '../../components/Equation'
import { InputFieldWithUnit } from '../../components/inputs/inputField'
import { Metadata } from '../../components/Layout/Metadata'
import { DefaultUnitContext, DefaultUnitContextType } from '../../contexts/defaultUnitContext'
import { updateCalculatedValue } from '../../logic/logic'
import { ShortInputType } from '../../types'
import { convertUnits } from '../../utils/units'

//TODO add equations

type SolveSelectionOptions = 'volumeFlowRate' | 'flowCoefficient' | 'pressureDrop'

type State = {
  solveSelection: SolveSelectionOptions
  volumeFlowRate: ShortInputType
  specificGravity: ShortInputType
  flowCoefficient: ShortInputType
  pressureDrop: ShortInputType
}

type StateWithoutSolveSelection = Omit<State, 'solveSelection'>

const resetErrorMessages = (state: State): State => {
  return {
    ...state,
    volumeFlowRate: { ...state.volumeFlowRate, error: '' },
    specificGravity: { ...state.specificGravity, error: '' },
    flowCoefficient: { ...state.flowCoefficient, error: '' },
    pressureDrop: { ...state.pressureDrop, error: '' },
  }
}

const calculateAnswer = (state: State): State => {
  const { pressureDrop, flowCoefficient, specificGravity, volumeFlowRate } = state
  const inputPressureDrop = pressureDrop.calculatedValue.value //Pa
  const inputFlowCoefficient = flowCoefficient.calculatedValue.value //Cv
  const inputSpecificGravity = specificGravity.calculatedValue.value //unitless
  const inputFlowrate = volumeFlowRate.calculatedValue.value //m3/s
  const gravitationalConstant = 9.81 //m/s2
  let validatedState = resetErrorMessages(state)

  //Validate inputs
  if (inputPressureDrop < 0) {
    validatedState = {
      ...validatedState,
      pressureDrop: { ...validatedState.pressureDrop, error: 'Pressure drop must be positive' },
    }
  }
  if (inputFlowCoefficient < 0) {
    validatedState = {
      ...validatedState,
      flowCoefficient: { ...validatedState.flowCoefficient, error: 'Flow coefficient must be positive' },
    }
  }

  if (inputSpecificGravity < 0) {
    validatedState = {
      ...validatedState,
      volumeFlowRate: { ...validatedState.specificGravity, error: 'Flow rate must be positive' },
    }
  }

  if (inputFlowrate < 0) {
    validatedState = {
      ...validatedState,
      volumeFlowRate: { ...validatedState.volumeFlowRate, error: 'Flow rate must be positive' },
    }
  }

  switch (state.solveSelection) {
    case 'flowCoefficient':
      let answer = inputFlowrate / Math.sqrt(inputPressureDrop / gravitationalConstant)

      let updatedAnswer = updatedisplayValue({
        ...flowCoefficient,
        calculatedValue: { value: answer, unit: flowCoefficient.calculatedValue.unit },
      })

      return {
        ...validatedState,
        flowCoefficient: updatedAnswer,
      }
    case 'volumeFlowRate':
      answer = inputFlowCoefficient * Math.sqrt(inputPressureDrop / gravitationalConstant)

      updatedAnswer = updatedisplayValue({
        ...volumeFlowRate,
        calculatedValue: { value: answer, unit: volumeFlowRate.calculatedValue.unit },
      })

      return {
        ...validatedState,
        volumeFlowRate: updatedAnswer,
      }

    case 'pressureDrop':
      answer = (inputFlowrate / inputFlowCoefficient ** 2) * gravitationalConstant

      updatedAnswer = updatedisplayValue({
        ...pressureDrop,
        calculatedValue: { value: answer, unit: pressureDrop.calculatedValue.unit },
      })

      return {
        ...validatedState,
        pressureDrop: updatedAnswer,
      }

    default:
      const neverEver: never = state.solveSelection
      console.error('Error: State reducer action not recognized, ', neverEver)
      return state
  }
}

const updatedisplayValue = (object: ShortInputType): ShortInputType => {
  const { calculatedValue, displayValue } = object
  const convertedValue = convertUnits({
    value: calculatedValue.value,
    fromUnit: calculatedValue.unit,
    toUnit: displayValue.unit,
  })
  return {
    ...object,
    displayValue: { value: convertedValue.toLocaleString(), unit: displayValue.unit },
  }
}

const UnitConversion: NextPage = () => {
  const paths = [
    { title: 'Fluid Dynamics', href: '/fluids/' },
    { title: 'Fluid Flow', href: '/fluids/fluidflow' },
  ]
  const { defaultUnits } = useContext(DefaultUnitContext) as DefaultUnitContextType

  const initialState: State = {
    solveSelection: 'volumeFlowRate',
    pressureDrop: {
      name: 'pressureDrop',
      label: 'Pressure Drop',
      placeholder: '0',
      unitType: 'pressure',
      displayValue: { value: '10', unit: defaultUnits.pressure },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'Pa',
          }),
          unit: 'Pa',
        }
      },
      selectiontext: '',
      focusText: 'Enter the pressure differential',
      error: '',
    },
    specificGravity: {
      name: 'specificGravity',
      label: 'Specific Gravity',
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
      focusText: 'Enter fluid specific gravity',
      error: '',
    },
    flowCoefficient: {
      name: 'flowCoefficient',
      label: 'Flow Coefficient',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '12', unit: defaultUnits.length },
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
      focusText: 'Enter valve flow coefficient',
      error: '',
    },
    volumeFlowRate: {
      name: 'volumeFlowRate',
      label: 'Flowrate',
      placeholder: '0',
      unitType: 'volumeFlowRate',
      displayValue: { value: '0', unit: defaultUnits.volumeFlowRate },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'm3/s',
          }),
          unit: 'm3/s',
        }
      },
      selectiontext: '',
      focusText: 'Enter fluid flowrate',
      error: '',
    },
  }

  const solveForOptions: SolveType[] = [
    { label: initialState.volumeFlowRate.label, value: initialState.volumeFlowRate.name },
    { label: initialState.pressureDrop.label, value: initialState.pressureDrop.name },
    { label: initialState.flowCoefficient.label, value: initialState.flowCoefficient.name },
  ]

  type Action =
    | {
        type: ActionKind.CHANGE_SOLVE_SELECTION
        payload: SolveSelectionOptions
      }
    | {
        type: ActionKind.CHANGE_VALUE
        payload: ShortInputType
      }
    | {
        type: ActionKind.REFRESH
      }

  enum ActionKind {
    CHANGE_VALUE = 'CHANGE_VALUE',
    CHANGE_SOLVE_SELECTION = 'CHANGE_SOLVE_SELECTION',
    REFRESH = 'REFRESH',
  }

  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case ActionKind.CHANGE_SOLVE_SELECTION:
        return {
          ...state,
          solveSelection: action.payload,
        }
      case ActionKind.CHANGE_VALUE:
        const payloadWithCalculatedValue = updateCalculatedValue(action.payload)
        return calculateAnswer({ ...state, [action.payload.name]: payloadWithCalculatedValue })
      case ActionKind.REFRESH:
        return calculateAnswer({ ...state })
      default:
        const neverEver: never = action
        console.error('Error: Fluid Flow State reducer action not recognized', neverEver)
        return state
    }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

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

  //Solve answer on initial page load
  useEffect(() => {
    const refresh = () => {
      console.log('Refreshing')
      dispatch({ type: ActionKind.REFRESH })
    }
    refresh()
  }, [])

  return (
    <>
      <Metadata
        title="Valve Sizing"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Fluid, flow, pipe, velocity, diameter, thickness, flowrate, calculator, chemical, engineering, process, engineer, efficiency, accuracy"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Valve Sizing'} text={'Calculate the CV or KV for a valve in a liquid application'} />
        <CalcBody>
          <CalcCard title={'Calculator'}>
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
          <EquationCard />
        </CalcBody>
      </PageContainer>
    </>
  )
}

export default UnitConversion

type SolveType = {
  label: string
  value: string
}

type SolveForDropdown = {
  selection: string
  options: SolveType[]
  onChange: any
}

const SolveForDropdown = ({ selection, options, onChange }: SolveForDropdown) => {
  return (
    <div className="form-control mb-2 w-full">
      <label className="label">
        <span className="label-text">Solve for</span>
      </label>

      <select className="select input-bordered w-full" value={selection} onChange={onChange}>
        {options.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

const EquationCard = () => {
  return (
    <CalcCard title="Governing Equation">
      <>
        <p>
          This calculator finds the velocity of fluid in a pipe. This is useful for more advanced calculations like
          determining the Reynolds number and pressure drop through a system. The governing equation is a function of
          flow rate and pipe geometery
        </p>
        <Equation equation={`$$v = Q/A_{i}$$`} />
        <p>The following equations are used to find the pipe geometery:</p>
        <Equation equation={`$$d_{i} = d_{0} - 2x_{w}$$`} />
        <Equation equation={`$$r_{i} = d_{i}/2$$`} />
        <Equation equation={`$$A_{i} = \\pi{r_{i}^{2}}$$`} />
        <p className="text-lg font-medium">Definitions</p>
        <VariableDefinition equation={`$$v = $$`} definition="Fluid velocity" />
        <VariableDefinition equation={`$$Q = $$`} definition="Fluid volumentric flow rate" />
        <VariableDefinition equation={`$$A_{i} = $$`} definition="Inner pipe area" />
        <VariableDefinition equation={`$$d_{i} = $$`} definition="Inner pipe diameter" />
        <VariableDefinition equation={`$$d_{o} = $$`} definition="Inner pipe diameter" />
        <VariableDefinition equation={`$$r_{i} = $$`} definition="Inner pipe radius" />
      </>
    </CalcCard>
  )
}
