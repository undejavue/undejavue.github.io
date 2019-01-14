import { Action } from '@ngrx/store';

export const GET_CONFIGURATION_ACTION = 'get-config-action';
export const GET_CONFIGURATION_ACTION_SUCCESS = 'get-config-action-success';
export const GET_CONFIGURATION_ACTION_ERROR = 'get-config-action-error';
export const GET_CURRENT_VALUES_ACTION = 'get-current-values-action';
export const GET_CURRENT_VALUES_ACTION_SUCCESS = 'get-current-values-action-success';
export const GET_CURRENT_VALUES_ACTION_ERROR = 'get-current-values-action-error';

export class GetConfigationAction implements Action {
    readonly type = GET_CONFIGURATION_ACTION;
    constructor() {}
}

export class GetConfigationActionSuccess implements Action {
    readonly type = GET_CONFIGURATION_ACTION_SUCCESS;
    constructor(public payload: any) {}
}

export class GetConfigationActionError implements Action {
    readonly type = GET_CONFIGURATION_ACTION_ERROR;
    constructor(public payload: any) {}
}

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
