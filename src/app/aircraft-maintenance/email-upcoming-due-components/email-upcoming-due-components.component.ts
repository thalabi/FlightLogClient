import { Component, OnInit } from '@angular/core';
import { AircraftComponentService } from '../service/aircraft-component.service';
import { MyMessageService } from '../../message/mymessage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { MessagesModule } from 'primeng/messages';
import { PickListModule } from 'primeng/picklist';
import { TabViewModule } from 'primeng/tabview';

@Component({
    selector: 'app-email-upcoming-due-components',
    imports: [FormsModule, ReactiveFormsModule, MessagesModule, CalendarModule, ButtonModule, TabViewModule, FieldsetModule, PickListModule],
    templateUrl: './email-upcoming-due-components.component.html',
    styleUrls: ['./email-upcoming-due-components.component.css'],
    providers: [AircraftComponentService]
})
export class EmailUpcomingDueComponentsComponent implements OnInit {

    airtime!: number;
    airtimeState!: string;
    fromDueDate!: Date;
    toDueDate!: Date;
    fromHrsDue!: number;
    toHrsDue!: number;
    emailAddress!: string;

    constructor(private aircraftComponentService: AircraftComponentService, private messageService: MyMessageService) { }

    ngOnInit() {
        this.aircraftComponentService.getAirTime().subscribe(
            (tsn) => {
                console.log('tsn', tsn);
                this.airtime = tsn.value;
                this.airtimeState = tsn.valueStateEnum;
            }
        );
    }

    onEmailUpcomingDueComponents(): void {
        console.log('date performed range', this.fromDueDate, this.toDueDate);
        console.log('hrs due range', this.fromHrsDue, this.toHrsDue);
        console.log('email address', this.emailAddress);

        this.aircraftComponentService.emailUpcomingDueComponents(this.fromDueDate, this.toDueDate, this.fromHrsDue, this.toHrsDue, this.emailAddress).subscribe(
            (response) => {
                console.log('response', response);
                if (response) {
                    this.messageService.info('Email sent successfully');
                } else {
                    this.messageService.warn('No upocoming due components found for the given criteria. No email sent.');
                }
            }
        );
    }

}
