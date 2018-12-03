import { Component, OnInit, Input } from '@angular/core';
import { Abbreviate } from './abbreviate';

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
        this.abbreviatedText = Abbreviate.abbreviateText(this.inputText, this.maxLength);
        this.textAbbreviated = this.abbreviatedText ? this.abbreviatedText.length < this.inputText.length : false;
    }

}
