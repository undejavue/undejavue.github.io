import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';

@Injectable()
export class LoggedInGuard implements CanActivate {
    path;
    route;
  constructor() { }

  canActivate() {
    // if (environment.production === false) { return true; }
    return true;
  }
}
