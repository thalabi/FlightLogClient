import { Component, OnInit } from '@angular/core';
import { JobLauncherService } from '../service/job-launcher.service';
import { MyMessageService } from '../message/mymessage.service';
import { SessionService } from '../service/session.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { NgIf, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-job-launcher',
    templateUrl: './job-launcher.component.html',
    styleUrls: ['./job-launcher.component.css'],
    imports: [DropdownModule, FormsModule, NgIf, ButtonModule, ProgressBarModule, JsonPipe]
})
export class JobLauncherComponent implements OnInit {

    jobOptions!: Array<{ jobLabel: string; jobName: string; }>;
    selectedJobOption: any;
    jobInProgress!: boolean;
    jobCompleted!: boolean;
    jobLauncherResponse: any;

    constructor(private jobLauncherService: JobLauncherService, private messageService: MyMessageService, private sessionService: SessionService) { }

    ngOnInit() {
        this.messageService.clear();
        this.sessionService.clearBackendStackTrace()

        this.jobOptions = [
            { jobLabel: 'Flight Log Refresh', jobName: 'copyFlightLogTable' },
            { jobLabel: 'Make & Model Refresh', jobName: 'copyMakeModelTable' },
            { jobLabel: 'Pilot Refresh', jobName: 'copyPilotTable' },
            { jobLabel: 'Registration Refresh', jobName: 'copyRegistrationTable' },
            { jobLabel: 'Significant Event Refresh', jobName: 'copySignificantEventTable' },
            { jobLabel: 'Airport Refresh', jobName: 'copyAirportTable' },
            { jobLabel: 'Flight Log Sync Disable', jobName: 'disableFlightLogTriggers' },
            { jobLabel: 'Flight Log Sync Enable', jobName: 'enableFlightLogTriggers' },
            { jobLabel: 'Make & Model Sync Disable', jobName: 'disableMakeModelTriggers' },
            { jobLabel: 'Make & Model Sync Enable', jobName: 'enableMakeModelTriggers' },
            { jobLabel: 'Significant Sync Event Disable', jobName: 'disableSignificantEventTriggers' },
            { jobLabel: 'Significant Sync Event Enable', jobName: 'enableSignificantEventTriggers' },
            //{ jobLabel: 'Aircraft Maintenance Refresh', jobName: 'copyAircraftMaintenanceTables' },
        ];

    }

    onClick(event: any) {
        console.log('this.selectedJobOption', this.selectedJobOption);
        this.jobLauncherService.startJob(this.selectedJobOption.jobName)
            .subscribe({
                next: (jobLauncherResponse: any) => {
                    this.jobLauncherResponse = jobLauncherResponse;
                    console.log('this.jobLauncherResponse', this.jobLauncherResponse);
                    this.jobInProgress = false;
                    this.jobCompleted = true;
                }
            });
        this.jobInProgress = true;
    }
}
