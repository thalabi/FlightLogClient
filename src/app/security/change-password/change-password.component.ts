import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { MyMessageService } from '../../message/mymessage.service';
import { SessionDataService } from '../../service/session-data.service';
import { HttpErrorResponse } from '@angular/common/http';

class ChangePasswordModel {
    "oldPassword": string;
    "newPassword": string;
    "confirmNewPassword": string;
};

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    model: ChangePasswordModel = new ChangePasswordModel();

    constructor(private authenticationService: AuthenticationService, private messageService: MyMessageService, private sessionDataService: SessionDataService) { }

    ngOnInit() {
    }

    changePassword() {
        this.messageService.clear();
        if (this.model.newPassword !== this.model.confirmNewPassword) {
            this.messageService.clear();
            this.messageService.error('New password and Confirm new password don\'t match');
            return;
        }
        this.authenticationService.changePassword(this.sessionDataService.user.username, this.model.oldPassword, this.model.newPassword)
            .subscribe(
                (string: string) => {
                    console.log("string", string);
                    this.messageService.clear();
                    this.messageService.info('Password changed');
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
