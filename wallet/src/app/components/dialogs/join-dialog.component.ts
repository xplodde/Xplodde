import { Component,  Inject } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import {MD_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';

/*Services*/
import { AccountService } from '../../services/account.service'
import { Web3 } from '../../services/web3.service'
import { DialogService } from '../../services/dialog.service'


import * as EthTx from 'ethereumjs-tx';
import * as EthUtil from 'ethereumjs-util'
import { EventsService } from '../../services/events.service';
import { access } from 'fs';
import { LoadingDialogComponent } from './loading-dialog.component';

@Component({
    selector: 'join-deal',
    templateUrl: './join-dialog.component.html'
})

export class JoinDialog{
    insufficient = false;
    loadingD;
    constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<JoinDialog>,private _account:AccountService, public _web3: Web3,private dialog: MdDialog,private dialogService: DialogService, private router: Router, private _events : EventsService){
        
        if(data.cost.isBigNumber){
            if(data.cost.toNumber() > _web3.web3.toWei(_account.account.balance,'ether')){
                this.insufficient = true;
            }
        }else{
            if(data.cost > _web3.web3.toWei(_account.account.balance,'ether')){
                this.insufficient = true;
            }
        }
    }

    async functionContract(pass){
        
        let privateKey;
        let action :string;
        let title = "";
        let message = "Something went wrong";
        let error = ""
        switch(this.data.text){
            case "Destroy Contract":
                action = "destroy";
                break;
            case "Join Contract":
                action = "join";
                break;
            case "Withdraw Profits":
                action = "witdraw profits of";
                break;
            case "Margin call transfer":
                action = "transfer"
                break;
        }
        try{
            privateKey = this._account.getPrivateKey(pass)
        }catch(e){
            title = "Unable to "+action+" contract";
            error = e.message;
            this.dialogRef.close();
            let dialogRef = this.dialogService.openErrorDialog(title,message,error);
            return false;
        }
        let tx= new EthTx(this.data.tx);
        tx.sign(privateKey);
        let serialized = EthUtil.bufferToHex(tx.serialize());
        
        let sendResult = await this._web3.sendRawTx(serialized);
        
        this.dialogRef.close();
        if(sendResult instanceof Error){
            title = "Unable to "+action+" contract";
            error = sendResult.message;
            let dialogRef = this.dialogService.openErrorDialog(title,message,error);
        }else{
            //let waitingDialog = this.dialogService.openWaitingTxDialog(this.data.text);
            this.dialogRef.close();
            let dialogRef;
            this.loadingD=this.dialog.open(LoadingDialogComponent, {
                width: '660px',
                height: '',
                disableClose: true,
              });

            if(action != 'transfer'){
                let pending: any = await this._web3.getTx(sendResult);
                pending.timeStamp = Date.now()/1000;
                this._account.addPendingTx(pending);
                if(action == 'join' || action == "destroy"){
                    title = "Contract has been " + action + "ed";
                }else{
                    title = "Withdraw pofits has been transfered sucsessfully"
                }
                message = "You can see the transaction in the history tab"
               // waitingDialog.close();
               this.loadingD.close();
                dialogRef = this.dialogService.openErrorDialog(title,message,error,'redirect');
            }else{
                let status = await this._web3.getTxStatus(sendResult)
                
                //let status = await this._web3.getBlockTimestamp(sendResult);
                if(status==0){
                    title = "Unable to transfer the margin Call";
                    error = "Error encountered during contract execution"
                }else{
                    title = "Margin call has been transferd sucsessfully";
                    message = "You can see the contract in the global tab";
                }
                if(action == 'transfer'){
                    let pending: any = await this._web3.getTx(sendResult);
                    pending.timeStamp = Date.now()/1000;
                    this._account.addPendingTx(pending);
                    
                    await this._events.marginCalltx(this.data.deal.id, this._account.account, sendResult)
                    await this._events.checkMarginCall(this.data.deal.id, this._account.account)
                    await this._account.getEvents();
                }
                //waitingDialog.close();
                this.loadingD.close();
                dialogRef = this.dialogService.openErrorDialog(title,message,error);
            }
                
            dialogRef.afterClosed().subscribe(result=>{
                if(typeof(result)!= 'undefined' || result != ''){
                    this.router.navigate(['/wallet/history']);
                }
            }); 
        }

    }

    closeDialog(){
        this.dialogRef.close();
    }

}