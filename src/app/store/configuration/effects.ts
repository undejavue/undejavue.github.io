import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, catchError } from 'rxjs/operators';
import * as actions from './actions';
import { MapHelperService } from '../../services/map.helper.service';

@Injectable()
export class ConfigEffects {
    constructor(private actions$: Actions, private service: MapHelperService) { }

    @Effect()
    GetDataModel$: Observable<Action> = this.actions$
    .pipe(
        ofType<actions.CreateConfigurationAction>(actions.CREATE_CONFIGURATION_ACTION),
        switchMap(action => this.service.getDataModel()
            .pipe(
                switchMap(result => of(new actions.CreateConfigurationActionSuccess(result))),
                catchError(error => of(new actions.CreateConfigurationActionError(error)))
            )
        ),
        catchError(error => of(new actions.CreateConfigurationActionError(error)))
    );

}
