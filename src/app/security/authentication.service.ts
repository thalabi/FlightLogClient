import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { Observable, throwError } from 'rxjs';
import { User } from './user';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { SessionDataService } from '../service/session-data.service';


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

    constructor(private httpClient: HttpClient, private configService: ConfigService, private sessionDataService: SessionDataService) {
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

    changePassword(username: string, oldPassword: string, newPassword: string): Observable<string> {
        let changePasswordRequest = {"usernameOrEmail": username, "oldPassword": oldPassword, "newPassword": newPassword};
        console.log('changePasswordRequest', changePasswordRequest);
        return this.httpClient.post<string>(this.serviceUrl + '/authenticationController/changePassword', changePasswordRequest, this.getHttpOptions())
            .pipe(
                map((string: string) => {
                    return string;
                })
            );
    }

    copyUser(fromUsername: string, toUsername: string): Observable<string> {
        let copyUserRequest = {"fromUsername": fromUsername, "toUsername": toUsername};
        console.log('changePasswordRequest', copyUserRequest);
        return this.httpClient.post<string>(this.serviceUrl + '/copyUserController/copyUser', copyUserRequest, this.getHttpOptions())
            .pipe(
                map((string: string) => {
                    return string;
                })
            );
    }

    logout() {
        this.isAuthenticated = false;
    }

    private getHttpOptions() {
        console.log('this.sessionDataService.user.token', this.sessionDataService.user.token);
        return {headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.sessionDataService.user.token,
            'Content-Type': 'application/json'
            })
        }
    };

}
