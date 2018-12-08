import { IPollutionModel } from './pollution.interface';

export interface IFeatureValue {
    emissions: IPollutionModel[];
    concentrations: IPollutionModel[];
}
