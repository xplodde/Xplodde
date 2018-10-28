import { Injectable } from '@angular/core';

import { ContractService } from "./contract.service";
import { WalletService } from "./wallet.service";
import { DealsService } from "./deals.service";
import { Web3 } from './web3.service';

let fs = require('fs');

@Injectable()
export class EventsService {
  events = [];
  updating = false;
  constructor(private _wallet: WalletService, private _contract: ContractService, private _deals: DealsService,private _web3: Web3){
  }
  

  async getSavedEvents(){
    return JSON.parse(localStorage.getItem('events'));
  }
  async getWalletDeals(){
    let walletDeals=[];
    let wallet = this._wallet.wallet;
    this._deals.deals[this._web3.network].active.filter(deal=>{
      let accounts = wallet.filter(acc=> acc.address.toLowerCase() == deal.buyer.toLowerCase() || acc.address.toLowerCase() == deal.seller.toLowerCase())
      if(accounts.length > 0){
        let id : any = {
          id: deal.id,
        };
        accounts.forEach(acc=>{
          if(deal.buyer.toLowerCase() == acc.address.toLowerCase()){
            id.buyer = { 
              address : deal.buyer,
              marginCall : {active:deal.buyerRecharge, value:0,hash:''}
            }
          }else{
            id.seller = { 
            address : deal.seller,
            marginCall : {active:deal.sellerRecharge, value:0,hash:''}
            }
          }
        })  
        walletDeals.push(id);
      }
    })
    return walletDeals;
  }

  async getEvents(){
    let allSavedEvents = await this.getSavedEvents();
    let savedEvents = [];
    let walletDeals = [];
    let walletD = await this.getWalletDeals();
    if(allSavedEvents != null && typeof(allSavedEvents)!='undefined'){
      savedEvents = allSavedEvents[this._web3.network];
    }
    if(savedEvents.length == 0){
      this.events = await this.getWalletEvents(walletD);
    } else{
      let walletDeals = await this.comparedEvents(savedEvents, walletD);
      this.events = await this.getWalletEvents(walletDeals);
    }
    await this.saveEvents();
    this.updating = false;
  }

 async comparedEvents(savedEvents, walletDeals){

    let walletEvents = [];
    walletDeals.forEach(walletDeal=>{
      let savedId =  savedEvents.find(idObj=> idObj.id ==walletDeal.id);
      if(typeof(savedId)!= 'undefined'){ 
        if('buyer' in walletDeal && 'buyer' in savedId && JSON.stringify(walletDeal.buyer.marginCall)!=JSON.stringify(savedId.buyer.marginCall)) {
          savedId.buyer.marginCall =  walletDeal.buyer.marginCall
        }
        if('seller' in walletDeal && 'seller' in savedId && JSON.stringify(walletDeal.seller.marginCall)!=JSON.stringify(savedId.seller.marginCall)){
            savedId.seller.marginCall =  walletDeal.seller.marginCall
        }
        if('buyer' in walletDeal && !('buyer' in savedId)){
          savedId.buyer = walletDeal.buyer;
        }
        if('seller' in walletDeal && !('seller' in savedId)){
          savedId.seller = walletDeal.seller; 
        }
        walletEvents.push(savedId);
      } else{
        walletEvents.push(walletDeal)
      }
    })

    return walletEvents;
  }
 
