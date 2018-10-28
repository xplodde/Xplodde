import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'

/*Services*/
import { AccountService } from '../../../services/account.service'
import { ContractService } from '../../../services/contract.service';
import { Web3 } from '../../../services/web3.service'
import { DealsService } from '../../../services/deals.service'

/*Dialog*/
import { MdDialog } from '@angular/material';
import { DialogService } from '../../../services/dialog.service'
import { ConfirmContractDialog } from './confirm-contract.component'
import { CreatingDealDialog } from './creatingDeal-dialog.component'
import { PairsService } from '../../../services/pairs.service';
import { RawTxService } from '../../../services/rawtx.sesrvice';

import * as EthUtils from 'ethereumjs-util';

@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.page.html',
  styleUrls: ['./new-contract.page.css']
})

export class NewContractPage implements OnInit,OnDestroy {

  actions: string[] = ['SELL','BUY'];
  pairs: string[] = ["BTC" , "EUR","USD" ];
   /*Paris value in weis */
  submited = false;
  gasLimit;

  dialogLoading;
  dialogRef;
  c: any = {};
  isOptimalI = false;
  isOptimalM =  false;

  insufficient = false;
  protected pass;
  error = ""; 
  title = "";
  message = "";
  id;

  currentPairPrices = [0,0,0];
  currentPairPrice = 0;
  
  constructor( private router: Router,public _account:AccountService, private _contract: ContractService,public _web3: Web3,
    public dialog: MdDialog, public dialogService: DialogService, private _deals: DealsService, private _pairs: PairsService, private _rawtx: RawTxService) {
      if(this._account.account!== null){
        this.defaultContract();
      }

  } 

  async ngOnInit() {
    await this._pairs.setPairsInterval();
    if(this._account.account!== null){
      await this.defaultContract();
      await this.getPairs();
      await this.getPair();
    }
  }

  ngOnDestroy(){
    clearInterval(this._pairs.pairsInterval);
  }

  getPair(){
    this.currentPairPrice = this.currentPairPrices[this.c.pair];
  }

  async getPairs(){
    for (let i = 0; i < this.currentPairPrices.length; i++) {
      this.currentPairPrices[i] = await this._contract.getPair(i);
    }
  }

  intialOptimal(type){
    if(type=="range"){
      if(this.isOptimalI==true){
        this.isOptimalI=false;
      }
    }else{
      this.isOptimalI = !this.isOptimalI
      if(this.isOptimalI == true){
        this.c.initialM = 20;
      }
    } 
    return (this.isOptimalI==true)? '~icons/arrow_icon.svg' : '';
  }

  async defaultContract(){
    this.c = {
      account: this._account.account,
      action: 1,
      pair: 0,
      quantity: 0,
      duration: 0,
      private: false,
      initialM: 1,
      maintenanceM: 1
    };
    this.isOptimalI = false;
    this.isOptimalM =  false;
    this.currentPairPrice = await this._contract.getPair(this.c.pair);
  }

  intialMargin(): number{
    let value = 0
    if(this._pairs.pairs.length != 0){
      //value = this.c.quantity * (1/this.pairsValue[this.c.pair])*(this.c.initialM/100);
      value = this.c.quantity*this._pairs.pairs[this.c.pair] * (this.c.initialM/100);
    }
    return value
  }

  maintenanceMargin(): number{
    let value = 0
    if(this._pairs.pairs.length != 0){
      value = this.intialMargin()*(this.c.maintenanceM/100)
    }
    return value
  }

  changeIntial(input){
    if(input<1){
      this.c.initialM=1;
    }else if(input>100){
      this.c.initialM=100;
    }else{
      this.c.initialM=input;
    }
  }

  changeMaint(input){
    if(input<1){
      this.c.maintenanceM=1;
    }else if(input>100){
      this.c.maintenanceM=100;
    }else{
      this.c.maintenanceM=input;
    }
  }

  changePrivate(){
    this.c.private = !this.c.private;
  }

  maintenanceOptimal(type){
    if(type=="range"){
      if(this.isOptimalM==true){
        this.isOptimalM=false;
      }
    }else{
      this.isOptimalM = !this.isOptimalM
      if(this.isOptimalM == true){
        this.c.maintenanceM = 20;
      }
    }
    return (this.isOptimalM==true)? '~icons/arrow_icon.svg' : '';
  }

