import { IReportState } from './state';
import { Reducer } from '../../app.state';
import * as actions from './actions';
import { ReportPeriodEnum } from '../../api/contracts/reports/report-period.enum';

type Action = actions.All;

export const reportsReducer: Reducer<IReportState> = (state: IReportState = new IReportState(), action: Action) => {

    switch (action.type) {
        case actions.GET_REPORT_ACTION: {
            const byId = { ...state.data.byId };
            byId[action.objectId] = null;
            return {
                ...state,
                data: {
                    ...state.data,
                    byId,
                    loading: true,
                    error: false
                }
            };
        }

        case actions.GET_REPORT_ACTION_SUCCESS: {
            const byId = { ...state.data.byId };
            const id = action.objectId;
            const dto = action.payload;
            byId[id] = dto;

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
