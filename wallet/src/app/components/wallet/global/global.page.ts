import { Component, OnInit, OnDestroy, DoCheck} from '@angular/core'
declare var require: any;

import { AccountService } from '../../../services/account.service'
import { ContractService } from '../../../services/contract.service'
import { Web3 } from '../../../services/web3.service';
import { DealsService } from '../../../services/deals.service';
import { JoinDialogService } from '../../../services/joindialog.service';
import { EventsService } from '../../../services/events.service';
import { DialogService } from '../../../services/dialog.service';


@Component({
  selector: 'global-page',
  templateUrl: './global.html'
})
export class GlobalPage implements OnInit, DoCheck, OnDestroy{
  allActive;
  interval;
  num = 0;
  constructor(private _dialog: DialogService, protected _account: AccountService, private _deals: DealsService ,private _contract: ContractService, private _web3: Web3, private joinDialogService: JoinDialogService, private _events : EventsService) {
  }

  async ngOnInit() {
    let self = this;
    let interval = setInterval(async ()=>{
      self.allActive = self._deals.deals[this._web3.network].active;
      if(!self._deals.updating){
        clearInterval(interval);
        this._events.getEvents();
        this._account.getEvents();
        this.interval = await this._deals.setIntervalUpdate();
      }
    },500)
  }

  ngDoCheck(){
    
    if(JSON.stringify(this.allActive)!= JSON.stringify(this._deals.deals[this._web3.network].active) && typeof(this.allActive)!='undefined' && this.num<10){
      this.allActive = this._deals.deals[this._web3.network].active;
      this._events.getEvents();
      this._account.getEvents();
      this.num++
    }
  }
  ngOnDestroy(){
    clearInterval(this.interval);
  }

  async recharge(marginCall){
    let deal = this._deals.deals[this._web3.network].active.find(deal=>deal.id == marginCall.id);
    let fees = 0;
    let cost = 0;
    /*createDeal no paylable*/
    let txData = this._contract.rechargeData(deal.id, this._account.account.address);
    let gasLimit = 1500000
    let amount = this._web3.web3.toBigNumber(marginCall.value)
    let acc = this._account.account;
    let gasPrice  = this._web3.web3.toWei('10','gwei');
    let nonce = await this._web3.getNonce(acc.address);


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
          
        let dialoRef = this.joinDialogService.openJoinDialog(deal, txParams, fees, cost, "Margin call transfer");
    })
  }

}