  async onSubmit(){
    this.submited=true;
    if(this.c.quantity<=0 || this.c.quantity%1!=0 || this.c.duration <=0){
      return false
    }
    this.dialogLoading = this.dialogService.openLoadingDialog();
    this.c.pairText = this.pairs[this.c.pair];
    this.c.pairValue = 1/this._pairs.pairs[this.c.pair];
  
    this.c.date = Date.now();
    let fees = 0;
    let cost = 0;
    /*createDeal no paylable*/
    let createData = this._contract.newDealData(this.c);
    let estimateGas1 = await this._web3.estimateGas(this._account.account.address,this._contract.cAddress, createData);

    //To get fees for joinPayDeal
    let dealer = (this.c.action == 0)? false : true;
    let amount = this.intialMargin();
    let id = await this._contract.lastId(this._account.account.address); //estimatedID
    
    let joinData = this._contract.joinData(id,dealer);
    let estimateGas2;
    try {
      estimateGas2 =  await this._web3.estimateGas(this._account.account.address,this._contract.cAddress, joinData,amount);
    }catch (e) {
      estimateGas2 = 4700000
    }
    
    this.gasLimit = estimateGas1+estimateGas2;
    //this.gasPrice = 10;
    let gasOpt = await this.openGasDialog();
    
    if(gasOpt!=null){
      
        this.dialogLoading = this.dialogService.openLoadingDialog();
        let optionsCreate = {data: createData, gasLimit: estimateGas1, gasPrice: gasOpt.gasPrice};
        
        
        let txCreate =  await this._rawtx.createRaw(this._contract.cAddress, 0 , optionsCreate);
        let optionsJoin = {data: joinData, gasLimit: (gasOpt.gasLimit - estimateGas1), gasPrice: gasOpt.gasPrice};
        let txJoin =  await this._rawtx.createRaw(this._contract.cAddress, amount, optionsJoin);
        
        let cost =  txCreate[1]+txJoin[1];
        let fees =  cost-(amount);
                
        this.dialogLoading.close();

        let dialogRef = this.dialog.open( ConfirmContractDialog, {
          width: '660px',
          height: '450px',
          data : {
            contract: this.c,
            intial: this.intialMargin(),
            maintenance: this.maintenanceMargin(),
            fees: fees,
            cost: cost
          }
        });
        
        let self= this;
        dialogRef.afterClosed().subscribe(async function(pass){
          if (typeof(pass)=='undefined' || pass==""){
            return false
          }
          let privateKey;
          try{
            privateKey = self._account.getPrivateKey(pass)
          }catch(e){
            self.openDialogWhenError(e.message);
            return false
          }
          self.dialogRef = self.dialog.open( CreatingDealDialog,
            {
              width: '660px',
              height: '150px',
              disableClose: true,
            }
          );
          
          let isDone = await self.sendTx(txCreate[0],privateKey, 0);
          
          if(isDone) {
            //joinPayDeal newDealID
            let id = await self._contract.lastId(self._account.account.address);
            let dealInfo = await self._contract.getDealInfo(id);
            let amount = dealInfo['4'];
            
            let joinData = self._contract.joinData(id,dealer);
            let optionsJoin = {data: joinData, gasLimit: (gasOpt.gasLimit - estimateGas1), gasPrice: gasOpt.gasPrice};
            let txJoin =  await self._rawtx.createRaw(self._contract.cAddress,amount, optionsJoin);
            await self.sendTx(txJoin[0],privateKey, 1, id);
          }  
        });
      }
    }

  async sendTx(tx, privateKey, index, id?){

    tx.sign(privateKey);
            
    let serialized = "0x"+(tx.serialize()).toString('hex');
    let sendResult = await this._web3.sendRawTx(serialized);
    if(sendResult instanceof Error){
      this.openDialogWhenError(sendResult.message);
      return false;
    }else{      

      let pending: any = null;
      let j = 0;
      while(pending == null && j<60){
        pending = await this._web3.getTx(sendResult);
        
        if(index==1) {          
          this._deals.deals[this._web3.network].pending.forEach(deal => {
            if(deal.id == id){
              deal.firstJoin = sendResult;
            }
          });
         this._deals.saveDeals();
        }
        if(pending != null && index==0) {
          this._deals.updateDeals();
        }
        j++;
      }
      if(j==60){
        //Create pending object
        pending =this.createPendingObject(tx,sendResult, index);
        this._account.addPendingTx(pending);
        this.setErroParamsWhenNotConfiramtion();
        this.dialogRef.close();
        this.dialogRef = this.dialogService.openErrorDialog(this.title,this.message,this.error);
        let result = await this.dialogRef.afterClosed().toPromise();
        if(typeof(result)!= 'undefined' || result != ''){
                this.router.navigate(['/wallet/history']);
        }
        return false;
      }else{
        pending.timeStamp = Date.now()/1000;
        this._account.addPendingTx(pending);
        if(index == 0) {
          
          let status = await this._web3.getTxStatus(sendResult);
          
          if(status == 0){
            this.openDialogWhenError("Failed transaction");
            return false;
          }else {
            
            return true;
          }
        }
        if(index==1){
          this.title = "Contract has been created";
          this.message = "You can see the progress in the history tab"
          this.dialogRef.close();
          this.dialogRef = this.dialogService.openErrorDialog(this.title, this.message, this.error);
          this.dialogRef.afterClosed().subscribe(result=>{
            this._deals.deals[this._web3.network].pending.forEach(deal => {              
              if(deal.id == id){
                deal.firstJoin = "done";
              }
            });
              if(typeof(result)!= 'undefined' || result != ''){
                this.router.navigate(['/wallet/history']);
              }
          })
          this._deals.updateDeals();
        }
        return true;
      }
    }
  }

  createPendingObject(tx, hash, index){
      let obj ={
        hash: hash,
        nonce: EthUtils.bufferToInt(tx.nonce),
        from: this._account.account.address,
        to: this._contract.cAddress,
        value: parseInt(EthUtils.bufferToHex(tx.value)),
        gas:EthUtils.bufferToInt(tx.gasLimit),
        gasPrice: parseInt(EthUtils.bufferToHex(tx.gasPrice)),
        input: EthUtils.bufferToHex(tx.data),
        timeStamp: Date.now()/1000
      }
      return obj
    }
  openDialogWhenError(errorMessage){
    this.title = "Unable to create contract";
    this.message = "Something went wrong"
    this.error = errorMessage;
    this.dialogRef.close();
    this.dialogService.openErrorDialog(this.title,this.message,this.error);
  }

  setErroParamsWhenNotConfiramtion(){
    this.title = "Unable to check transaction confirmation";
    this.message = "Something went wrong"
    this.error = "We can not check network confirmation, You can see the progress in the history tab";
  }

  async openGasDialog(){
    this.dialogLoading.close();
    let dialogRef = this.dialogService.openGasDialog(this.gasLimit,10);
    let result = await dialogRef.afterClosed().toPromise();
    
    if(typeof(result) != 'undefined'){
        let obj = JSON.parse(result);
        return obj;
    }
    return null;
  }
  
}
