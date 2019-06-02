import { Component, OnInit } from '@angular/core';
import { JobLauncherService } from '../service/job-launcher.service';
import { MyMessageService } from '../message/mymessage.service';

@Component({
  selector: 'app-job-launcher',
  templateUrl: './job-launcher.component.html',
  styleUrls: ['./job-launcher.component.css']
})
export class JobLauncherComponent implements OnInit {

    jobOptions: Array<{jobLabel: string; jobName: string;}>;
    selectedJobOption: any;
    jobInProgress: boolean;
    jobCompleted: boolean;
    jobLauncherResponse: any;

    constructor(private jobLauncherService: JobLauncherService,private messageService: MyMessageService) { }

    ngOnInit() {
        this.messageService.clear();
        this.jobOptions = [
            {jobLabel: 'Flight Log Refresh', jobName: 'copyFlightLogTable'},
            {jobLabel: 'Make & Model Refresh', jobName: 'copyMakeModelTable'},
            {jobLabel: 'Pilot Refresh', jobName: 'copyPilotTable'},
            {jobLabel: 'Registration Refresh', jobName: 'copyRegistrationTable'},
            {jobLabel: 'Significant Event Refresh', jobName: 'copySignificantEventTable'},
            {jobLabel: 'Airport Refresh', jobName: 'copyAirportTable'},
            {jobLabel: 'Flight Log Sync Disable', jobName: 'disableFlightLogTriggers'},
            {jobLabel: 'Flight Log Sync Enable', jobName: 'enableFlightLogTriggers'},
            {jobLabel: 'Make & Model Sync Disable', jobName: 'disableMakeModelTriggers'},
            {jobLabel: 'Make & Model Sync Enable', jobName: 'enableMakeModelTriggers'},
            {jobLabel: 'Significant Sync Event Disable', jobName: 'disableSignificantEventTriggers'},
            {jobLabel: 'Significant Sync Event Enable', jobName: 'enableSignificantEventTriggers'},
            {jobLabel: 'Aircraft Maintenance Refresh', jobName: 'copyAircraftMaintenanceTables'},
        ];

    }

    onClick(event) {
        console.log('this.selectedJobOption', this.selectedJobOption);
        this.jobLauncherService.startJob(this.selectedJobOption.jobName) 
            .subscribe({
                next: (jobLauncherResponse: any) => {
                    this.jobLauncherResponse = jobLauncherResponse;
                    console.log('this.jobLauncherResponse', this.jobLauncherResponse);
                    this.jobInProgress = false;
                    this.jobCompleted = true;
            }});
        this.jobInProgress = true;
    }
}
