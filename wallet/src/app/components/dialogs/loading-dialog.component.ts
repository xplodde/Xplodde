import { Component } from '@angular/core';
import { MdProgressSpinner } from '@angular/material';

import { DealsService } from '../../services/deals.service'
import { EventsService } from '../../services/events.service'

@Component({
    selector: 'loading-dialog',
    templateUrl: './loading-dialog.component.html'
})

export class LoadingDialogComponent{

    constructor(protected _deals: DealsService, protected _events: EventsService){

    }
}