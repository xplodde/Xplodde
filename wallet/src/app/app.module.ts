
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }  from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { MdInputModule, MdCheckboxModule, MdSidenavModule } from '@angular/material';
import { MdCardModule, MdButtonModule, MD_DIALOG_DATA} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDialogModule } from '@angular/material';



/*Routes*/
import { AppRoutingModule } from './app.routes';


/*Components*/
import { MyApp } from './app.component';
import { NavComponent } from './components/navComponent/nav.component';
import { NetWorkComponent } from './components/network/network.component';

import { PaginatorComponent } from './components/paginator/paginator.component';

import { WalletComponent } from './components/wallet/wallet.component';
import { GlobalPage } from './components/wallet/global/global.page';
import { SendPage } from './components/wallet/send/send.page';
import { ReceivePage } from './components/wallet/receive/receive.page';
import { HistoryPage } from './components/wallet/history/history.page';
import { ListComponent } from './components/wallet/history/list.component';
import { WsettingsPage } from './components/wallet/wsettings/wsettings.page';

import { ContractComponent } from './components/contract/contract.component';
import { NewContractPage } from './components/contract/newContract/new-contract.page';
import { GlobalPositionPage  } from './components/contract/globalPosition/global-position.page';
import { GlobalListComponent } from './components/contract/globalPosition/global-list.component';
import { SearchPage } from './components/contract/search/search.page';
import { SearchListComponent } from './components/contract/search/search-list.component';

import { TokensComponent } from './components/tokens/tokens.component';
import { GeneralPage } from './components/tokens/general/general.page';
import { SendTokensPage } from './components/tokens/send/send-tokens.page';
import { AddTokenPage } from './components/tokens/add/add.page';

import { SettingsComponent } from './components/settings/settings.component';

/*Dialogs*/
import { SelectAccountDialogComponent } from './components/navComponent/selectAccount-dialog.component';
import { AddAccountDialogComponent } from './components/navComponent/addAccount-dialog.component';
import { NewAccountDialogComponent } from './components/navComponent/newAccount-dialog.component';
import { ImportAccountDialogComponent } from './components/navComponent/importAccount-dialog.component';
import { SendDialogComponent } from './components/dialogs/send-dialog.component';
import { DeleteComponent } from './components/wallet/wsettings/confirm-delete.component';
import { JSONDialogComponent } from './components/wallet/wsettings/json-dialog.component';
import { PrivateKeyDialogComponent } from './components/wallet/wsettings/privatekey-dialog.component';
import { ErrorDialogComponent } from './components/dialogs/error-dialog.component';
import { LoadingDialogComponent } from './components/dialogs/loading-dialog.component';
import { MessageDialogComponent } from './components/dialogs/message-dialog.component';
import { DeleteDialog } from './components/dialogs/confirm-delete.component';
import { GasDialogComponent } from './components/dialogs/gas-dialog.component';
import { ShowTxDialogComponent } from './components/dialogs/showTx-dialog.component';
import { ResendTxDialogComponent } from './components/dialogs/resendTx-dialog.component';
import { WaitingDialogComponent } from './components/dialogs/waiting-dialog.component';
//import { PendingDialogComponent } from './components/dialogs/pending-dialog.component';
import { ConfirmContractDialog } from './components/contract/newContract/confirm-contract.component';
import { DealInfoDialog } from './components/contract/search/dealInfo-dialog.component';
import { JoinDialog } from './components/dialogs/join-dialog.component';
import { CreatingDealDialog } from './components/contract/newContract/creatingDeal-dialog.component';


/*Servicies*/
import { WalletService } from './services/wallet.service';
import { AccountService } from './services/account.service';
import { Web3 } from './services/web3.service';
import { DialogService } from './services/dialog.service';
import { SendDialogService } from './services/send-dialog.service';
import { TokenService } from './services/token.service';
import { RawTxService } from './services/rawtx.sesrvice';
import { EtherscanService } from './services/etherscan.service';
import { ContractService } from './services/contract.service';
import { DealsService } from './services/deals.service';
import { JoinDialogService } from './services/joindialog.service';
import { EventsService } from './services/events.service';
import { PairsService } from './services/pairs.service';

/*Pipes*/
import { ConverterPipe } from './pipes/converter.pipe';
import { SeparateWordsPipe } from './pipes/words.pipe';


/*Directives*/
import { CustomMinDirective } from './validators/min-validator.directive';
import { ValidateAddressDirective } from './validators/address-validator.directive';
import { InsuficientFundsDirective } from './validators/funds-validator.directive';




@NgModule({
  declarations: [
    MyApp,
    NavComponent,
    NetWorkComponent,
    WalletComponent,
    GlobalPage,
    SendPage,
    ReceivePage,
    HistoryPage,
    WsettingsPage,
    ContractComponent,
    SettingsComponent,
    ConverterPipe,
    SeparateWordsPipe,
    SelectAccountDialogComponent,
    AddAccountDialogComponent,
    NewAccountDialogComponent,
    ImportAccountDialogComponent,
    SendDialogComponent,
    DeleteComponent,
    ErrorDialogComponent,
    LoadingDialogComponent,
    WaitingDialogComponent,
    //PendingDialogComponent,
    JSONDialogComponent,
    PrivateKeyDialogComponent,
    ListComponent,
    PaginatorComponent,
    NewContractPage,
    GlobalPositionPage,
    GlobalListComponent,
    SearchPage,
    SearchListComponent,
    ConfirmContractDialog,
    DealInfoDialog,
    JoinDialog,
    CreatingDealDialog,
    TokensComponent,
    GeneralPage,
    SendTokensPage,
    AddTokenPage,
    MessageDialogComponent,
    GasDialogComponent,
    CustomMinDirective,
    ValidateAddressDirective,
    InsuficientFundsDirective,
    ShowTxDialogComponent,
    ResendTxDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
  ],
  exports: [
    MaterialModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [MyApp],
  entryComponents: [
    MyApp,
    SelectAccountDialogComponent,
    AddAccountDialogComponent,
    NewAccountDialogComponent,
    ImportAccountDialogComponent,
    SendDialogComponent,
    DeleteComponent,
    ErrorDialogComponent,
    LoadingDialogComponent,
    WaitingDialogComponent,
    //PendingDialogComponent,
    JSONDialogComponent,
    PrivateKeyDialogComponent,
    MessageDialogComponent,
    GasDialogComponent,
    ConfirmContractDialog,
    DealInfoDialog,
    JoinDialog,
    CreatingDealDialog,
    ShowTxDialogComponent,
    ResendTxDialogComponent,
  ],
  providers: [
    WalletService,
    AccountService,
    ContractService,
    DealsService,
    Web3,
    DialogService,
    JoinDialogService,
    SendDialogService,
    TokenService,
    EventsService,
    PairsService,
    RawTxService,
    EtherscanService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
