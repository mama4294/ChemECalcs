import { useReducer } from 'react'
import { ShortInputType } from '../types'
import { updateCalculatedValue } from './logic'

export enum ActionKind {
  CHANGE_VALUE = 'CHANGE_VALUE',
  CHANGE_SOLVE_SELECTION = 'CHANGE_SOLVE_SELECTION',
  REFRESH = 'REFRESH',
}

type Action<SolveOptionsT> =
  | {
      type: ActionKind.CHANGE_SOLVE_SELECTION
      payload: SolveOptionsT
    }
  | {
      type: ActionKind.CHANGE_VALUE
      payload: ShortInputType
    }
  | {
      type: ActionKind.REFRESH
    }

type State<T> = T

export function useGeomentryStateReducer<SolveOptionsT, DataT>(
  initialState: State<DataT>,
  calculation: (state: State<DataT>) => State<DataT>
) {
  function stateReducer(state: State<DataT>, action: Action<SolveOptionsT>): State<DataT> {
    switch (action.type) {
      case ActionKind.CHANGE_SOLVE_SELECTION:
        return {
          ...state,
          solveSelection: action.payload,
        }
      case ActionKind.CHANGE_VALUE:
        const payloadWithCalculatedValue = updateCalculatedValue(action.payload)
        return calculation({ ...state, [action.payload.name]: payloadWithCalculatedValue }) //calculate answer state
      case ActionKind.REFRESH:
        return calculation({ ...state }) //calculate answer state
      default:
        const neverEver: never = action
        console.error('Error: State reducer action not recognized', neverEver)
        return state
    }
  }
  return useReducer(stateReducer, initialState)
}
