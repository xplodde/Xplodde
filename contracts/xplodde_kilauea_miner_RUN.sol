pragma solidity 0.4.25;

/*

//////////////////////////////////////////////////////////////
//                                                          //
//                 Kilauea Oracle                           //
//                                                          //
//////////////////////////////////////////////////////////////


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



library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}



contract Ownable {

    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() internal {
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




contract KilaueaRunner {

    function RUN() pure public {}
    function transfer(address,uint256) pure public{}
    function balanceOf() pure public returns(uint256){}

}


contract Kilauea is Ownable {

    using SafeMath for uint256;

    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) internal allowed;

    /* Public variables for the ERC20 token */
    string public constant standard = "Kilauea Oracle";
    uint8 public constant decimals = 18; // hardcoded to be a constant
    string public name = "Kilauea";
 
    uint256 public totalSupply;

    mapping (uint256 => mapping (uint256 => datas)) public time;
    mapping (address => mapping (uint256 => task)) public tasks;

    mapping (address => uint256) public reputation;
    mapping (address => tikerS) public tikers;
    mapping (uint256 => federationS) public federations;
    /*tikerS internal tikers; //changed from internal to public for testing reasons*/

    mapping (uint256 => reputationS) public reputationRound;

    struct task{
        uint256 amount;
        uint256 lastTime;
        uint256 frequency;
        string url;
        uint256 federation;
    }



    struct tikerS{
        string name;
        uint256 id;
    }

    struct federationS{
        string name;
        address owner;
        uint256 fee;
        mapping (address => bool) members;

    }

    constructor (

        ) public {

    }

    uint256 public idTiker = 1;
    uint256 public idFederation = 1;
    uint256 public lastGas = 1000000000;

    mapping(address => uint256 ) public lastTime;

    struct datas {
        uint256[] data;
        uint256 length;

    }

    struct reputationS {
        uint256 reputationSum;
        uint256[] members;
        uint256 length;
    }

    mapping (uint256 => uint256) public minRoundTime;
    mapping (uint256 => uint256) public last;
    mapping (uint256 => uint256) public lastData;


    uint256 public windowTime=60;



    function mintData(uint256 dataOracle, uint256 tiker, address token) public  returns(bool){
         uint256 len;
         updateMinRoundTime(tiker);

        //set last time
        if(block.timestamp - last[tiker] >= minRoundTime[tiker]){
           last[tiker] = block.timestamp;
        }

        uint256 timeround = last[tiker];


        //get round length
        if(time[tiker][timeround].length == 0){
            len = 0;
        }else{
            len = time[tiker][timeround].length;
        }


        //deny recurrent conections by address
        if(lastTime[msg.sender] > 0){
            //this require have to be changed
            require(block.timestamp - lastTime[msg.sender] >= minRoundTime[tiker]-windowTime);
        }

        //respect mint window time
        if(block.timestamp>last[tiker]){
             require(block.timestamp-last[tiker] >= minRoundTime[tiker]-windowTime);

        }

        //require min reputation
        //reputationRound[block.timestamp].length
        if(reputationRound[timeround].length > 0){
            require(reputation[msg.sender] >= reputationMediana(tiker));
        }

        require(federations[tasks[token][tiker].federation].members[msg.sender]==true);

        //set data time round by sender

        lastData[tiker] = dataOracle;

        //store data
        time[tiker][timeround].data.push(dataOracle);
        time[tiker][timeround].length = len + 1;

        //set reputation
        reputation[msg.sender] = reputation[msg.sender] + 1;
        reputationRound[timeround].members.push(reputation[msg.sender]);

        //add miner reward
        balances[msg.sender] = balances[msg.sender].add(lastGas*10);

        //add coins to supply
        totalSupply = totalSupply.add(lastGas * 10);

        //set max gas transaction cost
        lastGas = tx.gasprice * block.gaslimit;

        lastTime[msg.sender] = block.timestamp;



        if(block.timestamp-tasks[token][tiker].lastTime > tasks[token][tiker].frequency && tasks[token][tiker].amount>gasleft()*3){

            tasks[token][tiker].amount=tasks[token][tiker].amount.sub(gasleft()*3);


            //register last
            tasks[token][tiker].lastTime;
            tasks[token][tiker].lastTime = block.timestamp;

            uint256 toTransfer = gasleft()/time[tiker][timeround].length;

            //run task
            KilaueaRunner ntask = KilaueaRunner(token);
            ntask.RUN();
            ntask.transfer(msg.sender,toTransfer);
            msg.sender.transfer(toTransfer);
        }

        return true;
    }



    //set Task
    function setTask(uint256 f, string _url, uint256 tiker, uint256 fed) payable public{

        tasks[msg.sender][tiker].amount = tasks[msg.sender][tiker].amount.add(msg.value);
        tasks[msg.sender][tiker].lastTime = block.timestamp;
        tasks[msg.sender][tiker].frequency = f;
        tasks[msg.sender][tiker].url = _url;
        tasks[msg.sender][tiker].federation = fed;
    }

    //get las data reported in a round by tiker
    function getLastPrice(uint256 _tiker, uint256 _time) view public returns(uint256){
        uint256 lastdata=time[_tiker][_time].length;
        return time[_tiker][_time].data[lastdata-1];
    }

    //buy reputation with eth donation to the project
    function add_Reputation(uint256 _val,  address _address) public onlyOwner returns(bool){
        reputation[_address]=reputation[_address].add(_val / (lastGas * 10));
        return true;
    }

    function remove_Reputation(address _address) public onlyOwner returns(bool){
        delete(reputation[_address]);
        return true;
    }

    //calculate the min round time depending the contract connection status
    function updateMinRoundTime(uint256 tiker) internal {
        // (time[tiker][block.timestamp].length
        // this always will give back 0
        // block.timestamp changed to last[tiker]
        /*if(time[tiker][last[tiker]].length < 3){
            minRoundTime[tiker] = 120;
        }else if(time[tiker][last[tiker]].length<30){
            minRoundTime[tiker] = 120;
        }else if(time[tiker][last[tiker]].length<60){
           minRoundTime[tiker] = 900;
        }else if(time[tiker][last[tiker]].length<100){
           minRoundTime[tiker] = 300;
        }else if(time[tiker][last[tiker]].length>=150){
           minRoundTime[tiker] = 60;
        }*/
        minRoundTime[tiker] = 60;
    }

    //xplodde data from contract getting the mediana , requires 2 elements in array
    function medianaData(uint256 tiker)public view returns(uint256){
        uint256 l = time[tiker][last[tiker]].length;
        uint256[] memory arr = new uint256[] (l);

        for(uint i=0;i<l;i++){
            arr[i] = time[tiker][last[tiker]].data[i];
        }

        for(i =0;i<l;i++){
            for(uint j =i+1;j<l;j++){
                if(arr[i]<arr[j]){
                    uint256 temp= arr[j];
                    arr[j]=arr[i];
                    arr[i] = temp;
                }
            }
        }
        uint256 mediana=(arr[time[tiker][last[tiker]].length/2]+arr[(time[tiker][last[tiker]].length/2)-1])/2;
        return mediana;
    }

    //return reputation mediana , requires 2 elements in array
    function reputationMediana(uint256 tiker)public view returns(uint256){

        uint256 l = time[tiker][last[tiker]].length;
        uint256[] memory arr = new uint256[] (l);

        for(uint i=0;i<l;i++){
            arr[i] = reputationRound[last[tiker]].members[i];
        }
        for(i =0;i<l;i++){
            for(uint j =i+1;j<l;j++){
                if(arr[i]<arr[j]){
                    uint256 temp= arr[j];
                    arr[j]=arr[i];
                    arr[i] = temp;
                }
            }
        }
        uint256 mediana=(arr[time[tiker][last[tiker]].length/2]+arr[(time[tiker][last[tiker]].length/2)-1])/2;
        return mediana;
    }


    function addTiker(string _name, address _addr) public payable returns(uint256){
        require(msg.value > 1000000000000000000);
        tikers[_addr].name = _name;
        tikers[_addr].id = idTiker;
        owner.transfer(msg.value);

        idTiker++;
        return tikers[_addr].id;
    }

    function addFederation(string _name,  uint256 _fee) public payable {
        require(msg.value > 1000000000000000000);
        federations[idFederation].name = _name;
        federations[idFederation].fee = _fee;
        federations[idFederation].owner = msg.sender;

        owner.transfer(msg.value);

        idFederation++;
        
    }

    function getFederationFee(uint256 _idFederation) public view returns(uint256){
        return federations[_idFederation].fee;
    }

    function federationMember( uint256 idfed, address newmember, bool state) public returns(bool){
        if(federations[idfed].owner==msg.sender){
            federations[idfed].members[newmember]=state;
            return true;
        }else{
            return false;
        }
        

    }

    function getTiker(address _addr) public view returns (string, uint256){
      return(tikers[_addr].name, tikers[_addr].id);
    }

}
