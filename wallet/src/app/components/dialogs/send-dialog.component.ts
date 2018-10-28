import { Component, Inject  } from '@angular/core'
import { Router } from '@angular/router'

import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { LoadingDialogComponent } from '../dialogs/loading-dialog.component';
import { MdDialogRef, MdDialog } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

import { Web3 } from '../../services/web3.service'
import { AccountService } from '../../services/account.service'

import * as EthUtils from 'ethereumjs-util';

@Component({
  selector: 'send-dialog',
  templateUrl: './send-dialog.component.html'
})
export class SendDialogComponent{
  insufficient = false;
  protected pass;
  error = ""; 
  title = "";
  message = "";
  txs: any[];

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public _web3: Web3, public _account: AccountService, public dialogRef: MdDialogRef<SendDialogComponent>, private router: Router, public dialog: MdDialog) {
    if(parseInt(_web3.web3.toWei(this._account.account.balance,'ether')) < data.total ){
      this.insufficient= true;
    }
    if(typeof(this.data.tx.length) == 'undefined'){
      this.txs = [this.data.tx];
    }else{
      this.txs = this.data.tx;
    }
  }
   

  async sendTx(pass){
    if (typeof(pass)=='undefined' || pass==""){
      return false
    }
    let privateKey;
    try{
      privateKey = this._account.getPrivateKey(pass)
    }catch(e){
      this.openDialogWhenError(e.message);
      return false
    }
    
    for(let i=0; i<this.txs.length; i++){
      this.txs[i].sign(privateKey);
      
      let serialized = "0x"+(this.txs[i].serialize()).toString('hex');
      let sendResult = await this._web3.sendRawTx(serialized);
      this.dialogRef.close();
      
      if(sendResult instanceof Error){
        this.openDialogWhenError(sendResult.message);
        return false;
      }else{      

        let pending: any = null;
        let j = 0;
        let loadingDialog = null;
        while(pending == null && j<60){
         this.dialogRef.close();
          pending = await this._web3.getTx(sendResult);
          if(pending == null && loadingDialog==null){
            loadingDialog = this.openLoadingDialog();
          }
          j++;
        }
        if(j==60){
          //Create pending object
          pending = this.createPendingObject(sendResult, i);
          this._account.addPendingTx(pending);
          if(i==this.txs.length-1){
            this.setErroParamsWhenNotConfiramtion();
            loadingDialog.close();
            let dialogRef = this.openErrorDialog(this.title,this.message,this.error);
            dialogRef.afterClosed().subscribe(result=>{
                if(typeof(result)!= 'undefined' || result != ''){
                  this.router.navigate(['/wallet/history']);
                }
            })
          }
        }else{
          if(loadingDialog!=null){
            loadingDialog.close();
          }
          pending.timeStamp = Date.now()/1000;
          this._account.addPendingTx(pending);
          if(i==this.txs.length-1){
            this.title = "Your transaction has been sent";
            this.message = "You can see the progress in the history tab"
            //self.dialogRef.close();
            let dialogRef = this.openErrorDialog(this.title, this.message, this.error, this.data.action);
            dialogRef.afterClosed().subscribe(result=>{
                if(typeof(result)!= 'undefined' || result != ''){
                  this.router.navigate(['/wallet/history']);
                }
            })
          }
        }
      }
    }
  }

  closeDialog(){
    this.dialogRef.close();
  }

  openDialogWhenError(errorMessage){
    this.title = "Unable to complete transaction";
    this.message = "Something went wrong"
    this.error = errorMessage;
    this.dialogRef.close();
    this.openErrorDialog(this.title,this.message,this.error);
  }

  setErroParamsWhenNotConfiramtion(){
    this.title = "Unable to check transaction confirmation";
    this.message = "Something went wrong"
    this.error = "We can not check network confirmation, You can see the progress in the history tab";
  }

  createPendingObject(hash, index){
    let obj ={
      hash: hash,
      nonce: EthUtils.bufferToInt(this.txs[index].nonce),
      from: this._account.account.address,
      to: this.data.to,
      value: this.data.amount,
      gas:EthUtils.bufferToInt(this.txs[index].gasLimit),
      gasPrice:parseInt(EthUtils.bufferToHex(this.txs[index].gasPrice)),
      input: EthUtils.bufferToHex(this.txs[index].data),
      timeStamp: Date.now()/1000
    }
    return obj
  }

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
      height: '150px',
      disableClose: true,
    });
  }
}