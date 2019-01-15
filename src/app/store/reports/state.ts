import { IDataStore } from '../../app.state';

export class IReportState {

    data: IReportStore;

    constructor() {
        this.data = {
            byObjectId: {

            }
        };
    }
}

export interface IReportStore extends IDataStore {
    byObjectId: {
        [id: string]: any
    };
}
