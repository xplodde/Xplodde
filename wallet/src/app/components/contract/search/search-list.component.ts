import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { ContractService } from '../../../services/contract.service';
import { Web3 } from '../../../services/web3.service'
import { DialogService } from '../../../services/dialog.service'

/*Dialog*/
import { MdDialog } from '@angular/material';
import { DealInfoDialog } from './dealInfo-dialog.component'

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search.css']
})
export class SearchListComponent implements OnInit, OnChanges {
    @Input() deals: any;
    @Input() pairs: any[];
    //@Input() address: "string";

    loading = false;
    totalPages = 0;
    page = 1;
    limit = 10;

    items: any[];

    constructor(private _contract: ContractService,public _web3: Web3,public dialog: MdDialog, public dialogService: DialogService) {
    }

    ngOnInit(): void {
        this.totalPages = Math.ceil(this.deals.length/this.limit);
        this.getItmes();
    }
    ngOnChanges(): void {
        this.totalPages = Math.ceil(this.deals.length/this.limit);
        if(this.page==1){
            this.getItmes();
        }
    }

    getItmes(): void {
        let from = this.limit*(this.page-1);
        let to = from + this.limit;
        this.items = this.deals.slice(from, to);
    }

    goToPage(n: number): void {
        this.page = n;
        this.getItmes();
    }

    addressEmpty(addr){
        let address =  parseInt(addr,16)
        return (address == 0)? true : false;
    }

    async dealInfo(deal){
        let price =  this._web3.web3.fromWei(await this._contract.getPair(deal.pair), 'ether');
        deal.size = deal.quantity * price
        let action = (this.addressEmpty(deal.buyer))? 'false' :'true'
        let dialogRef = this.dialog.open( DealInfoDialog, {
          width: '660px',
          height: '300px',
          data : {
            deal: deal,
            action: action,
            pairText : this.pairs[deal.pair]
          }
        });
      }
}