import { IPollutionModel } from './pollution.interface';
import { IMapPoint } from './map-point.interface';
import { IGeoPoint } from './geo-point.interface';
import { IObjectInfo } from './obj-info.interface';

export interface IMarker extends IMapPoint {
    title: string;
    address?: string;
    connectedToApi: boolean;
}
