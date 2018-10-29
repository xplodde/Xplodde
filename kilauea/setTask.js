/*

    Copyright 2018, Vicent Nos

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */



//////////////////////////////////////////////////////////////
//                                                          //
//                      Forward Kilauea                     //
//                                                          //
//////////////////////////////////////////////////////////////


var Web3 = require('web3');
var http = require('https');
var Tx = require('ethereumjs-tx');

var web3 = new Web3();

web3.setProvider("https://ropsten.infura.io/KoM0GoccIzuOw4fHPemf");

var abiXpld = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_addr", "type": "address" }], "name": "getTiker", "outputs": [{ "name": "", "type": "string" }, { "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "f", "type": "uint256" }, { "name": "_url", "type": "string" }], "name": "setTask", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balances", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "windowTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "minRoundTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "tiker", "type": "uint256" }], "name": "xpldData", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "standard", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "reputationRound", "outputs": [{ "name": "reputationSum", "type": "uint256" }, { "name": "length", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "tasks", "outputs": [{ "name": "amount", "type": "uint256" }, { "name": "lastTime", "type": "uint256" }, { "name": "frequency", "type": "uint256" }, { "name": "url", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_address", "type": "address" }], "name": "remove_Federation", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "tiker", "type": "uint256" }], "name": "reputationMediana", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_tiker", "type": "uint256" }, { "name": "_time", "type": "uint256" }], "name": "getLastPrice", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "lastTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "reputation", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }, { "name": "_addr", "type": "address" }], "name": "addTiker", "outputs": [{ "name": "", "type": "uint256" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "name": "time", "outputs": [{ "name": "length", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_val", "type": "uint256" }, { "name": "_address", "type": "address" }], "name": "add_Federation", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" }], "name": "approveAndCall", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "idTiker", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "lastGas", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "last", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dataOracle", "type": "uint256" }, { "name": "tiker", "type": "uint256" }, { "name": "token", "type": "address" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "lastData", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }];


var abiFwd = [{ "constant": true, "inputs": [], "name": "getActive", "outputs": [{ "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "RUN", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "contractAddr", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getDealData", "outputs": [{ "name": "_privateDeal", "type": "bool" }, { "name": "_creationDate", "type": "uint256" }, { "name": "_creationPrice", "type": "uint256" }, { "name": "_daysDealed", "type": "uint256" }, { "name": "_initialMargin", "type": "uint256" }, { "name": "_maintenanceMargin", "type": "uint256" }, { "name": "_totalSupply", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "xplodingData", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "checkRecharges", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_dealId", "type": "uint256" }], "name": "cancelDeal", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "RUNdailyPair", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "cancel", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "liquidate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_dealId", "type": "uint256" }], "name": "getRechargeTimestamps", "outputs": [{ "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_f", "type": "uint256" }, { "name": "_url", "type": "string" }], "name": "setTask", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getAmounts", "outputs": [{ "name": "_liquidationAmount", "type": "uint256" }, { "name": "_rechargeAmount", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenTicker", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenAddr", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "lastDeal", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "pair", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_dealId", "type": "uint256" }, { "name": "_block", "type": "uint256" }], "name": "getPastLiquidated", "outputs": [{ "name": "_liquidation", "type": "int256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "arr", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getDealInfo", "outputs": [{ "name": "_activeDeal", "type": "bool" }, { "name": "_dealId", "type": "uint256" }, { "name": "_pairType", "type": "uint256" }, { "name": "_time", "type": "uint256" }, { "name": "_initialMarginValue", "type": "uint256" }, { "name": "_maintenanceMarginValue", "type": "uint256" }, { "name": "_totalSupplyValue", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_dealer", "type": "uint256" }], "name": "getDealerInfo", "outputs": [{ "name": "_addrSeller", "type": "address" }, { "name": "_balance", "type": "int256" }, { "name": "_totalLiquidation", "type": "int256" }, { "name": "_totalRecharge", "type": "uint256" }, { "name": "_rechargeTimestamp", "type": "uint256" }, { "name": "_recharge", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "active", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_dealId", "type": "uint256" }, { "name": "_timestamp", "type": "uint256" }], "name": "getRecharge", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_dealer", "type": "bool" }, { "name": "_dealTime", "type": "uint256" }, { "name": "_dealInitialMargin", "type": "uint256" }, { "name": "_dealMaintenanceMargin", "type": "uint256" }, { "name": "_dealTotalSupply", "type": "uint256" }, { "name": "_dealPairType", "type": "uint256" }, { "name": "_private", "type": "bool" }], "name": "createDeal", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "liquidations", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_dealId", "type": "uint256" }, { "name": "_dealer", "type": "bool" }], "name": "joinAndPayDeal", "outputs": [{ "name": "success", "type": "bool" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getBalancesAndTimeLeft", "outputs": [{ "name": "_sellerBalance", "type": "int256" }, { "name": "_buyerbalance", "type": "int256" }, { "name": "_daysLeft", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "pending", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "dailyPair", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "dealId", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "xpldDataAmount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_dealId", "type": "uint256" }], "name": "getLiquidateds", "outputs": [{ "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenIndex", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "cancellations", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_dealId", "type": "uint256" }], "name": "rechargeDealer", "outputs": [{ "name": "success", "type": "bool" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "getPendings", "outputs": [{ "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_ticker", "type": "uint256" }, { "name": "_index", "type": "uint256" }], "name": "setTokenParameters", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_dealId", "type": "uint256" }], "name": "withdrawProfits", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": false, "stateMutability": "nonpayable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "sender", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "LogDeposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "receiver", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "LogWithdrawal", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }];

var xpldContract = "0x103262f243E6f67d12D6a4EA0d45302C1FA4BB0a";
var forwardAddr = "0x5ce5615485d4BE300C1e413a27B4fDdCaD7B2fa3";

var address = "0xcf69407454eaa061225ae4a77bc631319da34f6c";
var privateKey = new Buffer('privateKey', 'hex');

var meta_xpld = new web3.eth.Contract(abiXpld, xpldContract);
var meta_fwd = new web3.eth.Contract(abiFwd, forwardAddr);

console.log(" ");
console.log("setTask.js");
// ForwardKilauea setTask();
var gasAmountX;

function getGasAmount() {
    return new Promise(function(resolve, reject) {
        web3.eth.getBlock('latest', function(error, block) {
            if (error) {
                console.log(error);
                getGasAmount().then(resolve);
            } else {
                console.log("gasAmount by lastBlock: ", block.gasLimit);
                gasAmountX = block.gasLimit;
                resolve();
            }
        });
    });
}

function sendTransaction(tx, gPriced, dX) {
    web3.eth.sendSignedTransaction('0x' + tx.toString('hex'))
        .on('transactionHash', function(receipt) {
            console.log("Transaction has been sended: ", receipt);
        }).on('error', function(rec) {

            console.log("ERROR: ", rec);
            meta_fwd.methods.setTask(30, "https://www.bitstamp.net/api/v2/ticker/ethbtc").estimateGas({ gas: 5000000 }, function(error, gasAmount) {
                console.log("gasAmount by estimateGas", gasAmount);

                var isNan = isNaN(gasAmount);
                console.log(isNan);
                console.log("isNotNan");

                if (isNan) {
                    amountX = await getGasAmount();
                } else {
                    gasAmountX = gasAmount;
                }

                gasAmountX = web3.utils.toHex(gasAmountX);

                web3.eth.getTransactionCount(address)
                    .then(function(s) {
                        console.log("NONCE!!!!!!!", s);
                        setTimeout(function() {
                            //_nonce = nonce +1;
                            var rawTx = {
                                nonce: s,
                                gasPrice: gPriced,
                                gasLimit: gasAmountX,
                                to: forwardAddr,
                                value: '0x00',
                                data: dX
                            }

                            var y = new Tx(rawTx);

                            y.sign(privateKey);
                            // console.log(tx.gasLimit);
                            var newtx = y.serialize();
                            // console.log(serializedTx);
                            // console.log(serializedTx.toString('hex'));
                            sendTransaction(newtx, gPriced, dX);
                        });

                    });
            });
        });
}

web3.eth.getTransactionCount(address)
    .then(function(n) {
        var dataC = meta_fwd.methods.setTask(30, "https://www.bitstamp.net/api/v2/ticker/ethbtc").encodeABI();
        console.log("dataC: ", dataC);

        var dataT = meta_xpld.methods.windowTime().call({ from: address }, function(error, result2) {

            web3.eth.getGasPrice()
                .then(
                    gasPriced => {
                        // console.log("gasPrice: ", gas);
                        gasPriced = web3.utils.toHex(gasPriced * 10);
                        console.log("gasPrice: ", gasPriced);

                        meta_fwd.methods.setTask(30, "https://www.bitstamp.net/api/v2/ticker/ethbtc").estimateGas({ gas: 5000000 }, function(error, gasAmount) {
                            console.log("gasAmount by estimateGas", gasAmount);
                            var isNan = isNaN(gasAmount);
                            console.log("isNan????", isNan);
                            if (isNan) {
                                gasAmountX = await getGasAmount();
                                console.log(gasAmountX);
                            } else {
                                gasAmountX = gasAmount;
                                console.log(gasAmountX);
                            }

                            gasAmountX = web3.utils.toHex(gasAmountX);
                            //console.log("gasLimit: ", gasAmount);
                            if (gasAmountX == 5000000)
                                console.log('Method ran out of gas');

                            setTimeout(function() {
                                console.log('nonce: ', n);
                                var rawTx = {
                                    nonce: n,
                                    gasPrice: gasPriced,
                                    gasLimit: gasAmountX,
                                    to: forwardAddr,
                                    value: '0x00',
                                    data: dataC
                                }

                                var tx = new Tx(rawTx);

                                tx.sign(privateKey);

                                var serializedTx = tx.serialize();

                                sendTransaction(serializedTx, gasPriced, dataC);

                                web3.eth.getBalance(address).then(function(balance) {
                                    console.log(balance);

                                });
                            });
                        });
                    });
        });
    });