import { NextPage } from 'next'
import React, { useContext, useEffect, useReducer } from 'react'
import { Breadcrumbs } from '../../components/calculators/breadcrumbs'
import { CalcBody } from '../../components/calculators/calcBody'
import { CalcCard } from '../../components/calculators/calcCard'
import { PageContainer } from '../../components/calculators/container'
import { CalcHeader } from '../../components/calculators/header'
import { Equation, VariableDefinition } from '../../components/Layout/Equation'
import { InputFieldWithUnit } from '../../components/inputs/inputField'
import { Metadata } from '../../components/Layout/Metadata'
import { DefaultUnitContext, DefaultUnitContextType } from '../../contexts/defaultUnitContext'
import { updateCalculatedValue } from '../../logic/logic'
import { ShortInputType } from '../../types'
import { convertUnits } from '../../utils/units'

//TODO add equations

type SolveSelectionOptions = 'velocity' | 'outerDiameter' | 'volumeFlowRate'

type State = {
  solveSelection: SolveSelectionOptions
  volumeFlowRate: ShortInputType
  outerDiameter: ShortInputType
  thickness: ShortInputType
  velocity: ShortInputType
}

type StateWithoutSolveSelection = Omit<State, 'solveSelection'>

const resetErrorMessages = (state: State): State => {
  return {
    ...state,
    volumeFlowRate: { ...state.volumeFlowRate, error: '' },
    outerDiameter: { ...state.outerDiameter, error: '' },
    thickness: { ...state.thickness, error: '' },
    velocity: { ...state.velocity, error: '' },
  }
}