  async getWalletEvents(walletDeals){
    let timestamp = 0;
    let dealsTimestamp = 0;
    if(localStorage.getItem('updateDate')){
      let updateDate = JSON.parse(localStorage.getItem('updateDate'));
      if('deals' in updateDate && updateDate.deals != 0){
        dealsTimestamp = updateDate.deals;
      }
      if('events' in updateDate && updateDate.events != 0){
        timestamp = updateDate.events;
      }
    }
    let lastUpdate = new Date(timestamp);
    let now = Date.now();
    let nowDate = new Date(now);

    for(let i=0; i<walletDeals.length; i++){
      if(timestamp = 0){

      }
      let isUpdated: boolean = timestamp > dealsTimestamp;
      let network = this._web3.network;

      //update MarginCall
      let change = false;
      if('buyer' in walletDeals[i]){
        if(walletDeals[i].buyer.marginCall.active && walletDeals[i].buyer.marginCall.hash != "" ||
        walletDeals[i].buyer.marginCall.active && walletDeals[i].buyer.marginCall.value == 0){
          walletDeals[i].buyer.marginCall.value = await this._contract.getMarginCall(walletDeals[i].id)
          if(walletDeals[i].buyer.marginCall.value == 0){
            walletDeals[i].buyer.marginCall.active = false;
            walletDeals[i].buyer.marginCall.hash = "";
            change =true;
            let index = this._deals.deals[this._web3.network].active.findIndex(deal => deal.id == walletDeals[i].id)
            this._deals.deals[network].active[index].buyerRecharge = false;
            this._deals.saveDeals();
          }
        }
      }
      
      if('seller' in walletDeals[i]){
          if(walletDeals[i].seller.marginCall.active == true && walletDeals[i].seller.marginCall.hash != "" ||
          walletDeals[i].seller.marginCall.active == true && walletDeals[i].seller.marginCall.value==0){
            walletDeals[i].seller.marginCall.value = await this._contract.getMarginCall(walletDeals[i].id)
            if(walletDeals[i].seller.marginCall.value == 0){
              walletDeals[i].seller.marginCall.active = false;
              walletDeals[i].seller.marginCall.hash = "";
              change =true;
              let index = this._deals.deals[this._web3.network].active.findIndex(deal => deal.id == walletDeals[i].id)
              this._deals.deals[network].active[index].sellerRecharge = false;
              this._deals.saveDeals();
            }
          }
      }
      walletDeals[i] = await this.getLiquidationsById(walletDeals[i],isUpdated)
      if(change && isUpdated){
        walletDeals[i] = await this.getRechargesById(walletDeals[i],false)
      }else{
        walletDeals[i] = await this.getRechargesById(walletDeals[i],isUpdated)
      }
    let updateDate : any;
      if(localStorage.getItem('updateDate')){
        updateDate = JSON.parse(localStorage.getItem('updateDate'));
        updateDate.events = now;
      }else{
        updateDate = {events: now}
      }
      localStorage.setItem('updateDate', JSON.stringify(updateDate))
    }
    
    return walletDeals;
  }

  async getLiquidationsById(idObj, isUpDated){
    let liquidateds =[]
    if(!isUpDated){
      liquidateds = await this._contract.getLiquidateds(idObj.id);
    }
    
    if('liquidations' in idObj && idObj.liquidations.length > 0){
      let lastLiquidation = idObj.liquidations.slice(-1)[0];
      liquidateds = liquidateds.filter(x=>x.toNumber() > lastLiquidation.timestamp);
    }else{
      idObj.liquidations = [];
    }
    for(let i=0; i<liquidateds.length; i++){
      let liquidation: any = { timestamp:liquidateds[i].toNumber() }
      liquidation.value = await this._contract.getLiquidation(idObj.id,liquidateds[i].toNumber());
      idObj.liquidations.push(liquidation)
    }
    return await idObj
  }

  async getRechargesById(idObj, isUpDated){
      if('buyer' in idObj){
        let rechargeds = [];
        if(!isUpDated){
          rechargeds = await this._contract.getRechargeds(idObj.id, idObj.buyer.address);
        }
        if('recharges' in idObj.buyer && idObj.buyer.recharges > 0){
          let lastRecharge = idObj.recharges.slice(-1);
          rechargeds = rechargeds.filter(x=> x.toNumber() > lastRecharge.timestamp);
        }else{
          idObj.buyer.recharges = []
        }
         
        for(let i=0; i<rechargeds.length; i++){
          let recharge : any = { timestamp: rechargeds[i].toNumber() };
          recharge.value = await this._contract.getRecharge(idObj.id,rechargeds[i].toNumber(), idObj.buyer.address);
          idObj.buyer.recharges.push(recharge)
        }
      }

      if('seller' in idObj){
        let rechargeds = [];
        if(!isUpDated){
          rechargeds = await this._contract.getRechargeds(idObj.id, idObj.seller.address);
        }
        if('recharges' in idObj.seller && idObj.seller.recharges > 0){
          let lastRecharge = idObj.recharges.slice(-1);
          rechargeds = rechargeds.filter(x=> x.toNumber() > lastRecharge.timestamp);
        }else{
          idObj.seller.recharges = []
        }

        for(let i=0; i<rechargeds.length; i++){
          let recharge : any = { timestamp: rechargeds[i].toNumber() };
          recharge.value = await this._contract.getRecharge(idObj.id,rechargeds[i].toNumber(),idObj.seller.address)
          idObj.seller.recharges.push(recharge)
        }
      }

    return idObj
  }

