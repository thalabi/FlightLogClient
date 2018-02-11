import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cal-test',
    templateUrl: './cal-test.component.html',
    styleUrls: ['./cal-test.component.css']
})
export class CalTestComponent implements OnInit {

    displayDialog: boolean;
    date1: Date;
    
constructor() { }

    ngOnInit() {
        this.date1= new Date();
    }

    showDialog() {
        this.displayDialog = true;
    }

}
