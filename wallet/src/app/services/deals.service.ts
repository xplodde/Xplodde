import { Injectable } from '@angular/core';

import { ContractService } from "./contract.service";
import { WalletService } from "./wallet.service";
import { Deal } from '../models/deal.model';
import { Deals } from '../models/deals.model';
import { Web3 } from './web3.service';

@Injectable()
export class DealsService {
  message:string = "";
  deals = {
    1: new Deals(),
    3: new Deals()
  };
  savedDeals: any = {
    1: new Deals(),
    3: new Deals()
  };
  updating = true;

  constructor(private _wallet: WalletService, private _contract: ContractService, private _web3: Web3){
    this._contract;
  }

  async getDeal(id){
    let seller = await this._contract.getParty(id,0);
    let buyer = await this._contract.getParty(id,1);
    let info = await this._contract.getDealInfo(id);
    let data = await this._contract.getDealData(id);

    let deal =  new Deal();

    deal.network = this._web3.network;
    deal.id = id;
    deal.status = info['0'];
    deal.privateD = data['0'];
    deal.pair=info['2'].toNumber();
    deal.duration = data['3'].toNumber();
    deal.daysLeft= info['3'].toNumber();
    deal.creationPrice = data['2'].toNumber();
    deal.creationDate = data['1'].toNumber();
    deal.startingDate = Date.now()/1000 - (deal.duration-deal.daysLeft)*24*3600;
    deal.initialM=data['4'].toNumber();
    deal.maintenanceM= data['5'].toNumber();
    deal.initialValue = info['4'].toString();  
    deal.maintenanceValue= info['5'].toNumber();
    deal.quantity=data['6'].toNumber(); 
    deal.size = info['6'].toNumber();    
    deal.buyer=buyer['0'];
    deal.seller=seller['0'];
    deal.sellerBalance = seller['1'].toNumber();
    deal.sellerRecharge = seller['5'];
    deal.buyerBalance = buyer['1'].toNumber();
    deal.buyerRecharge = buyer['5'];
    if(!this.addressEmpty(deal.buyer) && deal.buyerBalance != 0 || !this.addressEmpty(deal.seller) && deal.sellerBalance != 0){
      deal.firstJoin = "done";
    }else{
      deal.firstJoin = "";
    }
    return deal
  }

  async getDealsById(ids){
    let deals: Deal[] = []
    //getIdAddress Array Ids
    for(let i = 0; i<ids.length; i++){
      deals.push(await this.getDeal(ids[i].toNumber()));
    }
    return deals;
  }

  getSavedDeals(){
    return JSON.parse(localStorage.getItem('deals'));
  }
  
  async getDeals(){
    let savedDeals = await this.getSavedDeals();
    let pendingsIds = await this._contract.getPendingIds();
    let activeIds = await this._contract.getActiveIds();
    let ids: any = {pending:pendingsIds,active:activeIds}
    if(savedDeals!= null && typeof(savedDeals)!='undefined') {
        this.savedDeals = savedDeals;
    }
    await this.updateDeals(ids);

    this.updating = false;
  }

  async getNewDeals(deals,ids){
    let newDeals :Deal[] = [];
    let pendingIds = ids.pending;
    let newIds = [];
    for(let i=0; i<pendingIds.length; i++){
      let result = deals.pending.findIndex(deal=>{
        return pendingIds[i].toNumber() == deal.id;
      });
      if(result == -1){
        newIds.push(pendingIds[i])
      }
    }
    if(newIds.length>0){
      newDeals = await this.getDealsById(newIds);
    }
    let newPending = deals.pending.concat(newDeals)
    deals.pending = newPending;
    return deals
  }

