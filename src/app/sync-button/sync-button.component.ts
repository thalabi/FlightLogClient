import { Component, OnInit, Input } from '@angular/core';
import { ComponentHelper } from '../util/ComponentHelper';
import { ReplicationService } from '../service/replication.service';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-sync-button',
    templateUrl: './sync-button.component.html',
    styleUrls: ['./sync-button.component.css'],
    standalone: true,
    imports: [NgIf, ToggleButtonModule, FormsModule]
})
export class SyncButtonComponent implements OnInit {
    @Input() tableName!: string;

    replicationStatusPending!: boolean;
    replicationSupported!: boolean;
    replicationStatus!: boolean;
    replicationStatusLabel!: string;
    replicationStatusControlDisabled: boolean = true;

    constructor(private replicationService: ReplicationService) { }

    ngOnInit() {
        console.log('this.tableName', this.tableName);
        this.getTableReplicationStatus();
    }

    private getTableReplicationStatus() {
        this.replicationStatusPending = true;
        this.replicationStatusLabel = "Fetching";
        this.replicationStatusControlDisabled = false;
        this.replicationSupported = false;
        ComponentHelper.getTableReplicationStatusAndLabel(this.replicationService, this.tableName).subscribe(params => {
            this.replicationStatusPending = false;
            this.replicationSupported = params.replicationSupported;
            this.replicationStatus = params.replicationStatus;
            this.replicationStatusLabel = params.replicationStatusLabel;
        })
    }

    onChangeReplicationStatus(event: { checked: boolean; }) {
        this.replicationStatusLabel = "Updating";
        console.log('onChangeReplicationStatus', event);
        console.log('checked: ', event.checked);
        this.replicationStatusControlDisabled = true;
        this.replicationService.setTableReplicationStatus(this.tableName, event.checked).subscribe(params =>
            this.getTableReplicationStatus()
        );
    }

}
