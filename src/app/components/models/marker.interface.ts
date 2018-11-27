import { PollutionModel } from './pollution.model';
import { IMapPoint } from './map-point.interface';
import { IGeoPoint } from './geo-point.interface';

export interface IMarker extends IMapPoint {
    pollutions: PollutionModel[];
}
