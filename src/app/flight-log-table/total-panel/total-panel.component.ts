import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TotalPanelVo } from '../../domain/TotalPanelVo';

@Component({
    selector: 'app-total-panel',
    imports: [DecimalPipe],
    templateUrl: './total-panel.component.html',
    styleUrls: ['./total-panel.component.css']
})
export class TotalPanelComponent {
    @Input() totalPanelVo!: TotalPanelVo;

}
