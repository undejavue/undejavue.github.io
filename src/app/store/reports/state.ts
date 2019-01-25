import { IDataStore } from '../../app.state';
import { ReportDto } from '../../api/contracts/reports/report.dto';

export class IReportState {

    data: IReportStore;
    info: IReportInfoStore;

    constructor() {
        this.data = { byId: {} };
        this.info = { items: [] };
    }
}

export interface IReportModel {
    datasets: any[];
    headerRow: string[];
    updatedOn: any;
}

export interface IReportInfoStore extends IDataStore {
    items: any;
}

export interface IReportStore extends IDataStore {
    byId: {
        [id: string]: ReportDto;
    };
}