  saveEvents(){
    let events = {
      1: [],
      3: []
    }
    if(localStorage.getItem('events')){
      events = JSON.parse(localStorage.getItem('events'));
    }

    events[this._web3.network] = this.events;
    localStorage.setItem('events',JSON.stringify(events));  
  }

  marginCalltx(id, account, hash): void{
    let indexId = this.events.findIndex(idObj=> idObj.id === id);
    if(indexId != -1){
      if('buyer' in this.events[indexId] && 'address' in this.events[indexId].buyer){
        if(this.events[indexId].buyer.address.toLowerCase() === account.address.toLowerCase()){
          this.events[indexId].buyer.marginCall.hash= hash;
        }
      }
      if('seller' in this.events[indexId] && 'address' in this.events[indexId].seller){
        if(this.events[indexId].seller.address.toLowerCase() === account.address.toLowerCase()){
            this.events[indexId].seller.marginCall.hash = hash;
        }
      }
      this.saveEvents();    
    }
  }

  async checkMarginCall(id, account?){
    let change = false;
    let wIndex = this.events.findIndex(event=>event.id == id);
    let party ='';
    if('buyer' in this.events[wIndex]){
      console.log("buyer",this.events[wIndex].buyer.marginCall.active,this.events[wIndex].buyer.marginCall.hash != "" )
      if(this.events[wIndex].buyer.marginCall.active && this.events[wIndex].buyer.marginCall.hash != ""){
        console.log("1",this.events[wIndex].buyer.marginCall.value)
        this.events[wIndex].buyer.marginCall.value = await this._contract.getMarginCall(this.events[wIndex].id)
        console.log("2",this.events[wIndex].buyer.marginCall.value)
        if(this.events[wIndex].buyer.marginCall.value == 0){
          this.events[wIndex].buyer.marginCall.active = false;
          this.events[wIndex].buyer.marginCall.hash = "";
          change =true;
          party = 'buyer';
        }
      }
    }
    if('seller' in this.events[wIndex]){
      if(this.events[wIndex].seller.marginCall.active == true && this.events[wIndex].seller.marginCall.hash != ""){
        this.events[wIndex].seller.marginCall.value = await this._contract.getMarginCall(this.events[wIndex].id)
        if(this.events[wIndex].seller.marginCall.value == 0){
          this.events[wIndex].seller.marginCall.active = false;
          this.events[wIndex].seller.marginCall.hash = "";
          change =true;
          party = 'seller'
        }
      }
    }
    if(change){
      this.events[wIndex] = await this.getRechargesById(this.events[wIndex],false);
      let index = this._deals.deals[this._web3.network].active.findIndex(deal=> deal.id = this.events[wIndex].id);
      if(index !=-1){
        let network = this._web3.network;
        console.log("value of network?",network);
        
         let deal = this._deals.deals[network].active[index];
         
         deal[party+'Recharge']= false;
         deal[party+'Balance']= deal.initialValue;
         deal.daysLeft = deal.daysLeft - 1;
 
        this._deals.deals[network].active[index]= deal;
        this._deals.saveDeals();
      }
      this.saveEvents();
    }

  }

  
  deleteAddress(addr){
    let index = this.events.findIndex(item => item.address.toLowerCase() == addr.toLowerCase());
    if(index != -1){
      this.events.splice(index,1);
    }
  }
}
