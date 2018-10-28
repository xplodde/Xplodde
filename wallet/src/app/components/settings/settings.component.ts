import { Component, OnInit, DoCheck } from '@angular/core'
import { Web3 } from '../../services/web3.service';
import { EtherscanService } from '../../services/etherscan.service';
import { AccountService } from '../../services/account.service';
import { DialogService } from '../../services/dialog.service';
import { Router } from '@angular/router';

import { DealsService } from '../../services/deals.service';
import { ContractService } from '../../services/contract.service';

const shell = require('electron').shell;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, DoCheck{
  languages=[{lang:'en', text:"English"}]
  lang = 'en';
  showErrorDialog = false;
  etherscanApiKey: string;
  constructor(private _scan: EtherscanService, private _account: AccountService, private _dialog: DialogService, private _contract: ContractService, private _deals: DealsService, private router: Router) {
    
    this.etherscanApiKey = (_scan.apikey=="")? null: _scan.apikey;
  }


  async ngOnInit() {
    
    if(!this.showErrorDialog && this.etherscanApiKey==null){
      let loadingDialog;
      Promise.resolve().then(()=>{
      loadingDialog = this._dialog.openLoadingDialog();
      this._deals.updating=true;
      })
      await this._deals.getDeals();
      let interval = setInterval(async() => {
        if(this._deals.updating == false){
          clearInterval(interval);
          loadingDialog.close();
        };
      })
    }
    if(this.etherscanApiKey==null){
      Promise.resolve().then(()=>{
        this._dialog.openApiKeysMessage('init');
      })
    }
  }

  ngDoCheck() {
    if(this.etherscanApiKey== "" && this.showErrorDialog){
      Promise.resolve().then(()=>{
        this.showErrorDialog = false;
        let dialogRef = this._dialog.openApiKeysMessage('error');    
      });
    }
  }

  setEtherscanKey(){
    if(this.etherscanApiKey == ""){
      this.setShowTrue();  
    }  
    this._scan.setApiKey(this.etherscanApiKey)
  }

  setShowTrue() {
    if(this.etherscanApiKey!="") {
      this.showErrorDialog = true;
    }
  }

  openUrl(url){
    shell.openExternal(url);
  }

  accept(){
    if(this.etherscanApiKey != null && this.etherscanApiKey != ""){
      this.router.navigate(['/wallet/global']);
    }else{
      return false;
    }
  }
}
