import { Component, OnInit } from '@angular/core';
import { JobLauncherService } from '../job-launcher.service';

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

    constructor(private jobLauncherService: JobLauncherService) { }

    ngOnInit() {
        this.jobOptions = [
            {jobLabel: 'Flight Log Refresh', jobName: 'copyFlightLogTable'},
            {jobLabel: 'Make & Model Refresh', jobName: 'copyMakeModelTable'},
            {jobLabel: 'Pilot Refresh', jobName: 'copyPilotTable'},
            {jobLabel: 'Registration Refresh', jobName: 'copyRegistrationTable'},
            {jobLabel: 'Significant Event Refresh', jobName: 'copySignificantEventTable'},
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
