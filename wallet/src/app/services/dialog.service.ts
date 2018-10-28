import { Injectable } from '@angular/core';

/*Dialog*/
import { MdDialog } from '@angular/material';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog.component';
import { LoadingDialogComponent } from '../components/dialogs/loading-dialog.component';
import { DeleteDialog } from '../components/dialogs/confirm-delete.component';
import { GasDialogComponent } from '../components/dialogs/gas-dialog.component';
import { MessageDialogComponent } from '../components/dialogs/message-dialog.component';
import { ShowTxDialogComponent } from '../components/dialogs/showTx-dialog.component';



@Injectable()
export class DialogService{
    constructor(public dialog: MdDialog){}

    openErrorDialog(title, message, error, action?){
        return this.dialog.open(ErrorDialogComponent, {
            width: '660px',
            height: '210px',
            data: {
              title: title,
              message: message,
              error: error,
              action:action
            }
          });
    }

    openLoadingDialog(){
        return this.dialog.open(LoadingDialogComponent, {
            width: '660px',
            height: '',
            disableClose: true,
          });
    }

    openGasDialog(gasLimit, gasPrice){
        return this.dialog.open(GasDialogComponent, {
            width: '660px',
            height: '280px',
            data: {
                gasLimit: gasLimit,
                gasPrice: gasPrice
            }
          });
    }

    openDeleteDialog(objToDelete:string){
        return this.dialog.open(DeleteDialog, {
            width: '660px',
            height: '200px',
            data: objToDelete
          });
    }

    openApiKeysMessage(action){
        return this.dialog.open( MessageDialogComponent, {
            width: '660px',
            height: '',
            panelClass: 'dialog',
            data: action
        });

    }

    openShowTx(tx){
        
        return this.dialog.open( ShowTxDialogComponent, {
            width: '660px',
            height: '',
            panelClass: 'dialog',
            data: tx
        });
    }
}