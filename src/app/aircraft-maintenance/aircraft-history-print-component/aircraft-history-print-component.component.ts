import { Component, OnInit } from '@angular/core';
import { AircraftComponentService } from '../service/aircraft-component.service';
import { AircraftComponentName } from '../../domain/aircraft-component-name';
import { MyMessageService } from '../../message/mymessage.service';

@Component({
    selector: 'app-aircraft-history-print-component',
    templateUrl: './aircraft-history-print-component.component.html',
    styleUrls: ['./aircraft-history-print-component.component.css']
})
export class AircraftHistoryPrintComponentComponent implements OnInit {

    hoursDue: number;
    fromDatePerformed: Date;
    toDatePerformed: Date;
    
    // componentNameJsonArray: Array<AircraftComponentName.ComponentName>;
    // selectedComponentNameJsonArray: Array<AircraftComponentName.ComponentName>;
    componentNameArray: Array<AircraftComponentName.ComponentName>;
    selectedComponentNameArray: Array<AircraftComponentName.ComponentName>;
    constructor(private aircraftComponentService: AircraftComponentService, private messageService: MyMessageService) { }

    ngOnInit() {
    }

    onTabChange(event) {
        console.log(event.index);
        let tabIndex = event.index;
        switch (tabIndex) {
            case 0:
                break;
            case 1:
                // this.aircraftComponentService.getComponentNames().subscribe(
                //     (response) => {
                //         console.log('response', response);
                //         this.componentNameArray = response;
                //         console.log('this.componentNameArray', this.componentNameArray);
                //         this.componentNameJsonArray = new Array();
                //         this.componentNameArray.forEach(componentName => {
                //             this.componentNameJsonArray.push({"name": componentName});
                //         });
                //         console.log('this.componentNameJsonArray', this.componentNameJsonArray);
                //     }
                // );
                this.aircraftComponentService.getComponentNames().subscribe(
                    (response) => {
                        console.log('response', response);
                        this.componentNameArray = response;
                        console.log('this.componentNameArray', this.componentNameArray);
                    }
                );
                this.selectedComponentNameArray = new Array();
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                throw ('Something went wrong on our end. Invalid tabIndex: ' + tabIndex);
        }
    }

    onDownloadAllPdf(): void {
        console.log('onDownloadAllPdf()');
        this.aircraftComponentService.downloadAllPdf().subscribe(
            (response) => {
                var pdfUrl = URL.createObjectURL(response);
                console.log('pdfUrl', pdfUrl);
                window.open(pdfUrl);
            }
        );
    }

    onDownloadByDatePerformedFilterDateRangePdf(): void {
        console.log('date performed range', this.fromDatePerformed, this.toDatePerformed);
        //
        this.aircraftComponentService.downloadByDatePerformedFilterDateRangePdf(this.fromDatePerformed, this.toDatePerformed).subscribe(
            (response) => {
                if (response.size == 0) {
                    console.log('empty report');
                    this.messageService.warn('No components found');
                } else {
                    var pdfUrl = URL.createObjectURL(response);
                    console.log('pdfUrl', pdfUrl);
                    window.open(pdfUrl);
                }
            }
        );
    }

    onDownloadByComponentNamePdf(): void {
        console.log('onDownloadByComponentNamePdf()');
        this.aircraftComponentService.downloadByComponentNamePdf().subscribe(
            (response) => {
                var pdfUrl = URL.createObjectURL(response);
                console.log('pdfUrl', pdfUrl);
                window.open(pdfUrl);
            }
        );
    }

    onDownloadByUpcomingDateDue(): void {
        console.log('onDownloadByUpcomingDateDue()');
        this.aircraftComponentService.downloadByUpcomingDateDue().subscribe(
            (response) => {
                var pdfUrl = URL.createObjectURL(response);
                console.log('pdfUrl', pdfUrl);
                window.open(pdfUrl);
            }
        );
    }

    onDownloadByDateDuePdf(): void {
        console.log('onDownloadByDateDuePdf()');
        this.aircraftComponentService.downloadByDateDuePdf().subscribe(
            (response) => {
                var pdfUrl = URL.createObjectURL(response);
                console.log('pdfUrl', pdfUrl);
                window.open(pdfUrl);
            }
        );
    }

    onDownloadByHoursDuePdf(): void {
        console.log('onDownloadByHoursDuePdf()');
        this.aircraftComponentService.downloadByHoursDuePdf().subscribe(
            (response) => {
                var pdfUrl = URL.createObjectURL(response);
                console.log('pdfUrl', pdfUrl);
                window.open(pdfUrl);
            }
        );
    }

    onDownloadByHoursDueAfterLatestHoursPerformedPdf(): void {
        console.log('onDownloadByHoursDueAfterLatestHoursPerformedPdf()');
        this.aircraftComponentService.downloadAfterLatestHoursPerformedByHoursDuePdf().subscribe(
            (response) => {
                var pdfUrl = URL.createObjectURL(response);
                console.log('pdfUrl', pdfUrl);
                window.open(pdfUrl);
            }
        );
    }

    onDownloadByHoursDueAfterHoursDuePdf(): void {
        console.log('onDownloadByHoursDueAfterHoursDuePdf()');
        console.log('this.hoursDue', this.hoursDue);
        this.aircraftComponentService.downloadAfterHoursByHoursDuePdf(this.hoursDue).subscribe(
            (response) => {
                var pdfUrl = URL.createObjectURL(response);
                console.log('pdfUrl', pdfUrl);
                window.open(pdfUrl);
            }
        );
    }

    onMoveAllToTarget(): void {
        this.onMoveToTarget();
    }
    onMoveToTarget(): void {
        this.sortComponentNames(this.selectedComponentNameArray);
    }
    onMoveAllToSource(): void {
        this.onMoveToSource();
    }
    onMoveToSource(): void {
        this.sortComponentNames(this.componentNameArray);
    }
    
    onDownloadBySelectedComponentNamePdf(): void {
        console.log('this.selectedComponentNameArray', this.selectedComponentNameArray);
        this.aircraftComponentService.downloadComponentNameInListPdf(this.selectedComponentNameArray).subscribe(
            (response) => {
                var pdfUrl = URL.createObjectURL(response);
                console.log('pdfUrl', pdfUrl);
                window.open(pdfUrl);
            }
        );
    }

    private sortComponentNames(componentNameArray: Array<AircraftComponentName.ComponentName>): void {
        componentNameArray.sort((leftSide, rightSide): number => {
            if (leftSide.name < rightSide.name) return -1;
            if (leftSide.name > rightSide.name) return 1;
            return 0;
        });
    }

}
