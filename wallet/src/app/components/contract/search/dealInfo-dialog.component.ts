import { Component,  Inject } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

/*Services*/
import { AccountService } from '../../../services/account.service';
import { ContractService } from '../../../services/contract.service';
import { Web3 } from '../../../services/web3.service';
import { JoinDialogService } from '../../../services/joindialog.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
    selector: 'deal-info',
    templateUrl: './dealInfo-dialog.component.html'
})

export class DealInfoDialog{

    constructor(@Inject(MD_DIALOG_DATA) public data: any, private dialogRef: MdDialogRef<DealInfoDialog>,private _account:AccountService, private _contract: ContractService,private _web3: Web3, private joinDialogService: JoinDialogService, private _dialog: DialogService){
     
    }
    createContract(){
        this.joinDeal(this.data.deal);
    }

    closeDialog(){
        this.dialogRef.close();
    }

    async joinDeal(deal){
        
        let dealer = this.addressEmpty(deal.buyer);
        let txData = this._contract.joinData(deal.id,dealer);
    
        let gasLimit = 4700000;
        let acc = this._account.account;
        let amount = this._web3.web3.toBigNumber(deal.initialValue);
        let gasPrice  = this._web3.web3.toWei('10','gwei');
        let nonce = await this._web3.getNonce(acc.address)
        
        
        this.dialogRef.close()
        
        this.closeDialog();
        let dialogRef = this._dialog.openGasDialog(await gasLimit, 10);
        dialogRef.afterClosed().subscribe(async result =>{
            let x = JSON.parse(result);
            
            let txParams = {
                nonce: nonce,
                gasPrice: this._web3.web3.toHex(x.gasPrice),
                gasLimit: this._web3.web3.toHex(x.gasLimit),
                to: this._contract.cAddress,
                value: this._web3.web3.toHex(amount),
                data: txData,
                chainId:'0x3'/////////////////////Change for mainnet/testnet
              }    

              let fees = txParams.gasLimit * txParams.gasPrice;
              let cost = fees+parseFloat(amount);
            
            let dialoRef1 = this.joinDialogService.openJoinDialog(deal.id,txParams, fees, cost, "Join Contract");
        })
        
    }
    
      addressEmpty(addr){
        let address =  parseInt(addr,16)
        return (address == 0)? true : false;
      }

}