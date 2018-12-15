import { Component, OnInit, Input } from '@angular/core';
import { ComponentHelper } from '../util/ComponentHelper';
import { ReplicationService } from '../service/replication.service';

@Component({
    selector: 'app-sync-button',
    templateUrl: './sync-button.component.html',
    styleUrls: ['./sync-button.component.css']
})
export class SyncButtonComponent implements OnInit {
    @Input() tableName: string;

    replicationStatus: boolean;
    replicationStatusLabel: string;
    replicationStatusControlDisabled: boolean = true;

    constructor(private replicationService: ReplicationService) { }

    ngOnInit() {
        console.log('this.tableName', this.tableName);
        this.getTableReplicationStatus();
    }

    private getTableReplicationStatus() {
        this.replicationStatusLabel = "Fetching";
        this.replicationStatusControlDisabled = false;
        ComponentHelper.getTableReplicationStatusAndLabel(this.replicationService, this.tableName).subscribe(params => {
            this.replicationStatus = params.replicationStatus;
            this.replicationStatusLabel = params.replicationStatusLabel;
        })
    }

    onChangeReplicationStatus(event) {
        this.replicationStatusLabel = "Updating";
        console.log('onChangeReplicationStatus', event);
        console.log('checked: ', event.checked);
        this.replicationStatusControlDisabled = true;
        this.replicationService.setTableReplicationStatus(this.tableName, event.checked).subscribe(params => 
            this.getTableReplicationStatus()
        );
    }

}
