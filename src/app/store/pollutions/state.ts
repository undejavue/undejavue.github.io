import { IDataModelItem } from '../../components/models/data-model-item.interface';

export class IPollutionState {
    data: IDataModel;

    constructor() {
        this.data = {};
    }
}

export interface IDataModel extends IDataStore {
    items?: IDataModelItem[];
}

export interface IDataStore {
    loading?: boolean;
    error?: boolean;
}

export const getItems = (state: IDataModel) => state.items;
