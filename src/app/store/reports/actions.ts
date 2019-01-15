import { Action } from '@ngrx/store';

export const GET_REPORT_ACTION = 'get-report-action';
export const GET_REPORT_ACTION_SUCCESS = 'get-report-action-success';
export const GET_REPORT_ACTION_ERROR = 'get-report-action-error';

export class GetReportAction implements Action {
    readonly type = GET_REPORT_ACTION;
    constructor(public objectId: string) {}
}

export class GetReportActionSuccess implements Action {
    readonly type = GET_REPORT_ACTION_SUCCESS;
    constructor(public payload: any, public objectId: string) {}
}

export class GetReportActionError implements Action {
    readonly type = GET_REPORT_ACTION_ERROR;
    constructor(public error: any) {}
}

export type All = GetReportAction | GetReportActionError | GetReportActionSuccess;
