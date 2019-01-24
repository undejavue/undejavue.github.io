import { Reducer } from '../../app.state';
import * as actions from './actions';
import { IConfigState } from './state';

type Action = actions.All;

export const configurationReducer: Reducer<IConfigState> = (state: IConfigState = new IConfigState(), action: Action) => {

    switch (action.type) {
        case actions.CREATE_CONFIGURATION_ACTION: {
            return {
                ...state,
                dataModel: {
                    ...state.dataModel,
                    loading: true,
                    error: false,
                    items: []
                }
            };
        }

        case actions.CREATE_CONFIGURATION_ACTION_SUCCESS: {
            return {
                ...state,
                dataModel: {
                    ...state.dataModel,
                    loading: false,
                    error: false,
                    items: action.payload
                }
            };
        }

        case actions.CREATE_CONFIGURATION_ACTION_ERROR: {
            return {
                ...state,
                dataModel: {
                    ...state.dataModel,
                    loading: false,
                    error: true
                }
            };
        }
        case actions.GET_MAP_MARKERS_ACTION: {
            return {
                ...state,
                marker: {
                    ...state.marker,
                    loading: true,
                    error: false,
                    items: []
                }
            };
        }
        case actions.GET_MAP_MARKERS_ACTION_SUCCESS: {
            return {
                ...state,
                marker: {
                    ...state.marker,
                    loading: false,
                    error: false,
                    items: action.payload
                }
            };
        }
        case actions.GET_MAP_MARKERS_ACTION_ERROR: {
            return {
                ...state,
                marker: {
                    ...state.marker,
                    loading: false,
                    error: true
                }
            };
        }

        case actions.CREATE_NAVIGATION_ACTION: {
            return {
                ...state,
                navigation: {
                    ...state.navigation,
                    items: action.payload
                }
            };
        }

        case actions.NAVIGATION_SET_ACTIVE: {
            return {
                ...state,
                navigation: {
                    ...state.navigation,
                    activeId: action.activeId
                }
            };
        }
    }

    return state;
};
