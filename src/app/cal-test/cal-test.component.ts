import { Component, OnInit, VERSION } from '@angular/core';

@Component({
    selector: 'app-cal-test',
    templateUrl: './cal-test.component.html',
    styleUrls: ['./cal-test.component.css']
})
export class CalTestComponent implements OnInit {

    displayDialog: boolean;
    date1: Date;
    version: any;
    
constructor() { }

    ngOnInit() {
        this.date1= new Date();
        this.version = VERSION.full;
    }

    showDialog() {
        this.displayDialog = true;
    }

}
