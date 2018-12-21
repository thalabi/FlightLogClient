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

    constructor(private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private messageService: MyMessageService, private sessionDataService: SessionDataService) { }

    ngOnInit() {
        this.messageService.clear();
        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.messageService.clear();
        this.authenticationService.login(this.model.username, this.model.password)
        .subscribe(
            (user: User) => {
                console.log("user", user);
                this.sessionDataService.user = user;
                this.router.navigate([this.returnUrl]);
                this.messageService.clear();
        },
            (error: HttpErrorResponse) => {
                console.log('error', error);
                if (error.status == 401) {
                    console.log("error.error.error", error.error.error);
                    this.messageService.error("Invalid login", "");
                } else {
                    throw(error);
                }
            });
    }

}
