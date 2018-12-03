import { Injectable, Output, EventEmitter } from '@angular/core';
import { MyMessage } from './mymessage';
import { BehaviorSubject } from 'rxjs';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
    providedIn: 'root',
  })
export class MyMessageService {

    private messageArray: MyMessage[] = [];
    private messageArraySource = new BehaviorSubject<MyMessage[]>([]);
    currentMessageArray = this.messageArraySource.asObservable();

    constructor() {
    }

    clear() {
        this.messageArray = [];
        this.messageArraySource.next(this.messageArray);
    }
    success(summary: string, detail?: string): void {
        this.pushMessage('success', summary, detail);
    }

    info(summary: string, detail?: string): void {
        this.pushMessage('info', summary, detail);
    }

    warn(summary: string, detail?: string): void {
        this.pushMessage('warn', summary, detail);
    }

    error(summary: string, detail?: string): void {
        this.pushMessage('error', summary, detail);
    }

    private pushMessage(severity: string, summary: string, detail: string) {
        let message: MyMessage = {severity: severity, summary: summary, detail: detail};
        this.messageArray.push(message);
        console.log('this.messageArray.length: ', this.messageArray.length);
        this.messageArraySource.next(this.messageArray);
    }
}