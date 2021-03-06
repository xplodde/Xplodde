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
//                      Kilauea Oracle                      //
//                                                          //
//////////////////////////////////////////////////////////////


var Web3 = require('web3');
var http = require('https');
var Tx = require('ethereumjs-tx');


try {
    var fs = require('fs');
    eval(fs.readFileSync('config.js')+'');
}
catch (e) {
    console.log("No config file detected.");
    process.exit();

}



var web3 = new Web3();

process.argv[2];

if(process.argv[2]=="testnet"){
    web3.setProvider("https://ropsten.infura.io/KoM0GoccIzuOw4fHPemf");
}else if(process.argv[2]=="mainnet"){
    web3.setProvider("https://mainnet.infura.io/KoM0GoccIzuOw4fHPemf");
}else{
    console.log("Usage : node kilauea.js testnet/mainnet");
    process.exit();
}



if(publicKey=="undefined" || privateKey=="undefined"){

    console.log("No config file detected.");

    console.log('var abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_addr", "type": "address" }], "name": "getTiker", "outputs": [{ "name": "", "type": "string" }, { "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "f", "type": "uint256" }, { "name": "_url", "type": "string" }], "name": "setTask", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balances", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "windowTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "minRoundTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "tiker", "type": "uint256" }], "name": "xpldData", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "standard", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "reputationRound", "outputs": [{ "name": "reputationSum", "type": "uint256" }, { "name": "length", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "tasks", "outputs": [{ "name": "amount", "type": "uint256" }, { "name": "lastTime", "type": "uint256" }, { "name": "frequency", "type": "uint256" }, { "name": "url", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_address", "type": "address" }], "name": "remove_Federation", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "tiker", "type": "uint256" }], "name": "reputationMediana", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_tiker", "type": "uint256" }, { "name": "_time", "type": "uint256" }], "name": "getLastPrice", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "lastTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "reputation", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }, { "name": "_addr", "type": "address" }], "name": "addTiker", "outputs": [{ "name": "", "type": "uint256" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "name": "time", "outputs": [{ "name": "length", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_val", "type": "uint256" }, { "name": "_address", "type": "address" }], "name": "add_Federation", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" }], "name": "approveAndCall", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "idTiker", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "lastGas", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "last", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dataOracle", "type": "uint256" }, { "name": "tiker", "type": "uint256" }, { "name": "token", "type": "address" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "lastData", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }];');
    console('var xplodde_contract = "0x103262f243E6f67d12D6a4EA0d45302C1FA4BB0a";');
    console.log('var kilauea_contract = "0x5ce5615485d4BE300C1e413a27B4fDdCaD7B2fa3";');
    console.log('var public = "0xb1d3918de5b88ca020bd1177019276689ba3b1ef";');
    console.log('var private = "0x59a77fcce9a92624c6ba994195d43bba268fd52a01a1f543b0df7d65f863d351";');
    console.log('var federation_id = 0;);');
    console.log('Usage : node kilauea.js testnet/mainnet publikey privatekey');

    process.exit();

}

console.log("\n\n//////////////////////////////////////////////////////////////");
console.log("//                                                          //");
console.log("//                      Kilauea     Oracle                  //");
console.log("//                                                          //");
console.log("//////////////////////////////////////////////////////////////\n\n");


console.log("Federation ID : "+federation_id);
console.log("Public Key : "+publicKey);
console.log("Private Key : "+privateKey);
console.log("Xplodde Contract : "+xplodde_contract);
console.log("Kilauea Contract : "+kilauea_contract);


var privateKey = new Buffer(privateKey, 'hex');

var myContractInstance = new web3.eth.Contract(abi, xplodde_contract);


