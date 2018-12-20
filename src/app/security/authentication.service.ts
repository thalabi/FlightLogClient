import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { Observable, throwError } from 'rxjs';
import { User } from './user';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ReplicationService } from '../service/replication.service';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    user: User;
    isAuthenticated: boolean = false;

    serviceUrl: string;
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

    constructor(private httpClient: HttpClient, private configService: ConfigService) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    login(username: string, password: string): Observable<User> {
        let loginRequest = {"usernameOrEmail": username, "password": password};
        return this.httpClient.post<User>(this.serviceUrl + '/authenticationController/authenticate', loginRequest,this.httpOptions)
            .pipe(
                map((user: User) => {
                    this.isAuthenticated = true;
                    console.log('this.isAuthenticated', this.isAuthenticated);
                    return user;
                })
            );
    }
}
