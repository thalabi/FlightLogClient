import { Component, OnInit } from '@angular/core';
import { GenericEntityService } from '../../service/generic-entity.service';
import { IGenericEntityResponse } from '../../response/i-generic-entity-response';
import { SelectItem } from 'primeng/primeng';
import { IGenericEntity } from '../../domain/i-gerneric-entity';
import { AuthenticationService } from '../authentication.service';
import { MyMessageService } from '../../message/mymessage.service';
import { HttpErrorResponse } from '@angular/common/http';

class CopyUserModel {
    "fromUsername": string;
    "toUsername": string;
};

@Component({
  selector: 'app-copy-user',
  templateUrl: './copy-user.component.html',
  styleUrls: ['./copy-user.component.css']
})
export class CopyUserComponent implements OnInit {

    rowArray: Array<IGenericEntity>;
    usernameSelectItemArray: Array<SelectItem>;
    model: CopyUserModel = new CopyUserModel();

    constructor(private genericEntityService: GenericEntityService, private authenticationService: AuthenticationService, private messageService: MyMessageService) { }

    ngOnInit() {
        this.genericEntityService.getAllGenericEntity('user', 'username').subscribe({
            next: data => {
                console.log('data', data);
                let userResponse: IGenericEntityResponse = data;
                console.log('dauserResponseta', userResponse);
                this.usernameSelectItemArray = new Array<SelectItem>();
                userResponse._embedded['users'].forEach((user: IGenericEntity) => {
                    this.usernameSelectItemArray.push({ label: user.username, value: user.username });
                });
            }
        });
    }

    copyUser() {
        console.log(this.model);
        this.authenticationService.copyUser(this.model.fromUsername, this.model.toUsername)
        .subscribe(
            (string: string) => {
                console.log("string", string);
                this.messageService.clear();
                this.messageService.info('User '+this.model.fromUsername+ ' copied to '+this.model.toUsername);
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
