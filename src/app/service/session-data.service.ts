import { Injectable } from '@angular/core';
import { User } from '../security/user';

@Injectable({
    providedIn: 'root'
})
export class SessionDataService {

    public user: User;

    constructor() { }
}
