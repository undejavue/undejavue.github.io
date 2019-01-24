import { IDataStore } from '../../app.state';
import { IDataModelItem } from '../../components/models/data-model-item.interface';
import { IMarker } from '../../components/models/marker.interface';
import { INavItem } from '../../components/layout/sidebar/sidebar.component';

export class IConfigState {
    dataModel: IDataModelState;
    marker?: IMarkerStore;
    defaults: any;
    parametres: any;
    navigation: {
        items: INavItem [],
        activeId: string
    };

    constructor() {
        this.dataModel = {
            loading: true,
            items: []
        };
        this.navigation = {
            items: [],
            activeId: ''
        };
    }
}

export interface IMarkerStore extends IDataStore {
    items: IMarker[];
}

export interface IDataModelState extends IDataStore {
    items: IDataModelItem[];
}
