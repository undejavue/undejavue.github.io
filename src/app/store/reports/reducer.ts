import { IReportState } from './state';
import { Reducer } from '../../app.state';
import * as actions from './actions';

type Action = actions.All;

export const reportsReducer: Reducer<IReportState> = (state: IReportState = new IReportState(), action: Action) => {

    switch (action.type) {
        case actions.GET_REPORT_ACTION: {
            return {
                ...state,
                data: {
                    ...state.data,
                    loading: true,
                    error: false
                }
            };
        }

        case actions.GET_REPORT_ACTION_SUCCESS: {
            return {
                ...state,
                data: {
                    ...state.data,
                    byObjectId: {
                        [action.objectId]: action.payload
                    },
                    loading: false,
                    error: false
                }
            };
        }

        case actions.GET_REPORT_ACTION_ERROR: {
            return {
                ...state,
                data: {
                    ...state.data,
                    loading: false,
                    error: true
                }
            };
        }

        case actions.GET_REPORTS_INFO_ACTION: {
            return {
                ...state,
                info: {
                    ...state.info,
                    loading: true,
                    error: false
                }
            };
        }

        case actions.GET_REPORTS_INFO_ACTION_SUCCESS: {
            return {
                ...state,
                info: {
                    items: action.payload,
                    loading: false,
                    error: false
                }
            };
        }

        case actions.GET_REPORTS_INFO_ACTION_ERROR: {
            return {
                ...state,
                info: {
                    ...state.info,
                    loading: false,
                    error: true
                }
            };
        }
    }

    return state;
};
