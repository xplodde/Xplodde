import { Component, OnInit } from '@angular/core'

/*Services*/
import { AccountService } from '../../services/account.service'
import { Web3 } from '../../services/web3.service';
import { EtherscanService } from '../../services/etherscan.service';
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html'
})
export class ContractComponent implements OnInit {

  constructor(public _web3: Web3, public _scan: EtherscanService, public _account: AccountService) {
  }

  ngOnInit() {}

  maxHeight(){
    var mainContent = document.getElementsByClassName('main-content')[0];
    return mainContent.getBoundingClientRect().height-110;
  }
}
