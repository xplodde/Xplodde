import { Component, OnInit } from '@angular/core'

/*Services*/
import { AccountService } from '../../../services/account.service';
import { WalletService } from '../../../services/wallet.service';

import { Web3 } from '../../../services/web3.service';
import { SendDialogService } from '../../../services/send-dialog.service';
import { RawTxService } from '../../../services/rawtx.sesrvice';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'send-page',
  templateUrl: './send.html'
})

export class SendPage implements OnInit {
  public submited:boolean;

  constructor(private _web3: Web3, private _account: AccountService, private sendDialogService: SendDialogService, private _rawtx: RawTxService, private _dialog: DialogService) {
  }

  ngOnInit() {
  }

  async sendEth(form) {
    this.submited = true;
    
    if(form.invalid){
      return false;
    }
    let tx;
    let gasLimit;
    let receiver;
    receiver = form.controls.receiverAddr.value;

    try{
      if(typeof(form.controls.trans_data.value)!="undefined" && form.controls.trans_data.value != "" ){
        
        gasLimit = await this._web3.estimateGas(this._account.account.address, receiver, this._web3.web3.toHex(form.controls.trans_data.value), parseInt(this._web3.web3.toWei(form.controls.amount.value,'ether')));
      } else {
        
        gasLimit = await this._web3.estimateGas(this._account.account.address, receiver, "", parseInt(this._web3.web3.toWei(form.controls.amount.value,'ether')))
      }
    }catch(e){
      gasLimit = await this._web3.blockGas();
    }

    let dialogRef = this._dialog.openGasDialog(await gasLimit, 1);
    dialogRef.afterClosed().subscribe(async result=>{
      
      if(typeof(result) != 'undefined'){
        let obj = JSON.parse(result);

        if(typeof(form.controls.trans_data.value)!="undefined" && form.controls.trans_data.value != ""){
          obj.data = form.controls.trans_data.value;
        }
        let amount = parseInt(this._web3.web3.toWei(form.controls.amount.value,'ether'))
        tx =  await this._rawtx.createRaw(receiver, amount, obj)
        this.sendDialogService.openConfirmSend(tx[0], receiver, tx[2],tx[1]-tx[2], tx[1], "send");
      }
    })
  }

}
