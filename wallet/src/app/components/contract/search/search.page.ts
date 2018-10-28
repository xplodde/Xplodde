import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core'

/*Services*/
import { AccountService } from '../../../services/account.service'
import { ContractService } from '../../../services/contract.service';
import { Web3 } from '../../../services/web3.service'
import { DealsService } from '../../../services/deals.service'
import { JoinDialogService } from '../../../services/joindialog.service'

/*Dialog*/
import { MdDialog } from '@angular/material';

import { Deal } from '../../../models/deal.model'

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.css']
})
export class SearchPage implements OnInit, DoCheck, OnDestroy {
  show = false;
  showText = "Advanced search";
  showId=false;
  searching= false;
  advancedSearch = false;
  f:any={
  };
  pairs: string[] = ["BTC" , "EUR","USD" ];
  quantities = [
    [0,5],[6,10],[11,20],[21,50],[51,100], [101,200],[201,300],[301,500],[500]
  ]
  durations = [
    [0,6],[7,14],[15,30],[31,60],[61,90], [91,180],[181,365],[365]
  ]
  iMargins = [
    [0,10], [11,20], [21,30], [31,40], [41,50], [51,60], [61,70], [71,80], [81,90], [91,100]
  ]
  mMargins = [
    [0,10], [11,20], [21,30], [31,40], [41,50], [51,60], [61,70], [71,80], [81,90], [91,100]
  ]

  dealId: Deal;
  pending: Deal[] = [];
  deals: Deal[] = [];
  interval;

  constructor(private _account:AccountService, private _contract: ContractService, private _deals: DealsService, private _web3: Web3, private joinDialogService: JoinDialogService) {
    this.deals = this._deals.deals[this._web3.network].pending
  }
  
  async ngOnInit() {
    this.deals = this._deals.deals[this._web3.network].pending
    this.searching= true;
    await this.getPendingDeals();
    await this._deals.updateDeals();
    this.searching= false;
    let interval = setInterval(async ()=>{
      clearInterval(interval);
      this.interval = await this._deals.setIntervalUpdate();
      
    },1000);
  }
  async ngDoCheck(){
    if(this.deals.toString() != this._deals.deals[this._web3.network].pending.toString()){
      this.deals = this._deals.deals[this._web3.network].pending;
      if(this.advancedSearch==false){
        await this.getPendingDeals();
      }else{
        await this.onSubmit();
      }
      
      
    }
  }
  ngOnDestroy(){
    clearInterval(this.interval);
  }

  toogleShow(){
    this.show = !this.show;
    this.showText = (this.show)? "Simplyfied search" : "Advanced search"
  }

  async onSubmit(){
    this.advancedSearch=true;
    let f=this.f;
    this.showId=false;
    this.searching = true;
    this.getPendingDeals();
    console.log(f.action+","+f.pair+","+f.quantity+","+ f.initialM+","+ f.maintM+","+ f.duration)
    if(typeof(f.action)=='undefined' && typeof(f.pair)=='undefined' && typeof(f.quantity)=='undefined' &&
       typeof(f.initialM)=='undefined' &&  typeof(f.maintM)=='undefined' && typeof(f.duration)=='undefined'){
        
        return false
    }
    let deals = this.pending;

    if(typeof(f.action)!='undefined'){
      if(f.action == 0){
        deals = deals.filter((deal:any)=> !this.addressEmpty(deal.buyer))
      }else{
        deals = deals.filter((deal:any)=> !this.addressEmpty(deal.seller))
      }
    }

    if(typeof(f.pair)!='undefined'){
      deals = deals.filter((deal:any)=> deal.pair == f.pair)
    }
    if(typeof(f.quantity)!='undefined'){
        if(this.quantities[f.quantity].length == 1){
            deals = deals.filter((deal:any)=> deal.quantity > this.quantities[f.quantity][0])
        }else{
            deals = deals.filter((deal:any)=> deal.quantity > this.quantities[f.quantity][0]&& deal.quantity<this.quantities[f.quantity][1])
        }
    }

    if(typeof(f.initialM)!='undefined'){
        if(this.iMargins[f.initialM].length == 1){
            deals = deals.filter((deal:any)=> deal.initialM > this.iMargins[f.initialM][0])
        }else{
            deals = deals.filter((deal:any)=> {
            return deal.initialM >= this.iMargins[f.initialM][0]&& deal.initialM<=this.iMargins[f.initialM][1]})
        }

    }
    if(typeof(f.maintM)!='undefined'){
        if(this.mMargins[f.maintM].length == 1){
            deals = deals.filter((deal:any)=> deal.maintenanceM > this.mMargins[f.maintM][0])
        }else{
            deals = deals.filter((deal:any)=> deal.maintenanceM >= this.mMargins[f.maintM][0]&& deal.initialM<=this.mMargins[f.maintM][1])
        }
    }
    if(typeof(f.duration)!='undefined'){
        if(this.durations[f.duration].length == 1){
            deals = deals.filter((deal:any)=> deal.duration > this.durations[f.duration][0])
        }else{
            deals = deals.filter((deal:any)=> deal.duration >= this.durations[f.duration][0]&& deal.initialM<=this.durations[f.duration][1])
        }
    }
    this.pending = deals;
    this.searching= false;
  }
  reset(){
    this.f = {};
  }

  async getDealId(id){
    this.advancedSearch=false;
    this.searching = true;
    this.showId= true;
    await this._deals.updateDeals();
    this.dealId = await this.deals.filter(deal=> (deal.buyer.toLowerCase() != this._account.account.address.toLowerCase() 
    && deal.seller.toLowerCase() != this._account.account.address.toLowerCase() && deal.id == id))[0]
    if(typeof(this.dealId)!="undefined"){
      this.dealId.size =  this._web3.web3.fromWei(await this._contract.getPair(this.dealId.pair), 'ether') *this.dealId.quantity;
    }

    this.searching = false;
  }

  async getPendingDeals(){
    this.searching = true;
    this.pending = this.deals.filter(deal=>{
      return (deal.buyer.toLowerCase() != this._account.account.address.toLowerCase() 
    && deal.seller.toLowerCase() != this._account.account.address.toLowerCase() && deal.privateD == false )})
    this.searching = false;
  }

  

  async joinDeal(deal){
        
    let dealer = this.addressEmpty(deal.buyer);
    let txData = this._contract.joinData(deal.id,dealer);

    let gasLimit = 4700000;
    let acc = this._account.account;
    let amount = deal.initialValue;
    let gasPrice  = this._web3.web3.toWei('10','gwei');
    let nonce = await this._web3.getNonce(acc.address)
    
    let fees = gasLimit*gasPrice;
    let cost = fees+parseFloat(amount);

    let txParams = {
      nonce: nonce,
      gasPrice: this._web3.web3.toHex(gasPrice),
      gasLimit: this._web3.web3.toHex(gasLimit),
      to: this._contract.cAddress,
      value: this._web3.web3.toHex(amount),
      data: txData,
      chainId:this._web3.network
    }
    let dialoRef = this.joinDialogService.openJoinDialog(deal.id,txParams, fees, cost, "Join contract");
  }

  addressEmpty(addr){
    let address =  parseInt(addr,16)
    return (address == 0)? true : false;
  }

}
