import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { DealsService } from './services/deals.service'
import { EventsService } from './services/events.service'
import { AccountService } from './services/account.service';

import {MdDialog} from '@angular/material';

import { LoadingDialogComponent } from './components/dialogs/loading-dialog.component';
import { EtherscanService } from './services/etherscan.service';


@Component({
  selector: 'ion-app',
  templateUrl: './app.html',
})
export class MyApp implements OnInit {
  loadingD;
  interval;
  
  constructor(private _deals: DealsService, private _events: EventsService, private _account: AccountService,private _scan: EtherscanService, private dialog: MdDialog, private router : Router) {
    if(this._scan.apikey=="" ){
      this.router.navigate(['/general-settings']);
    }else{
      this.loadingDialog();
    }  
  }
  async ngOnInit() {
    if(this._scan.apikey!=""){
      this._deals.updating=true;
      await this._deals.getDeals();
      this.interval = setInterval(async() => {
        if(this._deals.updating == false){
          if('address'in this._account.account){
            clearInterval(this.interval);
            if('balance' in this._account.account){
              this._events.updating = true;
              this._events.getEvents();
              this.interval = setInterval(() => {
                if (this._events.updating == false) {
                  this.loadingD.close();
                  clearInterval(this.interval);
                  this._account.getEvents();
                }
              })
            }
          }else{
            clearInterval(this.interval);
            this.loadingD.close();
          } 
        }
      })
    }
  }

  loadingDialog(){
    this.loadingD=this.dialog.open(LoadingDialogComponent, {
      width: '660px',
      height: '',
      disableClose: true,
    });
  }
  
}