const calculateAnswer = (state: State): State => {
  const { velocity, thickness, outerDiameter, volumeFlowRate } = state
  const inputVelocity = velocity.calculatedValue.value //m/s
  const inputThickness = thickness.calculatedValue.value //m
  const inputDiameter = outerDiameter.calculatedValue.value //m
  const inputFlowrate = volumeFlowRate.calculatedValue.value //m3/s
  let validatedState = resetErrorMessages(state)

  switch (state.solveSelection) {
    case 'volumeFlowRate':
      if (inputDiameter <= inputThickness * 2) {
        validatedState = { ...validatedState, thickness: { ...validatedState.thickness, error: 'Thickness too large' } }
      }
      if (inputDiameter < 0) {
        validatedState = {
          ...validatedState,
          outerDiameter: { ...validatedState.outerDiameter, error: 'Diameter must be positive' },
        }
      }
      if (inputThickness < 0) {
        validatedState = {
          ...validatedState,
          thickness: { ...validatedState.thickness, error: 'Thickness must be positive' },
        }
      }
      let innerDiameter = inputDiameter - 2 * inputThickness //m
      let area = Math.PI * (innerDiameter / 2) ** 2 //m2
      let answer = inputVelocity * area //m3/s

      let updatedAnswer = updatedisplayValue({
        ...volumeFlowRate,
        calculatedValue: { value: answer, unit: volumeFlowRate.calculatedValue.unit },
      })

      return {
        ...validatedState,
        volumeFlowRate: updatedAnswer,
      }
    case 'velocity':
      if (inputDiameter <= inputThickness * 2) {
        validatedState = { ...validatedState, thickness: { ...validatedState.thickness, error: 'Thickness too large' } }
      }
      if (inputDiameter < 0) {
        validatedState = {
          ...validatedState,
          outerDiameter: { ...validatedState.outerDiameter, error: 'Diameter must be positive' },
        }
      }
      if (inputThickness < 0) {
        validatedState = {
          ...validatedState,
          thickness: { ...validatedState.thickness, error: 'Thickness must be positive' },
        }
      }
      innerDiameter = inputDiameter - 2 * inputThickness //m
      area = Math.PI * (innerDiameter / 2) ** 2 //m2
      answer = inputFlowrate / area //m/2

      updatedAnswer = updatedisplayValue({
        ...velocity,
        calculatedValue: { value: answer, unit: velocity.calculatedValue.unit },
      })

      return {
        ...validatedState,
        velocity: updatedAnswer,
      }
    case 'outerDiameter':
      area = inputFlowrate / inputVelocity //m2
      innerDiameter = 2 * Math.sqrt(area / Math.PI) //m
      answer = innerDiameter + 2 * inputThickness //m

      if (inputThickness < 0) {
        validatedState = {
          ...validatedState,
          thickness: { ...validatedState.thickness, error: 'Thickness must be positive' },
        }
      }

      updatedAnswer = updatedisplayValue({
        ...outerDiameter,
        calculatedValue: { value: answer, unit: outerDiameter.calculatedValue.unit },
      })

      return {
        ...validatedState,
        outerDiameter: updatedAnswer,
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
    velocity: {
      name: 'velocity',
      label: 'Velocity',
      placeholder: '0',
      unitType: 'speed',
      displayValue: { value: '5', unit: defaultUnits.speed },
      get calculatedValue() {
        return {
          value: convertUnits({
            value: Number(this.displayValue.value),
            fromUnit: this.displayValue.unit,
            toUnit: 'm/s',
          }),
          unit: 'm/s',
        }
      },
      selectiontext: 'Solve for fluid velocity',
      focusText: 'Enter fluid velocity',
      error: '',
    },
    outerDiameter: {
      name: 'outerDiameter',
      label: 'Outer Diameter',
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
      selectiontext: 'Solve for outer diameter',
      focusText: 'Enter pipe outer diameter',
      error: '',
    },
    thickness: {
      name: 'thickness',
      label: 'Pipe Thickness',
      placeholder: '0',
      unitType: 'length',
      displayValue: { value: '0.065', unit: defaultUnits.length },
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
      selectiontext: 'Solve for thickness',
      focusText: 'Enter pipe wall thickness',
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
      selectiontext: 'Solve for flowrate',
      focusText: 'Enter fluid flowrate',
      error: '',
    },
  }

  const solveForOptions: SolveType[] = [
    { label: initialState.volumeFlowRate.label, value: initialState.volumeFlowRate.name },
    { label: initialState.velocity.label, value: initialState.velocity.name },
    { label: initialState.outerDiameter.label, value: initialState.outerDiameter.name },
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
        title="Fluid Flow Calculator"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Fluid, flow, pipe, velocity, diameter, thickness, flowrate, calculator, chemical, engineering, process, engineer, efficiency, accuracy"
      />
      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader title={'Fluid Flow'} text={'Calculate the fluid velocity in a pipe'} />
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
          {/* <ExampleCard data={state} /> */}
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
// const ExampleCard = ({ data }: State) => {
//   const { velocity, outerDiameter, thickness, flowrate } = data
//   return (
//     <CalcCard title="Calculation">
//       <>
//         <p className="text-sm">Convert Units</p>
//         <>
//           <InlineEquation equation={`$$d_{o} = $$`} />
//           <p className="inline">
//             <span className="text-accent"> {outerDiameter.displayValue.value}</span> {outerDiameter.displayValue.unit} =
//           </p>
//           <p className="inline">
//             <span className="text-accent"> {outerDiameter.calculatedValue.value}</span>{' '}
//             {outerDiameter.calculatedValue.unit}
//           </p>
//         </>
//         <Equation equation={`$$Q = 222$$`} />
//         <Equation equation={`$$x_{t} = 222$$`} />
//         <p>Calculate inner pipe diameter</p>
//         <Equation equation={`$$d_{i} = d_{0} - 2x_{w}$$`} />
//         <Equation equation={`$$d_{i} = 1.5 - \\left(2 \\right) 0.0065$$`} />
//         <Equation equation={`$$d_{i} = 1.3004$$`} />
//         <p>Calculate inner pipe area</p>
//         <Equation equation={`$$A_{i} = \\pi{r_{i}^{2}}$$`} />
//         <Equation equation={`$$A_{i} = \\pi{\\frac{d_{i}}{2}^{2}}$$`} />
//         <Equation equation={`$$A_{i} = \\pi{\\frac{1.3004}{2}^{2}}$$`} />
//         <Equation equation={`$$A_{i} = 1.22933$$`} />
//         <p>Calculate fluid velocity</p>
//         <Equation equation={`$$v = Q/A_{i}$$`} />
//         <Equation equation={`$$v = 1.24/1.222$$`} />
//         <Equation equation={`$$v = 1.00$$`} />
//         <p>Convert Units</p>
//         <Equation equation={`$$v = 78.00 lpm$$`} />
//       </>
//     </CalcCard>
//   )
// }
