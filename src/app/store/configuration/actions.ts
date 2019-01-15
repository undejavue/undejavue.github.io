import { Action } from '@ngrx/store';
import { IDataModelItem } from '../../components/models/data-model-item.interface';
import { IMarker } from '../../components/models/marker.interface';

export const CREATE_CONFIGURATION_ACTION = 'create-configuration-action';
export const CREATE_CONFIGURATION_ACTION_SUCCESS = 'create-configuration-action-success';
export const CREATE_CONFIGURATION_ACTION_ERROR = 'create-configuration-action-error';
export const GET_MAP_MARKERS_ACTION = 'get-map-markers-action';
export const GET_MAP_MARKERS_ACTION_SUCCESS = 'get-map-markers-action-success';
export const GET_MAP_MARKERS_ACTION_ERROR = 'get-map-markers-action-error';

export class CreateConfigurationAction implements Action {
    readonly type = CREATE_CONFIGURATION_ACTION;
    constructor() { }
}

export class CreateConfigurationActionSuccess implements Action {
    readonly type = CREATE_CONFIGURATION_ACTION_SUCCESS;
    constructor(public payload: IDataModelItem[]) { }
}

export class CreateConfigurationActionError implements Action {
    readonly type = CREATE_CONFIGURATION_ACTION_ERROR;
    constructor(public payload: any) { }
}

export class GetMapMarkersAction implements Action {
    readonly type = GET_MAP_MARKERS_ACTION;
    constructor() { }
}

export class GetMapMarkersActionSuccess implements Action {
    readonly type = GET_MAP_MARKERS_ACTION_SUCCESS;
    constructor(public payload: IMarker[]) { }
}

export class GetMapMarkersActionError implements Action {
    readonly type = GET_MAP_MARKERS_ACTION_ERROR;
    constructor(public error: any) { }
}

export type All = CreateConfigurationAction
    | CreateConfigurationActionError
    | CreateConfigurationActionSuccess
    | GetMapMarkersAction
    | GetMapMarkersActionError
    | GetMapMarkersActionSuccess;
