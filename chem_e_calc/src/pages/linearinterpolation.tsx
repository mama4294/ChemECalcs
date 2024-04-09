import { NextPage } from 'next'
import React, { useReducer } from 'react'
import { Breadcrumbs } from '../components/calculators/breadcrumbs'
import { CalcBody } from '../components/calculators/calcBody'
import { CalcCard } from '../components/calculators/calcCard'
import { PageContainer } from '../components/calculators/container'
import { CalcHeader } from '../components/calculators/header'
import { Equation, VariableDefinition } from '../components/Layout/Equation'
import { InputFieldConstant, InputSlider } from '../components/inputs/inputField'
import { Metadata } from '../components/Layout/Metadata'
import { linearInterpolation } from '../logic/logic'

type State = {
  xmin: string
  xmax: string
  x: string
  ymin: string
  ymax: string
  y: string
  xminError: string
  xmaxError: string
  yminError: string
  ymaxError: string
}

const Page: NextPage = () => {
  const paths = [{ title: 'Linear Interpolation', href: '/linearinterpolation' }]

  const initialState: State = {
    xmin: '0',
    xmax: '100',
    x: '50',
    ymin: '0',
    ymax: '150',
    y: '75',
    xminError: '',
    xmaxError: '',
    yminError: '',
    ymaxError: '',
  }

  type Action = {
    type:
      | ActionKind.CHANGE_Y
      | ActionKind.CHANGE_X
      | ActionKind.CHANGE_XMIN
      | ActionKind.CHANGE_XMAX
      | ActionKind.CHANGE_YMIN
      | ActionKind.CHANGE_YMAX
    payload: string
  }

  enum ActionKind {
    CHANGE_Y = 'CHANGE_Y',
    CHANGE_X = 'CHANGE_X',
    CHANGE_XMIN = 'CHANGE_XMIN',
    CHANGE_XMAX = 'CHANGE_XMAX',
    CHANGE_YMIN = 'CHANGE_YMIN',
    CHANGE_YMAX = 'CHANGE_YMAX',
  }

  const stateReducer = (state: State, action: Action) => {
    const input = Number(action.payload)
    const numXmin = Number(state.xmin)
    const numXmax = Number(state.xmax)
    const numYmin = Number(state.ymin)
    const numYmax = Number(state.ymax)

    switch (action.type) {
      case ActionKind.CHANGE_X:
        return {
          ...state,
          x: action.payload,
          y: linearInterpolation(input, numXmin, numXmax, numYmin, numYmax).toLocaleString(),
        }
      case ActionKind.CHANGE_Y:
        return {
          ...state,
          x: linearInterpolation(input, numYmin, numYmax, numXmin, numXmax).toLocaleString(),
          y: action.payload,
        }
      case ActionKind.CHANGE_XMIN:
        return {
          ...state,
          xmin: action.payload,
          y: linearInterpolation(Number(state.x), input, numXmax, numYmin, numYmax).toLocaleString(),
          xminError: isNaN(input) ? 'Must be a number' : '',
        }
      case ActionKind.CHANGE_XMAX:
        return {
          ...state,
          xmax: action.payload,
          y: linearInterpolation(Number(state.x), numXmin, input, numYmin, numYmax).toLocaleString(),
          xmaxError: isNaN(input) ? 'Must be a number' : '',
        }
      case ActionKind.CHANGE_YMIN:
        return {
          ...state,
          ymin: action.payload,
          x: linearInterpolation(Number(state.y), input, numYmax, numXmin, numXmax).toLocaleString(),
          yminError: isNaN(input) ? 'Must be a number' : '',
        }
      case ActionKind.CHANGE_YMAX:
        return {
          ...state,
          ymax: action.payload,
          x: linearInterpolation(Number(state.y), numYmin, input, numXmin, numXmax).toLocaleString(),
          ymaxError: isNaN(input) ? 'Must be a number' : '',
        }
      default:
        // const neverEver: never = action
        // console.error('Error: State reducer action not recognized', neverEver)
        return state
    }
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
      case 'x':
        return ActionKind.CHANGE_X
      case 'y':
        return ActionKind.CHANGE_Y
    }
  }

  const handleChangeRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const cleanedValue = value.replace(/[^\d.-]/g, '')
    const type = determineRangeType(name)
    if (type != undefined) dispatch({ type: type, payload: cleanedValue })
  }

  const determineRangeType = (name: string) => {
    switch (name) {
      case 'xmin':
        return ActionKind.CHANGE_XMIN
      case 'xmax':
        return ActionKind.CHANGE_XMAX
      case 'ymin':
        return ActionKind.CHANGE_YMIN
      case 'ymax':
        return ActionKind.CHANGE_YMAX
    }
  }

  return (
    <>
      <Metadata
        title="Linear Interpolation"
        description="Chemical engineering calculations for process and plant engineers"
        keywords="Fluid Dynamics, chemical, engineering, home, calculator, unit, conversion, geometry, fluid, dynamics, tank, volume, agitation, scaleup, efficiency, accuracy, process, engineers"
      />

      <PageContainer>
        <Breadcrumbs paths={paths} />
        <CalcHeader
          title={'Linear Interpolation'}
          text={
            'Linear interpolation is a method used to estimate a new value by connecting two known values on a straight line. It’s particularly useful when you have two known points, and you need to find a value between them.'
          }
        />
        <CalcBody>
          <CalcCard title={'Calculator'}>
            <div className="mb-8 flex flex-col">
              <InputSlider
                name="x"
                label="X"
                error=""
                value={state.x}
                onChange={handleChangeValue}
                min={state.xmin}
                max={state.xmax}
                unit=""
                step="0.1"
              />
              <InputSlider
                name="y"
                label="Y"
                error=""
                value={state.y}
                onChange={handleChangeValue}
                min={state.ymin}
                max={state.ymax}
                unit={''}
                step="0.1"
              />
              <div className="flex flex-row justify-between">
                <InputFieldConstant
                  name="xmin"
                  label="X1"
                  placeholder="0"
                  selected={false}
                  displayValue={{ value: state.xmin, unit: '' }}
                  focusText=""
                  error={state.xminError}
                  onChangeValue={handleChangeRange}
                />
                <InputFieldConstant
                  name="xmax"
                  label="X2"
                  placeholder="0"
                  selected={false}
                  displayValue={{ value: state.xmax, unit: '' }}
                  focusText=""
                  error={state.xmaxError}
                  onChangeValue={handleChangeRange}
                />
              </div>
              <div className="flex flex-row justify-between">
                <InputFieldConstant
                  name="ymin"
                  label="Y1"
                  placeholder="0"
                  selected={false}
                  displayValue={{ value: state.ymin, unit: '' }}
                  focusText=""
                  error={state.yminError}
                  onChangeValue={handleChangeRange}
                />
                <InputFieldConstant
                  name="ymax"
                  label="Y2"
                  placeholder="0"
                  selected={false}
                  displayValue={{ value: state.ymax, unit: '' }}
                  focusText=""
                  error={state.ymaxError}
                  onChangeValue={handleChangeRange}
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
          <span className="font-bold">Find the slope:</span> Calculate the slope of the line connecting the two known
          points. The slope is the rate at which y changes with respect to x.
        </p>
        <p className="mb-2 ">
          <span className="font-bold">Apply the Slope:</span> Apply this slope to find out how much y should change when
          x changes from x1 to your point of interest.
        </p>
        <p className="mb-2 ">
          <span className="font-bold">Adjust for Starting Point:</span> Add this change to y1, the y value at your
          starting point, to find the estimated y value at your point of interest.
        </p>
        <p className="mb-2 font-semibold">Equation </p>
        <div className="mb-4">
          <Equation equation={`$$y = y_{1} + \\frac{x - x_1}{x_2 - x_1} * \\left( y_2 - y_1 \\right) $$`} />
        </div>

        <div className="mb-2">
          <VariableDefinition equation={`$$y_{1} = $$`} definition="Known Y min" />
          <VariableDefinition equation={`$$y_{2} = $$`} definition="Known Y max" />
          <VariableDefinition equation={`$$x_{1} = $$`} definition="Known X min" />
          <VariableDefinition equation={`$$x_{2} = $$`} definition="Known X max" />
        </div>
      </>
    </CalcCard>
  )
}
