import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  config;
  private loaded = false;

  constructor(config) {
    this.config = config;
    if (config) {
      this.loaded = true;
    }
  }

  get(property: string): any {
    if (this.loaded && this.config && this.config.hasOwnProperty(property)) {
      return this.config[property];
    }
    return null;
  }

  getApiConnString(): string {
    return this.get('webApiUrl');
  }

  getMulti(properties: string[]): any {
    const result = {};
    if (this.loaded && this.config) {
      for (const property of properties) {
        if (this.config.hasOwnProperty(property)) {
          result[property] = this.config[property];
        }
      }
    }
    return result;
  }

  isDebug(): boolean {
    return this.get('enableDebug');
  }
}
