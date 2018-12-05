import { IPollutionModel } from './pollution.interface';
import { IMapPoint } from './map-point.interface';
import { IGeoPoint } from './geo-point.interface';

export interface IMarker extends IMapPoint {
    emissions: IPollutionModel[];
    concentrations: IPollutionModel[];
}
