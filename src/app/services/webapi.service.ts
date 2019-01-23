import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { WebApiClient } from '../api/web-api-client';
import { of } from 'rxjs';
import { PollutionTypeEnum } from '../api/contracts/reports/pollution-type.enum';
import { ReportPeriodEnum } from '../api/contracts/reports/report-period.enum';
import { ReportDto } from '../api/contracts/reports/report.dto';
import { filter } from 'rxjs/operators';

@Injectable()
export class WebApiService {
    webApis: [{ [id: string]: string}];

    constructor(private config: ConfigService, private apiClient: WebApiClient) {
        this.init();
    }

    init() {
        this.webApis = this.config.get('webApiUrls');
        if (this.webApis) { return true; }
        return false;
    }

    getCurrentValues(objectId: string) {
        const url = this.webApis[objectId];
        if ( url) {
            return this.apiClient.getValues(url);
        } else {
            of(null);
        }
    }

    getReport(objectId: string, type: PollutionTypeEnum, period: ReportPeriodEnum) {
        const url = this.webApis[objectId];
        /* if ( url) {
            return this.apiClient.getReport(url, type, period);
        } else {
            of(new ReportDto());
        } */
        return this.apiClient.getReportDev(url, type, period);
    }

    getDataObjects() {
        return this.apiClient.getObjectsInfo();
    }

}


