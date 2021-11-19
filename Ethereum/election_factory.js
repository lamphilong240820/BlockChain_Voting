import web3 from './web3';
import ElectionFactory from './Build/ElectionFact.json';

const instance = new web3.eth.Contract(
	JSON.parse(ElectionFactory.interface),
    '0x6BdCC72eE2d1f31E5f1168aBf53fE6D668823CE6'
);

export default instance;