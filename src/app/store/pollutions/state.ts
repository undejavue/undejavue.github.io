import { IDataModelItem } from '../../components/models/data-model-item.interface';
import { IDataStore } from '../../app.state';

export class IPollutionState {
    data: IDataModel;

    constructor() {
        this.data = {};
    }
}

export interface IDataModel extends IDataStore {
    items?: IDataModelItem[];
}

export const getItems = (state: IDataModel) => state.items;
