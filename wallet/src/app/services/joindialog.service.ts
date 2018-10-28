import { Injectable } from '@angular/core';

/*Dialog*/
import { MdDialog } from '@angular/material';
import { JoinDialog } from '../components/dialogs/join-dialog.component';


@Injectable()
export class JoinDialogService{
    constructor(public dialog: MdDialog){}

    openJoinDialog(deal,txParamas,fess, cost, waitingText){
        return this.dialog.open( JoinDialog, {
          width: '660px',
          height: '300px',
          data : {
            deal: deal,
            tx: txParamas,
            fees: fess,
            cost: cost,
            text: waitingText
          }
        });
    }
}