var gasAmountX;
var last;
var getTiker;

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
            myContractInstance.methods.mintData(last, getTiker, publicKey).estimateGas({ gas: 5000000 }, function(error, gasAmount) {
                console.log("gasAmount by estimateGas", gasAmount);

                var isNan = isNaN(gasAmount);
                console.log(isNan);
                console.log("isNotNan");


                web3.eth.getTransactionCount(publicKey)
                    .then(function(s) {
                        console.log("NONCE!!!!!!!", s);
                        setTimeout(function() {
                            //_nonce = nonce +1;
                            var rawTx = {
                                nonce: s,
                                gasPrice: gPriced,
                                gasLimit: gasAmountX,
                                to: xpldContract,
                                value: '0x00',
                                data: dX
                            }

                            var y = new Tx(rawTx);

                            y.sign(privateKey);
                            // console.log(tx.gasLimit);
                            var newtx = y.serialize();
                            // console.log(serializedTx);
                            // console.log(serializedTx.toString('hex'));
                            

                            web3.eth.sendSignedTransaction('0x' + newtx.toString('hex'))
                                .on('transactionHash', function(receipt) {
                                    console.log("Transaction has been sended: ", receipt);
                                }).on('error', function(rec) {
                                    console.log(rec);
                                });
                        });

                    });
            });
        });
}

console.log("Loading Kilauea Oracle contract ...");

try {
    myContractInstance.methods.tasks(kilauea_contract).call().on('error',  function(error){ console.log("No tasks found"); }).then(
        result => {
            console.log("Getting tasks ...");

            console.log("Loading data from "+result[3]);
            console.log(result[3]),

                http.get(result[3], (res) => {

                    res.on('data', (d) => {
                        last = JSON.parse(d).last;
                        //result in ETH
                        last = 1 / last;
                        last = last.toString();
                        console.log("length: ", last.length);
                        console.log("last:                 ", last);
                        if (last.length > 20) {
                            last = last.substr(0, 20);
                            console.log("length changed to 20: ", last);
                        }

                        last = web3.utils.toWei(last, 'ether');

                        console.log("last toWei: ", last);

                        console.log("Getting tikers ...");
                        
                        myContractInstance.methods.getTiker(kilauea_contract).call().then(
                            tiker => {
                                getTiker = parseInt(tiker[1]);
                                var dataC = myContractInstance.methods.mintData(last, getTiker, publicKey).encodeABI();

                                console.log(dataC);

                                web3.eth.getTransactionCount(publicKey)
                                    .then(function(n) {

                                        console.log(myContractInstance.methods.windowTime().encodeABI());

                                        var dataT = myContractInstance.methods.windowTime().call({ from: publicKey }, function(error, result) {

                                            var dataR = myContractInstance.methods.minRoundTime(getTiker).call({ from: publicKey }, function(error2, result2) {

                                                web3.eth.getGasPrice()
                                                    .then(
                                                        gasPriced => {
                                                            // console.log("gasPrice: ", gas);
                                                            gasPriced = web3.utils.toHex(gasPriced * 20);
                                                            console.log("gasPrice: ", gasPriced);

                                                            myContractInstance.methods.mintData(last, getTiker, publicKey).estimateGas({ gas: 5000000 }, function(error, gasAmount) {
                                                                console.log("gasAmount by estimateGas", gasAmount);

                                                                gasAmountX = gasAmount;
                                                                //console.log("gasLimit: ", gasAmount);
                                                                if (gasAmountX == 5000000)
                                                                    console.log('Method ran out of gas');

                                                                setTimeout(function() {
                                                                    console.log('nonce: ', n);
                                                                    var rawTx = {
                                                                        nonce: n,
                                                                        gasPrice: gasPriced,
                                                                        gasLimit: gasAmountX,
                                                                        to: xpldContract,
                                                                        value: '0x00',
                                                                        data: dataC
                                                                    }

                                                                    var tx = new Tx(rawTx);

                                                                    tx.sign(privateKey);
                                                                    // console.log(tx.gasLimit);
                                                                    var serializedTx = tx.serialize();
                                                                    // console.log(serializedTx);
                                                                    // console.log(serializedTx.toString('hex'));

                                                                    sendTransaction(serializedTx, gasPriced, dataC);


                                                                    web3.eth.getBalance(publicKey).then(function(balance) {
                                                                        console.log(balance);

                                                                    });
                                                                });
                                                            });
                                                        });
                                            });
                                        });
                                    });
                            });

                    });
                
                }).on('error', (e) => {
                    console.log("No results found");
                    process.exit();

                });


        });

}catch (e) {
    console.log("No tasks found");
    process.exit();
}