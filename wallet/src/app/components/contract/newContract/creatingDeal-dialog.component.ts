import { Component,  Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import {MD_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'creating-deal',
    templateUrl: './creatingDeal-dialog.component.html'
})

export class CreatingDealDialog{

    constructor(@Inject(MD_DIALOG_DATA) public data: string, public dialogRef: MdDialogRef<CreatingDealDialog>){
    }
}