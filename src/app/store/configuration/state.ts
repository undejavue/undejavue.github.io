import { IDataStore } from '../../app.state';
import { IDataModelItem } from '../../components/models/data-model-item.interface';
import { IMarker } from '../../components/models/marker.interface';

export class IConfigState {
    dataModel: IDataModelState;
    marker?: IMarkerStore;
    defaults: any;
    parametres: any;
    constructor() {
        this.dataModel = {
            loading: true,
            items: []
        };
    }
}

export interface IMarkerStore extends IDataStore {
    items: IMarker[];
}

export interface IDataModelState extends IDataStore {
    items: IDataModelItem[];
}
