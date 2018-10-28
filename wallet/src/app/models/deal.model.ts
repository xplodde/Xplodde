export class Deal {
  public id: string;
  public status: boolean;
  public buyerRecharge : boolean;
  public sellerRecharge : boolean;
  public privateD: boolean;
  public buyer: string;
  public seller: string;
  public buyerBalance: number;
  public sellerBalance: number;
  public pair: number;
  public creationPrice: number;
  public creationDate: number;
  public startingDate : number;
  public quantity: number;
  public size: number;
  public duration: number;
  public daysLeft: number;
  public initialM: number;
  public initialValue: string;
  public maintenanceM:  number;
  public maintenanceValue:  number;
  public firstJoin: string;
  public network: number;
  
  constructor() {  }
 
}