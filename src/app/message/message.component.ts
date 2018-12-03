import { Component, ChangeDetectorRef } from '@angular/core';
import { MyMessageService } from './mymessage.service';
import { MyMessage } from './mymessage';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { OverlayPanel } from 'primeng/primeng';
import { Abbreviate } from '../abbreviate/abbreviate';


@Component({
    selector: 'message',
    template: `
        <div *ngFor="let message of messageArray" style="margin-top: 0.3rem;">
            <p-message [severity]="message.severity" [text]="abbreviateMessage(message.summary)" [pTooltip]="message.detail" tooltipPosition="right"></p-message>
        </div><button *ngIf="messageArray && messageArray.length > 0" pButton type="button" (click)="onClearMessages($event)" icon="pi pi-times"></button>
    `,
    styles: ['::ng-deep .ui-tooltip {max-width: 50rem;}']
})
export class MessageComponent {
    
    messageArray: MyMessage[];

    constructor(private messageService: MyMessageService, private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.messageService.currentMessageArray.subscribe(messageArray => {
            this.messageArray = messageArray;
            this.changeDetectorRef.detectChanges();
        });
    }

    abbreviateMessage(inputText: string): string {
        return Abbreviate.abbreviateText(inputText);
    }

    onClearMessages() {
        this.messageService.clear();
    }
}