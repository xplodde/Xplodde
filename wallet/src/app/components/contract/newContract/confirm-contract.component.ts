import { Component,  Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import {MD_DIALOG_DATA} from '@angular/material';

import { Web3 } from '../../../services/web3.service'

@Component({
    selector: 'confirm-contract',
    templateUrl: './confirm-contract.component.html'
})

export class ConfirmContractDialog{
    protected pass;
    insufficient = false;
    constructor(@Inject(MD_DIALOG_DATA) public data: any,private _web3: Web3, private dialogRef: MdDialogRef<ConfirmContractDialog>){
        if(_web3.web3.toWei(data.contract.account.balance,'ether') < data.cost ){
            this.insufficient= true;
        }
    }
    createContract(pass){
        if (typeof(pass)=='undefined' || pass==""){
            return false
        }
        this.dialogRef.close(pass);
    }

    closeDialog(){
        this.dialogRef.close();
    }

}