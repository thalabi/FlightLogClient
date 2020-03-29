import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { User } from '../user';
import { HttpErrorResponse } from '@angular/common/http';
import { MyMessageService } from '../../message/mymessage.service';
import { SessionDataService } from '../../service/session-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    model: any = {};
    returnUrl: string;
    isPprocessingRequest: boolean;

    constructor(private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private messageService: MyMessageService, private sessionDataService: SessionDataService) { }

    ngOnInit() {
        this.messageService.clear();
        this.authenticationService.logout();
        this.sessionDataService.userSubject.next(null);
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.isPprocessingRequest = false;
    }

    login() {
        this.isPprocessingRequest = true;
        this.messageService.clear();
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe({
                next: (user: User) => {
                    console.log('user', user);
                    this.sessionDataService.user = user;
                    this.sessionDataService.userSubject.next(user);
                    this.router.navigate([this.returnUrl]);
                    this.messageService.clear();
                    this.isPprocessingRequest = false;
                },
                error: () => {
                    this.isPprocessingRequest = false;
                }
            });
    }
}
