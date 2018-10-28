import { Injectable } from '@angular/core';

import { ContractService } from "./contract.service";

@Injectable()
export class PairsService {
    pairsLength : number =  3;
    pairs: number[];
    dailyPairs: number[];
    pairsInterval;
    dailyInterval;
    constructor(private _contract: ContractService){
        this.pairs = new Array(this.pairsLength).fill(0);
        this.dailyPairs = new Array(this.pairsLength).fill(0);
    }
    async setPairs(){
        for(let i=0; i< this.pairsLength; i++){
            this.pairs[i] =  await this._contract.getPair(i);
        }
    }
    async setDailyPairs(){
        for(let i=0; i< this.pairsLength; i++){
            this.dailyPairs[i] =  await this._contract.getDailyPair(i);
        }
    }

    async setPairsInterval(){
        this.setPairs();
        this.pairsInterval = setInterval(async()=>{
            await this.setPairs();
        },600000)
        
    }
    async setDailyInterval(){
        this.setDailyPairs();
        this.pairsInterval = setInterval(async()=>{
            await this.setDailyPairs();
        },600000)
        
    }
    

}