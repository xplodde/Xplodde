import { Injectable } from '@angular/core';

import * as EthWallet from 'ethereumjs-wallet'
import * as EthUtil from 'ethereumjs-util';
import { write, readFile } from 'fs';

declare var require: any;

const fs = require('fs');
const homedir = require('os').homedir();
const xploddePath = homedir+"/.xplodde";

@Injectable()
export class WalletService {
  wallet: Array<any>;

  constructor() {
    this.wallet = new Array();
    this.getWallet();
    
  }

  getWallet():void{
    if(localStorage.getItem('ethAcc')){
      this.wallet = JSON.parse(localStorage.getItem('ethAcc'));
    }
  }

  newAccount(name, pass):void {

    let wallet = EthWallet.generate();
    this.addAccount(wallet, pass, name);
   
  }

  importAccountJSON(name, json, pass){
    let acc:any = {}
    let error = false;
    let wallet;
    let self = this;
    try{
        wallet = EthWallet.fromV3(json,pass, true);
    }catch(e){
        error = true
        throw e;
    }
      if(!error){
        this.addAccount(wallet, pass, name);
      }
  }

  importAccountPrivate(name, privateKey,  pass):void{
    let acc:any = {}
    let wallet;
    let error = false;
    try {
      wallet = this.accountFromPrivatekey(privateKey)
    }catch(e) {
      error = true;
      throw e;
    }

    if(!error){      
      this.addAccount(wallet, pass, name);
    } 
  }

  accountFromPrivatekey(privateKey): EthWallet{
    let wallet: EthWallet;
    try{
      wallet = new EthWallet( EthUtil.toBuffer(privateKey));

    }catch(e){
      //error = true;
      throw e;
    }

    return wallet;
  }
  
  addAccount(wallet, pass, name){
    let acc = {
      v3 : wallet.toV3(pass),
      address :  wallet.getAddressString(),
      name : name
    }

    let fileName = wallet.getV3Filename();
    try{
      this.writeAccountLocally(acc.v3, fileName)
    }catch(e){
      throw new Error("Unable to write file to backup");
    }
     
    if(!localStorage.getItem('ethAcc')){
      let acca= new Array();
      acca[0]=acc;
      localStorage.setItem('ethAcc',JSON.stringify(acca));
  
    }else{
      let  acca= JSON.parse(localStorage.getItem('ethAcc'));
      acca.push(acc);
      localStorage.setItem('ethAcc',JSON.stringify(acca));
    }  
    this.getWallet();//To refresh wallet
  }

  delete(addr):void{
    this.wallet = this.wallet.filter(x => x.address != addr);
    
    if(this.wallet == []){
      localStorage.removeItem('ethAcc');
    }else{
      localStorage.setItem('ethAcc',JSON.stringify(this.wallet));
    }
  }

  getAccount(addr): any{
    let acc = this.wallet.find(x => (x.address).toLowerCase() === addr.toLowerCase());
    return acc;
  }

  writeAccountLocally(v3, fileName){
    if(!fs.existsSync(xploddePath)){
      fs.mkdirSync(xploddePath);
    }
    let filePath =xploddePath+"/"+fileName+".json";
    fs.writeFileSync(filePath , JSON.stringify(v3));
    this.checkFileSaved(v3);

  }

  checkFileSaved(v3){
    let files = fs.readdirSync(xploddePath);
    
    for(let i=0; i<files.length; i++){
      if(files[i].indexOf(v3.address)){
      
        let data = fs.readFileSync(xploddePath+"/"+files[i]);
    
      }
    }
  }


}
