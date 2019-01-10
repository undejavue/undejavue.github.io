import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { WebApiClient } from '../api/web-api-client';
import { of } from 'rxjs';

@Injectable()
export class WebApiService {
    webApis: [{ [id: string]: string}];

    constructor(private config: ConfigService, private apiClient: WebApiClient) {
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

}


