import { ConfigService } from '../services/config.service';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponseBase, HttpResponse } from '@angular/common/http';
import { Observable, from, throwError, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { SwaggerException } from './swagger-exception';
import { PollutionTypeEnum } from './contracts/reports/pollution-type.enum';
import { ReportPeriodEnum } from './contracts/reports/report-period.enum';
import { ReportDto } from './contracts/reports/report.dto';

@Injectable()
export class WebApiClient {
    webApis: [{ [id: string]: string }];

    private http: HttpClient;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;


    constructor(@Inject(HttpClient) http: HttpClient, ) {
        this.http = http;
    }

    protected transformOptions(options: any) {
        // options.withCredentials = true;

        /* if (this.oAuthService && this.oAuthService.isAuthenticated()) {
                    options.headers = options.headers.set('Authorization', `Bearer ${this.oAuthService.getToken()}`);
                    // console.log('OPTIONS: ', options);
                    return Promise.resolve(options);
                } */
        // options.headers = options.headers.set('Access-Control-Allow-Origin', true);
        return Promise.resolve(options);
    }

    getReport(baseUrl: string, type: PollutionTypeEnum, period: ReportPeriodEnum): Observable<ReportDto | null> {
        let url_ = `${baseUrl}/api/reports/get?type=${type}&period=${period}`;
        url_ = url_.replace(/[?&]$/, '');

        const options_: any = {
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        };

        return from(this.transformOptions(options_)).pipe(mergeMap(transformedOptions_ => {
            return this.http.request('get', url_, transformedOptions_);
        })).pipe(mergeMap((response_: any) => {
            return this.processGetValues(response_);
        })).pipe(catchError((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetValues(<any>response_);
                } catch (e) {
                    return <Observable<any | null>><any>throwError(e);
                }
            } else {
                return <Observable<any | null>><any>throwError(response_);
            }
        }));
    }

    getValues(baseUrl: string): Observable<any | null> {
        let url_ = baseUrl + '/api/values/get';
        url_ = url_.replace(/[?&]$/, '');

        const options_: any = {
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        };

        return from(this.transformOptions(options_)).pipe(mergeMap(transformedOptions_ => {
            return this.http.request('get', url_, transformedOptions_);
        })).pipe(mergeMap((response_: any) => {
            return this.processGetValues(response_);
        })).pipe(catchError((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetValues(<any>response_);
                } catch (e) {
                    return <Observable<any | null>><any>throwError(e);
                }
            } else {
                return <Observable<any | null>><any>throwError(response_);
            }
        }));
    }

    protected processGetValues(response: HttpResponseBase): Observable<any | null> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        const _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200) {
            return this.blobToText(responseBlob).pipe(mergeMap(_responseText => {
                let result200: any = null;
                result200 = _responseText === '' ? null : <any>JSON.parse(_responseText, this.jsonParseReviver);
                return of(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return this.blobToText(responseBlob).pipe(mergeMap(_responseText => {
                return this.throwException('An unexpected server error occurred.', status, _responseText, _headers);
            }));
        }
        return of(<any>null);
    }

    throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
        return throwError(new SwaggerException(message, status, response, headers, result));
    }

    blobToText(blob: any): Observable<string> {
        return new Observable<string>((observer: any) => {
            if (!blob) {
                observer.next('');
                observer.complete();
            } else {
                const reader = new FileReader();
                reader.onload = function () {
                    observer.next(this.result);
                    observer.complete();
                };
                reader.readAsText(blob);
            }
        });
    }

/*     jsonParseReviver = (value, key) => {
        if (value && typeof value === 'object') {
            for (let k in value) {
              if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
                value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
                delete value[k];
              }
            }
          }
          return value;
    } */
}
