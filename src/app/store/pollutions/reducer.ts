import { IPollutionState } from './state';
import { Reducer } from '../../app.state';
import * as actions from './actions';

type Action = actions.All;

export const pollutionReducer: Reducer<IPollutionState> = (state: IPollutionState = new IPollutionState(), action: Action) => {

    switch (action.type) {
        case actions.GET_CURRENT_VALUES_ACTION: {
            return {
                ...state,
                data: {
                    ...state.data,
                    loading: true,
                    error: false
                }
            };
        }

        case actions.GET_CURRENT_VALUES_ACTION_SUCCESS: {
            const byId = {...state.data.byId};
            byId[action.objectId] = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    byId,
                    loading: false,
                    error: false
                }
            };
        }

        case actions.GET_CURRENT_VALUES_ACTION_ERROR: {
            return {
                ...state,
                data: {
                    ...state.data,
                    loading: false,
                    error: true
                }
            };
        }
    }

    return state;
};
