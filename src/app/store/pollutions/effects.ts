import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, catchError } from 'rxjs/operators';
import * as actions from './actions';
import { PollutionService } from '../../services/pollution.service';

@Injectable()
export class PollutionEffects {
    constructor(private actions$: Actions, private service: PollutionService) { }

    @Effect()
    GetCurrentValue$: Observable<Action> = this.actions$
    .pipe(
        ofType<actions.GetCurrentValuesAction>(actions.GET_CURRENT_VALUES_ACTION),
        switchMap(action => this.service.getCurrentValues(action.objectId)
            .pipe(
                switchMap(result => of(new actions.GetCurrentValuesActionSuccess(result, action.objectId))),
                catchError(error => of(new actions.GetCurrentValuesActionError(error)))
            )
        ),
        catchError(error => of(new actions.GetCurrentValuesActionError(error)))
    );
}
