import { IGeoPoint } from './geo-point.interface';

export interface IMapPoint {
    id: string;
    geo: IGeoPoint;
    title: string;
    address?: string;
}
