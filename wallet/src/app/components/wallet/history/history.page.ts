import { Component, OnInit } from '@angular/core'

import { AccountService } from '../../../services/account.service'



@Component({
  selector: 'history-page',
  templateUrl: './history.html',
})

export class HistoryPage implements OnInit {
  //history: any;
  constructor(protected _account: AccountService) {
  }

  ngOnInit() {
    // console.log("Inited, ", devp2p)

    
  }

}