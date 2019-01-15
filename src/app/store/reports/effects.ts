import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, catchError } from 'rxjs/operators';
import * as actions from './actions';
import { PollutionService } from '../../services/pollution.service';

@Injectable()
export class ReportsEffects {
    constructor(private actions$: Actions, private service: PollutionService) { }

    @Effect()
    GetCurrentValue$: Observable<Action> = this.actions$
    .pipe(
        ofType<actions.GetReportAction>(actions.GET_REPORT_ACTION),
        switchMap(action => this.service.getReportData(action.objectId)
            .pipe(
                switchMap(result => of(new actions.GetReportActionSuccess(result, action.objectId))),
                catchError(error => of(new actions.GetReportActionError(error)))
            )
        ),
        catchError(error => of(new actions.GetReportActionError(error)))
    );
}
