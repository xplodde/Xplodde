import { Injectable } from '@angular/core';

import { Web3 } from "./web3.service";
import { WalletService } from "./wallet.service";

let fs = require('fs');

@Injectable()
export class ContractService {
  abi : any = {};
  private adresses = {
    1 : "0x4ce5615485d4BE300C1e413a27B4fDdCaD7B2fa2", //CAMBIAR
    3 : "0x5ce5615485d4BE300C1e413a27B4fDdCaD7B2fa3"
  }
  cAddress = "0x5ce5615485d4BE300C1e413a27B4fDdCaD7B2fa3"
  contract;

  constructor(private _web3: Web3, private _wallet: WalletService){
    this.setContract();
    
  }

  setContract(){
    this.cAddress =this. adresses[this._web3.network];
    this.getAbi();
    if(this._web3.infuraKey != ''){
      this.contract =this._web3.web3.eth.contract(this.abi).at(this.cAddress);
    }
  }
  getAbi(){
    this.abi = require('../../assets/abi.json');
  }

  newDealData(data):string{
    let action = (data.action == 0)? false : true;
    let txData=this.contract.createDeal.getData(action, data.duration, data.initialM, data.maintenanceM, data.quantity, data.pair, data.private);
    
    return txData
  }
  
  joinData(deal_id, dealer):string{
    let txData = this.contract.joinAndPayDeal.getData(deal_id,dealer);
    return txData
  }

  cancelData(deal_id):string{
    
    let txData = this.contract.cancelDeal.getData(deal_id);
    
    return txData
  }

  rechargeData(deal_id, addr){
    let txData = this.contract.rechargeDealer.getData(deal_id,{from: addr, gas:10000000000});
    return txData
  }

  withdrawData(deal_id):string{
    let txData = this.contract.withdrawProfits.getData(deal_id);
    return txData;
  }

  lastId(addr){
    let self=this
      return new Promise (function (resolve, reject) {
        self.contract.lastDeal.call(addr,function(err, res){  
          if (err) {
            reject(err);
          } else {
            resolve(res.toNumber());
        }
      });
    });
  }

  getPair (index): Promise<number>{
    let self=this
      return new Promise (function (resolve, reject) {
        self.contract.pair.call(index,function(err, res){  
          if (err) {
            reject(err);
          } else {
            resolve(res.toNumber());
        }
      });
    });
  }

  getDailyPair (index): Promise<number>{
    let self=this
      return new Promise (function (resolve, reject) {
        self.contract.dailyPair.call(index,function(err, res){  
          if (err) {
            reject(err);
          } else {
            resolve(res.toNumber());
        }
      });
    });
  }

  getDealInfo(id){
    let self=this
      return new Promise (function (resolve, reject) {
        self.contract.getDealInfo.call(id,function(err, res){  
          if (err) {
            reject(err);
          } else {
            resolve(res);
        }
      });
    });
  }

  getDealData(id){
    let self=this
      return new Promise (function (resolve, reject) {
        self.contract.getDealData.call(id,function(err, res){  
          if (err) {
            reject(err);
          } else {
            resolve(res);
        }
      });
    });
  }

  getParty(id,dealer){
    let self=this
      return new Promise (function (resolve, reject) {
        self.contract.getDealerInfo.call(id, dealer,function(err, res){  
          if (err) {
            reject(err);
          } else {
            resolve(res);
        }
      });
    });
  } 

  getPendingIds(): Promise<Array<any>> {
    let self=this
      return new Promise (function (resolve, reject) {
        self.contract.getPendings.call(function(err, res){  
          if (err) {
            reject(err);
          } else {            
            resolve(res);
        }
      });
    });
  }

  getActiveIds(): Promise<Array<any>> {
    let self=this
      return new Promise (function (resolve, reject) {
        self.contract.getActive.call(function(err, res){  
          if (err) {
            reject(err);
          } else {
            resolve(res);
        }
      });
    });
  }

  getLiquidateds(id): Promise<Array<any>>{
    let self=this
      return new Promise (function (resolve, reject) {
        self.contract.getLiquidateds.call(id,function(err, res){  
          if (err) {
            reject(err);
          } else {
            resolve(res);
        }
      });
    });
  }

  getLiquidation(id, timestamp){
    let self=this
    return new Promise (function (resolve, reject) {
      self.contract.getPastLiquidated.call(id,timestamp,function(err, res){  
        if (err) {
          reject(err);
        } else {
          resolve(res.toNumber());
        }
      });
    });
  }

  getRechargeds(id, addr): Promise<Array<any>>{
    let self=this
      return new Promise (function (resolve, reject) {
        self.contract.getRechargeTimestamps.call(id,{from: addr},function(err, res){  
          if (err) {
            reject(err);
          } else {
            resolve(res);
        }
      });
    });
  }

  getRecharge(id, timestamp, addr): Promise<number>{
    let self=this
    return new Promise (function (resolve, reject) {
      self.contract.getRecharge.call(id,timestamp,{from: addr},function(err, res){  
        if (err) {
          reject(err);
        } else {
          resolve(res.toString());
        }
      });
    });
  }

  getMarginCall(id): Promise<number>{
    let self=this
    return new Promise (function (resolve, reject) {
      self.contract.getAmounts.call(id,function(err, res){  
        if (err) {
          reject(err);
        } else {
          resolve(res['1'].toNumber());
        }
      });
    });

  }
  
  getPendingRecharge(id): Promise<number>{
    let self=this
    return new Promise (function (resolve, reject) {
      self.contract.getAmounts.call(id,function(err, res){  
        if (err) {
          reject(err);
        } else {
          resolve(res.toNumber());
        }
      });
    });
  }
  
  getUpdatedDealInfo(deal){
    let self=this;
    new Promise (function (resolve, reject) {
      self.contract.getBalancesAndTimeLeft.call(deal.id,function(err, res){  
        if (err) {
          reject(err);
        } else {
          deal.sellerBalance = res['0'].toNumber();
          deal.buyerBalance = res['1'].toNumber();   
          deal.daysLeft = res['2'].toNumber();
          resolve(deal);
        }
      });
    });
  }

  async updateDeal(deal){
    let self=this
    return new Promise (function (resolve, reject) {
      self.contract.getBalancesAndTimeLeft.call(deal.id,function(err, res){  
        if (err) {
          reject(err);
        } else {              
          deal.sellerBalance = res['0'].toNumber();
          deal.buyerBalance = res['1'].toNumber();   
          deal.daysLeft = res['2'].toNumber();
          resolve(deal);
        }
      });
    });
  }
}
