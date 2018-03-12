import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-abbreviate',
    templateUrl: './abbreviate.component.html',
    styleUrls: ['./abbreviate.component.css']
})
export class AbbreviateComponent implements OnInit {
    @Input('text') inputText: string;
    @Input() maxLength: number;

    abbreviatedText: string;
    textAbbreviated: boolean;

    constructor() { }

    ngOnInit() {
        if (this.inputText && this.inputText.length > this.maxLength) {
            this.abbreviatedText = this.inputText.substr(0, this.inputText.lastIndexOf(' ', this.maxLength)) + ' ...';
            this.textAbbreviated = true;
        }
    }

}