  async removeAndUpdateStatusDeals(deals,ids){
    let removePending:Deal[] = [];
    let removeActive:Deal[] = [];
    let pendingDeals = (typeof(deals.pending)!= 'undefined')? deals.pending: [];
    //remove active deals in pending list
    for(let i=0; i<pendingDeals.length; i++){
      let result = ids.pending.findIndex(id=> id.toNumber() == pendingDeals[i].id);
      if(result != -1){
        removePending.push(pendingDeals[i])
      }
    }
    deals.pending = removePending;
    //remove closed deals in active list and add new actives
    let activeIds = ids.active;
    for(let i=0; i<activeIds.length; i++){
      let result = deals.active.findIndex(deal=>{
        return activeIds[i].toNumber() == deal.id;
      });
      if(result != -1){
        removeActive.push(deals.active[result])
      }else{
        let deal = await this.getDeal(activeIds[i].toNumber())
        let dealData = await this._contract.getDealData(activeIds[i].toNumber());
        deal.creationPrice = dealData['2'].toNumber();
        removeActive.push(await deal)
      }
    }
    deals.active = await removeActive;
    return deals;
  }

  async updateDeals(objIds?){    
    const TEN_MIN = 10*60*1000;
    let pendingIds;
    let activeIds ;
    let ids= objIds;
    if(typeof(ids)=="undefined"){
      pendingIds = await this._contract.getPendingIds();
      activeIds = await this._contract.getActiveIds();
      ids={pending:pendingIds,active:activeIds}
    }
    let timestamp = 0;
    if(localStorage.getItem('updateDate')){
      let updateDate = JSON.parse(localStorage.getItem('updateDate'));
      if('deals' in updateDate && updateDate.deals != 0){
        timestamp = updateDate.deals;
      }
    }

    let lastUpadte = new Date(timestamp);
    let now = Date.now();
    let nowDate = new Date(now);
    
    let removed = await this.removeAndUpdateStatusDeals(this.savedDeals[this._web3.network], ids);  
    let newD = await this.getNewDeals(removed,ids);
  
    for(let i = 0; i < newD.pending.length; i++){ 
      newD.pending[i] = await this.updateDeal(newD.pending[i])
    }

    if(timestamp < now - TEN_MIN){
      for(let i=0; i<newD.active.length; i++){
          newD.active[i] = await this.updateDeal(newD.active[i])
      }
      let updateDate : any;
      if(localStorage.getItem('updateDate')){
        updateDate = JSON.parse(localStorage.getItem('updateDate'));
        updateDate.deals = now;
      }else{
        updateDate = {deals: now}
      }
      localStorage.setItem('updateDate', JSON.stringify(updateDate))
    }

    this.deals[this._web3.network] = newD;
    this.saveDeals();
    
  }

  async setIntervalUpdate(){
    return setInterval(async ()=>{
      await this.updateDeals();
    },5000)
  }

  async saveDeals(){
    localStorage.setItem('deals',JSON.stringify(this.deals));
    this.savedDeals = this.getSavedDeals();
    this.deals = this.savedDeals;
  }
  
  async updateDeal(deal){
    let self=this
    let deal2: any;

    if(this._wallet.wallet != null && this._wallet.wallet.length >0){
      let buyer;
      let seller;
      let result =  this._wallet.wallet.findIndex(account=>{
        buyer = false;
        seller = false;
        if(account.address.toLowerCase() ==  deal.buyer.toLowerCase()){

          buyer = true;
        }
        if(account.address.toLowerCase() ==  deal.seller.toLowerCase()){
          seller = true;
        }
        return (buyer || seller)
      });
  
      if(result != -1 && (deal.status == true || seller && deal.sellerBalance == 0 || buyer && deal.buyerBalance == 0)){
         deal2 = await this._contract.updateDeal(deal);
         if(deal2.buyerBalance < deal.maintenanceValue){
           deal2.buyerRecharge = true;
         }
         if(deal2.sellerBalance < deal.maintenanceValue){
          deal2.sellerRecharge = true;
        }
         return deal2;
      }else{
        return deal
      }
    }else{
      return deal
    }  
  }

  updateFirstJoin(deal, account){
    if(deal.firstJoin!=''&& deal.firstJoin!='done'){
      account.history.forEach(tx=>{
        if(tx.hash == deal.firstJoin && tx.isError ==0){
          deal.firstJoin = 'done'
        }
      })
    }
  }
  
  addressEmpty(addr){
    let address =  parseInt(addr,16)
    return (address == 0)? true : false;
  }
}
