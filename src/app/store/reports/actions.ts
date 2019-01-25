import { Action } from '@ngrx/store';
import { PollutionTypeEnum } from '../../api/contracts/reports/pollution-type.enum';
import { ReportPeriodEnum } from '../../api/contracts/reports/report-period.enum';

export const GET_REPORT_ACTION = 'get-report-action';
export const GET_REPORT_ACTION_SUCCESS = 'get-report-action-success';
export const GET_REPORT_ACTION_ERROR = 'get-report-action-error';
export const GET_REPORTS_INFO_ACTION = 'get-report-info-action';
export const GET_REPORTS_INFO_ACTION_SUCCESS = 'get-report-info-action-success';
export const GET_REPORTS_INFO_ACTION_ERROR = 'get-report-info-action-error';

export class GetReportAction implements Action {
    readonly type = GET_REPORT_ACTION;
    constructor(public objectId: string,
        public pollution: PollutionTypeEnum,
        public period: ReportPeriodEnum) { }
}

export class GetReportActionSuccess implements Action {
    readonly type = GET_REPORT_ACTION_SUCCESS;
    constructor(public payload: any,
        public objectId: string,
        public period: ReportPeriodEnum) { }
}

export class GetReportActionError implements Action {
    readonly type = GET_REPORT_ACTION_ERROR;
    constructor(public error: any) { }
}

export class GetReportsInfoAction implements Action {
    readonly type = GET_REPORTS_INFO_ACTION;
    constructor() { }
}

export class GetReportsInfoActionSuccess implements Action {
    readonly type = GET_REPORTS_INFO_ACTION_SUCCESS;
    constructor(public payload: any) { }
}

export class GetReportsInfoActionError implements Action {
    readonly type = GET_REPORTS_INFO_ACTION_ERROR;
    constructor(public error: any) { }
}

export type All = GetReportAction
    | GetReportActionError
    | GetReportActionSuccess
    | GetReportsInfoAction
    | GetReportsInfoActionError
    | GetReportsInfoActionSuccess;

