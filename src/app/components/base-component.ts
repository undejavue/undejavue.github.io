import { OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigService } from '../services/config.service';

export class BaseComponent implements OnInit, OnDestroy {
    protected destroy = new Subject();
    isLog = false;

    constructor(config: ConfigService) {
        this.isLog = config.isDebug();
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.unsubscribe();
    }
}
