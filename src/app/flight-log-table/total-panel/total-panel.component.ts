import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalPanelVo } from '../../domain/TotalPanelVo';

@Component({
    selector: 'app-total-panel',
    imports: [CommonModule],
    templateUrl: './total-panel.component.html',
    styleUrls: ['./total-panel.component.css']
})
export class TotalPanelComponent {
    @Input() totalPanelVo!: TotalPanelVo;

}
