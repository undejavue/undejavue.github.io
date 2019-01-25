import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, catchError } from 'rxjs/operators';
import * as actions from './actions';
import { PollutionService } from '../../services/pollution.service';
import { WebApiService } from '../../services/webapi.service';

@Injectable()
export class ReportsEffects {
    constructor(private actions$: Actions, private service: WebApiService) { }

    @Effect()
    GetReportsInfo$: Observable<Action> = this.actions$
    .pipe(
        ofType<actions.GetReportsInfoAction>(actions.GET_REPORTS_INFO_ACTION),
        switchMap(action => this.service.getDataObjects()
            .pipe(
                switchMap(result => of(new actions.GetReportsInfoActionSuccess(result))),
                catchError(error => of(new actions.GetReportsInfoActionError(error)))
            )
        ),
        catchError(error => of(new actions.GetReportActionError(error)))
    );

    @Effect()
    GetReportData$: Observable<Action> = this.actions$
    .pipe(
        ofType<actions.GetReportAction>(actions.GET_REPORT_ACTION),
        switchMap(action => this.service.getReport(action.objectId, action.pollution, action.period)
            .pipe(
                switchMap(result => {
                    if (!result.datasets) {
                        alert('No data from Api for this report type!');
                    }
                    return of(new actions.GetReportActionSuccess(result, action.objectId, action.period));
                }),
                catchError(error => of(new actions.GetReportActionError(error)))
            )
        ),
        catchError(error => of(new actions.GetReportActionError(error)))
    );

}
