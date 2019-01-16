import { IDataStore } from '../../app.state';
import { CurrentValuesDto } from '../../api/contracts/current-values/current-values.dto';

export class IPollutionState {
    data: IValuesState;

    constructor() {
        this.data = {
            byId: {}
        };
    }
}

export interface IValuesState extends IDataStore {
    byId: {
        [objectId: string]: CurrentValuesDto
    };
}

export const getValues = (state: IValuesState) => state.byId;
