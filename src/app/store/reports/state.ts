import { IDataStore } from '../../app.state';
import { ReportDto } from '../../api/contracts/reports/report.dto';

export class IReportState {

    data: IReportStore;
    info: IReportInfoStore;

    constructor() {
        this.data = {
            byObjectId: {

            }
        };
        this.info = { items: [] };
    }
}

export interface IReportInfoStore extends IDataStore {
    items: any;
}

export interface IReportStore extends IDataStore {
    byObjectId: {
        [id: string]: ReportDto
    };
}
