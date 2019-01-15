import { Action } from '@ngrx/store';

export const GET_CURRENT_VALUES_ACTION = 'get-current-values-action';
export const GET_CURRENT_VALUES_ACTION_SUCCESS = 'get-current-values-action-success';
export const GET_CURRENT_VALUES_ACTION_ERROR = 'get-current-values-action-error';

export class GetCurrentValuesAction implements Action {
    readonly type = GET_CURRENT_VALUES_ACTION;
    constructor(public objectId: string) {}
}

export class GetCurrentValuesActionSuccess implements Action {
    readonly type = GET_CURRENT_VALUES_ACTION_SUCCESS;
    constructor(public payload: any) {}
}

export class GetCurrentValuesActionError implements Action {
    readonly type = GET_CURRENT_VALUES_ACTION_ERROR;
    constructor(public payload: any) {}
}

export type All = GetCurrentValuesAction | GetCurrentValuesActionError | GetCurrentValuesActionSuccess;
