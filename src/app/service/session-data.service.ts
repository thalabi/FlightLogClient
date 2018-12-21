import { Injectable } from '@angular/core';
import { User } from '../security/user';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SessionDataService {

    public user: User;
    public userSubject: Subject<User>;

    constructor() {
        this.userSubject = new Subject<User>();
        this.userSubject.next(new User());
    }
}
