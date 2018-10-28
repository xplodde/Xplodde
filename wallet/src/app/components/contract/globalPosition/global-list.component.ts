import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Deal } from '../../../models/deal.model';

/*Services*/
import { AccountService } from '../../../services/account.service'
import { ContractService } from '../../../services/contract.service';
import { Web3 } from '../../../services/web3.service'
import { JoinDialogService } from '../../../services/joindialog.service'
import { DealsService } from '../../../services/deals.service';
import { PairsService } from '../../../services/pairs.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'deal-list',
  templateUrl: './global-list.component.html',
  styleUrls: ['./global-position.css']
})
export class GlobalListComponent implements OnInit, OnChanges{
    @Input() deals: Deal[];
    @Input() address: "string";

    pairs: string[] = ["BTC", "EUR","USD" ];
    loading = false;
    totalPages = 0;

    items: any[];

    constructor(private _dialog: DialogService, protected _account:AccountService, protected _contract: ContractService, protected _web3: Web3, protected _deals: DealsService, protected joinDialogService: JoinDialogService, protected _pairs: PairsService ){
    }

    ngOnInit(): void {        
      //this._deals.getDeals();
    }

    ngOnChanges(): void {
    }
    
  
    async destroyDeal(deal){
      let fees = 0;
      let cost = 0;
      /*createDeal no paylable*/
      let amount = 0;
        
      let txData = this._contract.cancelData(deal.id);
      
      let estimateGas = await this._web3.estimateGas(this._account.account.address,this._contract.cAddress, txData);
      
      let acc = this._account.account;
      let gasPrice  = this._web3.web3.toWei('10','gwei');
      let nonce = await this._web3.getNonce(acc.address);

      let dialogRef = this._dialog.openGasDialog(await estimateGas, 10);
      dialogRef.afterClosed().subscribe(async result =>{
          let x = JSON.parse(result);
          
          let txParams = {
              nonce: nonce,
              gasPrice: this._web3.web3.toHex(x.gasPrice),
              gasLimit: this._web3.web3.toHex(x.gasLimit),
              to: this._contract.cAddress,
              data: txData,
              chainId:'0x3'/////////////////////Change for mainnet/testnet
            }    

            let fees = txParams.gasLimit * txParams.gasPrice;
            let cost = fees;
          
          let dialoRef = this.joinDialogService.openJoinDialog(deal.id,txParams, fees, cost, "Destroy Contract");
      })
    }

    async withdraw(deal){
      let fees = 0;
      let cost = 0;
      /*createDeal no paylable*/
      let txData = this._contract.withdrawData(deal.id);
      
      let estimateGas = await this._web3.estimateGas(this._account.account.address,this._contract.cAddress, txData);
      deal.initialValue = parseInt(deal.initialValue);
      let acc = this._account.account;
      let gasPrice  = this._web3.web3.toWei('10','gwei');
      let nonce = await this._web3.getNonce(acc.address);
      fees = estimateGas*gasPrice;
      cost = fees;
        let txParams = {
          nonce: nonce,
          gasPrice: this._web3.web3.toHex(gasPrice),
          gasLimit: this._web3.web3.toHex(estimateGas),
          to: this._contract.cAddress,
          data: txData,
          chainId:'0x3'/////////////////////Change for mainnet/testnet
        }
        let dialoRef = this.joinDialogService.openJoinDialog(deal,txParams, fees, cost, "Withdraw Profits");
    }

    async joinDeal(deal){
      let dealer = !this._deals.addressEmpty(deal.buyer);
      let txData = this._contract.joinData(deal.id,dealer);
  
      let gasLimit = 1000000;
      let acc = this._account.account;
      let amount = this._web3.web3.toBigNumber(deal.initialValue);
      let gasPrice  = this._web3.web3.toWei('10','gwei');
      let nonce = await this._web3.getNonce(acc.address)
      
      let dialogRef = this._dialog.openGasDialog(await gasLimit, 1);
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

              this._deals.deals[this._web3.network].pending.forEach(item => {
                if(item.id == deal.id){
                  item.firstJoin = true;
                }
              });
              this._deals.saveDeals();

            let dialoRef = this.joinDialogService.openJoinDialog(deal.id,txParams, fees, cost, "Join Contract");
        })
  }
}