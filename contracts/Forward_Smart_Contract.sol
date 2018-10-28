pragma solidity ^0.4.24;

/*
    Copyright 2018, Vicent Nos & Mireia Puig
    
    License:
    https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

 */


/**
 * @title OpenZeppelin SafeMath
 * @dev Math operations with safety checks that throw on error
 */
 library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}

contract Ownable {

    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() public {
      owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

}

contract Token {
     function RUN() pure public;
     function xpldData(uint256 tiker)public view returns(uint256);
     function setTask(address token, uint256 f, string _url) payable public;
 }

contract ForwardSmartContract_ERC20 is Ownable {
  using SafeMath for uint256;

  mapping(uint256 => uint256) public pair; // NEW MAPPING
  mapping(uint256 => uint256) public dailyPair;
  mapping(uint256 => dealStruct) dealed;
  mapping(address => uint256) public lastDeal;

  struct dealer {
    address addr;
    int256 balance;
    int256 totalLiquidation;
    uint256 totalRecharge;

    uint256[] recharged; // NEW VARIABLE
    mapping(uint256 => uint256) rechargeRecord; // NEW VARIABLE

    uint256 rechargeTimestamp;
    bool recharge;
  }

  struct dealData {
    bool privateDeal; // NEW VARIABLE
    uint256 creationDate; //NEW VARIABLE
    uint256 creationPrice; // NEW VARIABLE
    uint256 daysDealed;
    uint256 initialMargin;
    uint256 maintenanceMargin;
    uint256 totalSupply;

  }

  struct dealStruct {
    bool activeDeal;
    uint256 dealId;
    uint256 pairType;
    uint256 time;
    uint256 initialMarginValue;
    uint256 maintenanceMarginValue;
    uint256 totalSupplyValue;
    uint256 liquidationAmount; // means amount that have to be liquidated after recharge
    uint256 rechargeAmount; // means amount that will have to be recharged
    uint256[] liquidated;

    mapping (uint256 => dealer) dealers;
    mapping (uint256 => int256) liquidationRecord;
    mapping (uint256 => dealData) data;
  }

  /* Public variables */

  uint256 public dealId = 0;
  uint256[] public pending;
  uint256[] public active;
  uint256[] public liquidate;
  uint256[] public cancel;
  uint256[] public arr;

  event Transfer(address indexed from, address indexed to, uint256 value);

  function transfer(address _to, uint256 _value) public returns (bool) {
      require(_to != address(0));

      emit Transfer(msg.sender, _to, _value);
      return true;
  }

  // create new deal
  function deal(uint256 _dealTime, uint256 _initialMargin, uint256 _maintenanceMargin, uint256 _totalSupply, uint256 _pairType, bool _private) internal returns(bool success) {
    dealed[dealId].activeDeal = false;
    dealed[dealId].dealId = dealId;
    dealed[dealId].time = _dealTime;
    dealed[dealId].data[0].daysDealed = _dealTime;
    dealed[dealId].data[0].initialMargin = _initialMargin;
    dealed[dealId].data[0].maintenanceMargin = _maintenanceMargin;
    dealed[dealId].data[0].totalSupply = _totalSupply;
    dealed[dealId].pairType = _pairType;

    dealed[dealId].data[0].privateDeal = _private;
    dealed[dealId].data[0].creationDate = block.timestamp; // NEW ASSIGMENT
    dealed[dealId].data[0].creationPrice = pair[_pairType];
    dealed[dealId].totalSupplyValue = pair[_pairType].mul(_totalSupply);
    dealed[dealId].initialMarginValue = (dealed[dealId].totalSupplyValue.mul(_initialMargin)).div(100);
    dealed[dealId].maintenanceMarginValue = (dealed[dealId].initialMarginValue.mul(_maintenanceMargin)).div(100);

    dealId++;

    return true;
  }


  function setSeller(uint256 _id, address _seller) internal returns(bool success) {
      dealed[_id].dealers[0].addr = _seller;
      return true;
  }

   function setBuyer(uint256 _id, address _buyer) internal returns(bool success) {
    dealed[_id].dealers[1].addr = _buyer;
    return true;
  }

  function setPendings() internal returns(bool success) {
    uint256 len = pending.length;

    for(uint penIndex = 0; penIndex < len; penIndex++) {
        if(dealed[pending[penIndex]].dealId == pending[penIndex] && dealed[pending[penIndex]].activeDeal == false) {
            if(dealed[pending[penIndex]].data[0].creationDate != 0) {
                arr.push(pending[penIndex]);
            }
        }
    }
        delete pending;
        pending = arr;

        delete arr;
      return true;
  }

  function setActive() internal returns(bool success) {
    uint256 len = active.length;

    for(uint actIndex = 0; actIndex < len; actIndex++) {
        if(dealed[active[actIndex]].dealId == active[actIndex] && dealed[active[actIndex]].activeDeal == true) {
            arr.push(active[actIndex]);
        }
    }
    delete active;
    active = arr;

    delete arr;

    return true;
  }

  function getPendings() view public returns(uint256[]) {
      return pending;
  }
  function getActive() view public returns(uint256[]) {
      return active;
  }

 // XPLODDE VISUALIZATION FUNCTIONS
 function getLiquidateds(uint256 _dealId) view public returns(uint256[]) {
    return dealed[_dealId].liquidated;
  }
 function getPastLiquidated(uint256 _dealId, uint256 _block) view public returns (int256 _liquidation) {
     return dealed[_dealId].liquidationRecord[_block];
 }

 //return array of timestamps of all recharges
 function getRechargeTimestamps(uint256 _dealId) view public returns (uint256[]) {

   if(dealed[_dealId].dealers[0].addr == msg.sender) {
     return dealed[_dealId].dealers[0].recharged;
   }

   if(dealed[_dealId].dealers[1].addr == msg.sender) {
     return dealed[_dealId].dealers[1].recharged;
   }

 }
// return recharge amount of a specific timestamp
 function getRecharge(uint256 _dealId, uint256 _timestamp) view public returns(uint256) {
     if(dealed[_dealId].dealers[0].addr == msg.sender) {
     return dealed[_dealId].dealers[0].rechargeRecord[_timestamp];
   }

   if(dealed[_dealId].dealers[1].addr == msg.sender) {
     return dealed[_dealId].dealers[1].rechargeRecord[_timestamp];
   }
 }

// FUNCTION CREATED FOR ACCESS DATA REASONS
  function getDealerInfo(uint256 _id, uint256 _dealer) view public returns(address _addrSeller, int256 _balance, int256 _totalLiquidation, uint256 _totalRecharge, uint256 _rechargeTimestamp, bool _recharge) {
      return (dealed[_id].dealers[_dealer].addr, dealed[_id].dealers[_dealer].balance, dealed[_id].dealers[_dealer].totalLiquidation, dealed[_id].dealers[_dealer].totalRecharge, dealed[_id].dealers[_dealer].rechargeTimestamp, dealed[_id].dealers[_dealer].recharge);
  }
  function getDealData(uint256 _id) view public returns (bool _privateDeal, uint256 _creationDate, uint256 _creationPrice, uint256 _daysDealed, uint256 _initialMargin, uint256 _maintenanceMargin, uint256 _totalSupply) {
    return(dealed[_id].data[0].privateDeal, dealed[_id].data[0].creationDate, dealed[_id].data[0].creationPrice, dealed[_id].data[0].daysDealed, dealed[_id].data[0].initialMargin, dealed[_id].data[0].maintenanceMargin, dealed[_id].data[0].totalSupply);
  }

  function getDealInfo(uint256 _id) view public returns(bool _activeDeal, uint256 _dealId, uint256 _pairType, uint256 _time, uint256 _initialMarginValue, uint256 _maintenanceMarginValue, uint256 _totalSupplyValue) {
    return(dealed[_id].activeDeal, dealed[_id].dealId, dealed[_id].pairType, dealed[_id].time, dealed[_id].initialMarginValue, dealed[_id].maintenanceMarginValue, dealed[_id].totalSupplyValue);
  }
  function getAmounts(uint256 _id) view public returns(uint256 _liquidationAmount, uint256 _rechargeAmount) {
    return(dealed[_id].liquidationAmount, dealed[_id].rechargeAmount);
  }

  function getBalancesAndTimeLeft(uint256 _id) view public returns(int256 _sellerBalance, int256 _buyerbalance, uint256 _daysLeft) {
      return(dealed[_id].dealers[0].balance, dealed[_id].dealers[1].balance, dealed[_id].time);
  }

}

contract ForwardSmartContract is ForwardSmartContract_ERC20 {
  event LogDeposit(address sender, uint amount);
  event LogWithdrawal(address receiver, uint amount);

  uint256 public tokenTicker;
  uint256 public tokenIndex;
  address public contractAddr = this;
  address public tokenAddr = 0x103262f243E6f67d12D6a4EA0d45302C1FA4BB0a;
  uint256 public xpldDataAmount;

  constructor() public {
   //needs to set price before create any deal
  }

  function() public{}

  // Deal creator have to createDeal and joinAndPayDeal
  function createDeal(bool _dealer, uint256 _dealTime, uint256 _dealInitialMargin, uint256 _dealMaintenanceMargin, uint256 _dealTotalSupply, uint256 _dealPairType, bool _private) public returns(bool success) {
    uint256 index = dealId;
    deal(_dealTime, _dealInitialMargin, _dealMaintenanceMargin, _dealTotalSupply, _dealPairType, _private);

    if(_dealer == true) {
      setBuyer(index, msg.sender);
    } else {
      setSeller(index, msg.sender);
    }

    lastDeal[msg.sender] = index;

    pending.push(index);

    return true;
  }

  function joinAndPayDeal(uint256 _dealId, bool _dealer) public payable returns (bool success) {
    require(dealed[_dealId].activeDeal == false);
    require(dealed[_dealId].initialMarginValue == msg.value);

    uint256 pairType;
    uint256 totalSupply;

    if(_dealer == true) {
      if(dealed[_dealId].dealers[1].addr == 0 && dealed[_dealId].dealers[0].addr != msg.sender) {
        if(lastDeal[msg.sender] != _dealId) {
            lastDeal[msg.sender] = _dealId;
        }
        setBuyer(_dealId, msg.sender);
      }
        require(dealed[_dealId].dealers[1].balance == 0);
        require(dealed[_dealId].dealers[1].addr == msg.sender);
        require(dealed[_dealId].dealers[0].addr != msg.sender);
      if(dealed[_dealId].dealers[1].addr == msg.sender) {
        dealed[_dealId].dealers[1].balance = int256(msg.value);
        emit LogDeposit(msg.sender, msg.value);
      }
    } else {
      if(dealed[_dealId].dealers[0].addr == 0 && dealed[_dealId].dealers[1].addr != msg.sender) {
        if(lastDeal[msg.sender] != _dealId) {
            lastDeal[msg.sender] = _dealId;
        }
        setSeller(_dealId, msg.sender);
      }
        require(dealed[_dealId].dealers[0].balance == 0);
        require(dealed[_dealId].dealers[0].addr == msg.sender);
        require(dealed[_dealId].dealers[1].addr != msg.sender);
      if(dealed[_dealId].dealers[0].addr == msg.sender) {
        dealed[_dealId].dealers[0].balance = int256(msg.value);
        emit LogDeposit(msg.sender, msg.value);
      }
    }

    if(dealed[_dealId].dealers[0].balance != 0 && dealed[_dealId].dealers[1].balance != 0) {
      pairType = dealed[_dealId].pairType;
      totalSupply = dealed[_dealId].data[0].totalSupply;

      dealed[_dealId].data[0].creationPrice = pair[pairType];
      dealed[_dealId].totalSupplyValue = pair[pairType].mul(totalSupply);
      dealed[_dealId].activeDeal = true;

      active.push(_dealId);
      setPendings();

    }

    return true;
  }

  function checkRecharges() public returns(bool) {
    uint256 len = active.length;
    uint256 lastTimestampLen;
    uint256 lastTimestamp;
    int256 lastLiquidation;
    uint256 sender;
    uint256 receiver;
    address senderAddress;
    address receiverAddress;
    uint256 _value;

    for(uint actIndex = 0; actIndex < len; actIndex++) {
      for(uint i = 0; i <= 1; i++) {
        if(dealed[active[actIndex]].dealers[i].recharge == true) {

          lastTimestampLen = dealed[active[actIndex]].liquidated.length;
          if(lastTimestampLen > 0) {
              lastTimestamp = dealed[active[actIndex]].liquidated[lastTimestampLen-1];
              lastLiquidation = dealed[active[actIndex]].liquidationRecord[lastTimestamp];

              if(block.timestamp >= lastTimestamp + 3600) {
                if(i == 0) {
                  sender = 0;
                  receiver = 1;
                } else {
                  sender = 1;
                  receiver = 0;
                }
                // send to the counterparty the balance and delete deal
                if(dealed[active[actIndex]].dealers[sender].balance >= 0) {
                    _value = uint256(dealed[active[actIndex]].dealers[sender].balance);
                    //sender account to 0
                    dealed[active[actIndex]].dealers[sender].balance = int256(uint256(dealed[active[actIndex]].dealers[sender].balance).sub(_value));

                    if(dealed[active[actIndex]].dealers[receiver].balance >= 0) {
                      dealed[active[actIndex]].dealers[receiver].balance = int256(uint256(dealed[active[actIndex]].dealers[receiver].balance).add(_value));
                    } else {
                      dealed[active[actIndex]].dealers[receiver].balance = dealed[active[actIndex]].dealers[receiver].balance + int256(_value);
                    }

                    if(dealed[active[actIndex]].dealers[receiver].balance >= 0) {
                      _value = uint256(dealed[active[actIndex]].dealers[receiver].balance);
                      dealed[active[actIndex]].dealers[receiver].balance = int256(uint256(dealed[active[actIndex]].dealers[receiver].balance).sub(_value));
                    } else {
                      _value = 0;
                    }
                } else {

                  if(dealed[active[actIndex]].dealers[receiver].balance >= 0) {
                    _value = uint256(dealed[active[actIndex]].dealers[receiver].balance);
                    dealed[active[actIndex]].dealers[receiver].balance = int256(uint256(dealed[active[actIndex]].dealers[receiver].balance).sub(_value));
                  } else {
                    _value = 0;
                  }
                }
                senderAddress = dealed[active[actIndex]].dealers[sender].addr;
                receiverAddress = dealed[active[actIndex]].dealers[receiver].addr;

                if(_value > 0) {
                  receiverAddress.transfer(_value);

                  emit LogWithdrawal(receiverAddress, _value);

                  dealed[active[actIndex]].activeDeal = false;
                  delete dealed[active[actIndex]].dealers[0];
                  delete dealed[active[actIndex]].dealers[1];
                  delete dealed[active[actIndex]].data[0];
                  delete dealed[active[actIndex]];
                }
              }
          }
        }
      }
      //for ends
    }
    setActive();
    return true;
  }

  function setPairPrice(uint256 _index, uint256 _value) internal returns(bool) {
    uint256 len = active.length;
    int256 liquidation;
    uint256 sender;
    uint256 receiver;
    uint256 valTransfer;
    uint256 amount;
    uint256 timestamp;

    for(uint actIndex = 0; actIndex < len; actIndex++) {
      if(dealed[active[actIndex]].activeDeal == true && dealed[active[actIndex]].pairType == _index && dealed[active[actIndex]].time > 0 && dealed[active[actIndex]].dealers[0].recharge == false && dealed[active[actIndex]].dealers[1].recharge == false) {
        //can't use SafeMath library because we need to know if liquidation is positive or negative
        if(dealed[active[actIndex]].data[0].creationPrice != 0) {
            liquidation = int256((_value - dealed[active[actIndex]].data[0].creationPrice) * uint256(dealed[active[actIndex]].data[0].totalSupply));
            dealed[active[actIndex]].data[0].creationPrice = 0;
        } else {
            liquidation = int256((_value - dailyPair[dealed[active[actIndex]].pairType]) * uint256(dealed[active[actIndex]].data[0].totalSupply));
        }

        timestamp = block.timestamp;

        dealed[active[actIndex]].liquidated.push(timestamp);
        dealed[active[actIndex]].liquidationRecord[timestamp] = liquidation;

        if(liquidation >= 0 ) {
          sender = 0;
          receiver = 1;
          if((dealed[active[actIndex]].dealers[sender].balance - liquidation) >= 0) {
            valTransfer = uint256(liquidation);
            dealed[active[actIndex]].time = dealed[active[actIndex]].time - 1;
          } else {
            valTransfer = uint256(dealed[active[actIndex]].dealers[sender].balance);
            dealed[active[actIndex]].dealers[sender].recharge = true;
            dealed[active[actIndex]].dealers[sender].rechargeTimestamp = block.timestamp;
          }
          amount = uint256(liquidation);
        }
        if(liquidation < 0) {
          sender = 1;
          receiver = 0;
          if((dealed[active[actIndex]].dealers[sender].balance + liquidation) >= 0) {
            valTransfer = uint256(-liquidation);
            dealed[active[actIndex]].time = dealed[active[actIndex]].time -1;
          } else {
            valTransfer = uint256(dealed[active[actIndex]].dealers[sender].balance);
            dealed[active[actIndex]].dealers[sender].recharge = true;
            dealed[active[actIndex]].dealers[sender].rechargeTimestamp = block.timestamp;
        }
        amount = uint256(-liquidation);
      }
      //can't use SafeMath library because we can't know if balance and totalLiquidation are positive or negative
      //or if the result of the operation have to be positive or negative
      dealed[active[actIndex]].dealers[sender].balance = dealed[active[actIndex]].dealers[sender].balance - int256(amount);
      dealed[active[actIndex]].dealers[receiver].balance = dealed[active[actIndex]].dealers[receiver].balance + int256(valTransfer);
      dealed[active[actIndex]].dealers[sender].totalLiquidation = dealed[active[actIndex]].dealers[sender].totalLiquidation - int256(valTransfer);
      dealed[active[actIndex]].dealers[receiver].totalLiquidation = dealed[active[actIndex]].dealers[receiver].totalLiquidation + int256(valTransfer);


      if(dealed[active[actIndex]].dealers[sender].balance < int256(dealed[active[actIndex]].maintenanceMarginValue)) {
        if(dealed[active[actIndex]].dealers[sender].recharge == true) {
          dealed[active[actIndex]].liquidationAmount = dealed[active[actIndex]].liquidationAmount.add(amount.sub(valTransfer));
          dealed[active[actIndex]].rechargeAmount = dealed[active[actIndex]].rechargeAmount.add(dealed[active[actIndex]].liquidationAmount.add(dealed[active[actIndex]].initialMarginValue));
        } else {
          //if recharge is not true, it means that senderBalance >= 0
          dealed[active[actIndex]].rechargeAmount = dealed[active[actIndex]].initialMarginValue.sub(uint256(dealed[active[actIndex]].dealers[sender].balance));
          dealed[active[actIndex]].dealers[sender].recharge = true;
          dealed[active[actIndex]].dealers[sender].rechargeTimestamp = block.timestamp;
        }
      }
    }
      if(dealed[active[actIndex]].time == 0 && dealed[active[actIndex]].activeDeal == true) {
          liquidate.push(active[actIndex]);

      }

      // if deal have more than 10 days of life and is not active will have to be deleted
      // 10 days == 864000 seconds
     if(dealed[active[actIndex]].activeDeal == false && now >= (dealed[active[actIndex]].data[0].creationDate + 7200)) {
         //create external function
        cancel.push(active[actIndex]);
      }
    //for end
    }
    dailyPair[_index] = _value;
    return true;
  }

  function cancellations() public returns (bool){
      uint len = cancel.length;
      for(uint canIndex = 0; canIndex < len; canIndex++) {
         //create external function
        cancelDeal(cancel[canIndex]);
      }
      delete cancel;
  }

  function liquidations() public returns(bool) {
    uint len = liquidate.length;

    for(uint liqIndex = 0; liqIndex < len; liqIndex++) {
        dealed[liquidate[liqIndex]].dealers[0].addr.transfer(uint256(dealed[liquidate[liqIndex]].dealers[0].balance));
        emit LogWithdrawal(dealed[liquidate[liqIndex]].dealers[0].addr, uint256(dealed[liquidate[liqIndex]].dealers[0].balance));
        dealed[liquidate[liqIndex]].dealers[0].balance = 0;

        dealed[liquidate[liqIndex]].dealers[1].addr.transfer(uint256(dealed[liquidate[liqIndex]].dealers[1].balance));
        emit LogWithdrawal(dealed[liquidate[liqIndex]].dealers[1].addr, uint256(dealed[liquidate[liqIndex]].dealers[1].balance));
        dealed[liquidate[liqIndex]].dealers[1].balance = 0;

        dealed[liquidate[liqIndex]].activeDeal = false;
        delete dealed[liquidate[liqIndex]].dealers[0];
        delete dealed[liquidate[liqIndex]].dealers[1];
        delete dealed[liquidate[liqIndex]].data[0];
        delete dealed[liquidate[liqIndex]];
    }
    delete liquidate;
    setActive();
    return true;
  }

  function setCurrentPair(uint256 _index, uint256 _value) internal returns(bool) {
    pair[_index] = _value;
    return true;
  }

  function rechargeDealer(uint256 _dealId) public payable returns (bool success) {
    require(dealed[_dealId].dealers[0].addr == msg.sender || dealed[_dealId].dealers[1].addr == msg.sender);
    require(dealed[_dealId].rechargeAmount == msg.value);

    uint256 liquidation;
    uint256 sender;
    uint256 receiver;
    uint256 timestamp = block.timestamp;

    if(dealed[_dealId].dealers[0].addr == msg.sender) {
      require(dealed[_dealId].dealers[0].recharge == true);
      sender = 0;
      receiver = 1;
    }

    if(dealed[_dealId].dealers[1].addr == msg.sender) {
      require(dealed[_dealId].dealers[1].recharge == true);
      sender = 1;
      receiver = 0;
    }
    //can't use SafeMath library because we can't know if balance is positive or negative
    dealed[_dealId].dealers[sender].balance = dealed[_dealId].dealers[sender].balance + int256(msg.value);
    liquidation = dealed[_dealId].liquidationAmount;

    if(liquidation > 0) {
      dealed[_dealId].dealers[receiver].balance = dealed[_dealId].dealers[receiver].balance + int256(liquidation);
      dealed[_dealId].dealers[sender].totalLiquidation = dealed[_dealId].dealers[sender].totalLiquidation - int256(liquidation);
      dealed[_dealId].dealers[receiver].totalLiquidation = dealed[_dealId].dealers[receiver].totalLiquidation + int256(liquidation);
      dealed[_dealId].time = dealed[_dealId].time - 1;
    }
    dealed[_dealId].dealers[sender].recharged.push(timestamp);
    dealed[_dealId].dealers[sender].rechargeRecord[timestamp] = msg.value;

    dealed[_dealId].dealers[sender].totalRecharge = dealed[_dealId].dealers[sender].totalRecharge.add(msg.value);
    dealed[_dealId].dealers[sender].recharge = false;
    dealed[_dealId].dealers[sender].rechargeTimestamp = 0;
    dealed[_dealId].rechargeAmount = 0;
    dealed[_dealId].liquidationAmount = 0;

    emit LogDeposit(msg.sender, msg.value);

    return true;
  }


  function withdraw(uint256 _value) external onlyOwner {
      //send eth to owner address
      msg.sender.transfer(_value);
      //executes event to register the changes
      emit LogWithdrawal(msg.sender, _value);
  }

  function cancelDeal(uint256 _dealId) public returns (bool success) {
     require(dealed[_dealId].activeDeal == false);
     require(dealed[_dealId].dealers[0].addr == 0 || dealed[_dealId].dealers[1].addr == 0);

     uint256 amount;
     address _to;
     uint256 creator;

      //look for creator
      if(dealed[_dealId].dealers[0].addr != 0) {
          creator = 0;
      }
      if(dealed[_dealId].dealers[1].addr != 0) {
          creator = 1;
      }

      _to = dealed[_dealId].dealers[creator].addr; // get creator address
      amount = uint256(dealed[_dealId].dealers[creator].balance); // get creatorBalance

      emit LogWithdrawal(_to, amount);

      _to.transfer(amount); // returns balance to creator

      //delete deal
      delete dealed[_dealId].dealers[0];
      delete dealed[_dealId].dealers[1];
      delete dealed[_dealId].data[0];
      delete dealed[_dealId];

      setPendings();

      return true;
  }

  function withdrawProfits(uint256 _dealId) public {
    require(msg.sender == dealed[_dealId].dealers[0].addr || msg.sender == dealed[_dealId].dealers[1].addr );

    uint256 _sender;
    uint256 _value;
    address _to;

    if(msg.sender == dealed[_dealId].dealers[0].addr){
      _sender = 0;
    }

    if(msg.sender == dealed[_dealId].dealers[1].addr){
      _sender = 1;
    }

    require(dealed[_dealId].dealers[_sender].balance > int256(dealed[_dealId].initialMarginValue));

    _value = uint256(dealed[_dealId].dealers[_sender].balance).sub(dealed[_dealId].initialMarginValue);
    dealed[_dealId].dealers[_sender].balance = dealed[_dealId].dealers[_sender].balance - int256(_value);
    _to = dealed[_dealId].dealers[_sender].addr;

    emit LogWithdrawal(_to, _value);

     _to.transfer(_value);

  }

  function setTask(uint256 _f, string _url) public payable {
      Token token = Token(tokenAddr);
      token.setTask.value(msg.value)(contractAddr, _f, _url);
  }

  function setTokenParameters(uint256 _ticker, uint256 _index) public returns(bool success) {
      tokenTicker = _ticker;
      tokenIndex = _index;

      return true;
  }

  function xplodingData() public{
    // this function must be executed one time before Run or RUNdailyPair
    Token token = Token(tokenAddr);
    xpldDataAmount = token.xpldData(tokenTicker);
  }

  function RUN() public {
      setCurrentPair(tokenIndex, xpldDataAmount);
  }

  function RUNdailyPair() public {
      setPairPrice(tokenIndex, xpldDataAmount);
  }

}
