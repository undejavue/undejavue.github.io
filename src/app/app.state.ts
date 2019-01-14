import {
    ActionReducer,
    Action,
    combineReducers,
    compose
} from '@ngrx/store';

import { environment } from './../environments/environment';
import { IPollutionState, getItems } from './store/pollutions/state';
import { pollutionReducer } from './store/pollutions/reducer';

import { storeFreeze } from 'ngrx-store-freeze';
import { createSelector } from 'reselect';

export interface AppState {
    pollutions: IPollutionState;
}

export type Reducer<T> = (state: T, action: Action) => T;

export const reducers = {
    pollutions: pollutionReducer
    // reports: ReportsReducer
};

const developmentReducer: ActionReducer<any> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}


   export const getPollutionState = (state: AppState) => state.pollutions.data;

   /**
    * Every reducer module exports selector functions, however child reducers
    * have no knowledge of the overall state tree. To make them useable, we
    * need to make new selectors that wrap them.
    *
    * The createSelector function from the reselect library creates
    * very efficient selectors that are memoized and only recompute when arguments change.
    * The created selectors can also be composed together to select different
    * pieces of state.
    */
    export const getPolutionItems = createSelector(getPollutionState, getItems);
