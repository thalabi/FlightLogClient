import { Component } from '@angular/core';

@Component({
    selector: 'page-not-found',
    template: '<h2 class="center">Sorry, page not found</h2>',
    styles: ['.center {text-align:center;}']
})

export class _404Component {

    constructor() {}

    ngOnInit() {
        console.log('_404Component');
    }
}
