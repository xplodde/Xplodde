import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router';

import { Deal } from '../../../models/deal.model';

/*Services*/
import { AccountService } from '../../../services/account.service'
import { DealsService } from '../../../services/deals.service';
import { PairsService } from '../../../services/pairs.service';
import { Web3 } from '../../../services/web3.service';

@Component({
  selector: 'app-global-position',
  templateUrl: './global-position.page.html',
})
export class GlobalPositionPage implements OnInit, DoCheck, OnDestroy {
  pendingDeals: Array<Deal> = [];
  activeDeals:  Array<Deal> = [];
  allActive = [];
  allPending = []
  deals: Deal[] = [];
  status : number = 0;
  searching : boolean = false;
  interval;
  constructor(public _account:AccountService, private _web3: Web3, private _deals: DealsService, private route: ActivatedRoute, private _pairs: PairsService) { 
    this.getPendingDeals();
    this.getActiveDeals();
    this.dealsList()
    this.searching = true;
  }

  async ngOnInit() {
    await this._pairs.setPairsInterval();
    await this._pairs.setDailyInterval();
    await this.getPendingDeals();
    await this.getActiveDeals();
    this.route.params.subscribe(params => {
      this.status = params['status']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
   });
    this.dealsList()
    this.searching = false;
    
    let interval = setInterval(async ()=>{
      clearInterval(interval);
      this.interval = await this._deals.setIntervalUpdate();
      
    },1000);
    //example Deals
  }

  ngOnDestroy(){ 
    clearInterval(this.interval);
    clearInterval(this._pairs.pairsInterval);
  }

  async ngDoCheck(){
    if(JSON.stringify(this.allPending) != JSON.stringify(this._deals.deals[this._web3.network].pending)){
      this.allPending = this._deals.deals[this._web3.network].pending;
      await this.getPendingDeals();
      await this.dealsList();
    }
    if(JSON.stringify(this.allActive) != JSON.stringify(this._deals.deals[this._web3.network].active)){
      this.allActive = this._deals.deals[this._web3.network].active;
      await this.getActiveDeals();
      await this.dealsList();
    }
  }

  async getPendingDeals(){ 
    let address = this._account.account.address.toLowerCase();
    
    this.pendingDeals = this._deals.deals[this._web3.network].pending.filter(deal=>
      (deal.status == false && (deal.buyer.toLowerCase() == address ||  deal.seller.toLowerCase() == address))
    );
  }

  async getActiveDeals(){
    let address = this._account.account.address.toLowerCase();
    this.activeDeals = this._deals.deals[this._web3.network].active.filter(deal=>{
      return (deal.status == true && (deal.buyer.toLowerCase() == address ||  deal.seller.toLowerCase() == address))
    });
  }

  dealsList(){
    this.searching = true;
    if(this.status==0){
      this.deals = this.pendingDeals;
    }else{
      this.deals = this.activeDeals;
    }
    this.searching = false;
  }

  addressEmpty(addr){
    let address =  parseInt(addr,16)
    return (address == 0)? true : false;
  }
}
