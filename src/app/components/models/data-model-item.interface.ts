import { IObjectInfo } from './obj-info.interface';
import { IPollutionModel } from './pollution.interface';

export interface IDataModelItem {
    id: string;
    title: string;
    address: string;
    datetime?: string;
    latitude: number;
    longtitude: number;
    information: IObjectInfo;
    emissions?: IPollutionModel[];
    concentrations?: IPollutionModel[];
}
