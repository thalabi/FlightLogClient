import { Injectable } from '@angular/core';
import { Headers, Response, ResponseContentType } from '@angular/http';

import { catchError, map } from 'rxjs/operators';
// Observale operators
import 'rxjs/add/operator/toPromise';
import { Constant } from '../constant';
import { ApplicationProperties } from './application.properties';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {

    restUrl: string;
    serviceUrl: string;
    applicationProperties: ApplicationProperties;

    constructor(private http: HttpClient) { }

    getApplicationProperties(): ApplicationProperties {
        return this.applicationProperties;
    }

    loadConfig(): Promise<string> {
        console.log('loadConfig() called');
        let configPromise: Promise<string> = this.http.get(Constant.APPLICATION_PROPERTIES_FILE).pipe(
            map((response: any) => {
                this.applicationProperties = response;
            }),
            catchError((error: Response | any): Promise<any> => {
                console.error('Could not read ' + Constant.APPLICATION_PROPERTIES_FILE + '. Error is: ' + error);
                return Promise.reject('');
            }))
            .toPromise();
        //.catch(response => console.error('Could not read '+this.configfileUrl));
        configPromise.then(restUrl => this.restUrl = restUrl);
        return configPromise;
        // return Promise.resolve('hello');
    }
}

export function configServiceLoadConfig(configService: ConfigService) {
    return () => configService.loadConfig();
}
