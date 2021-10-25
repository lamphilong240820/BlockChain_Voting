import web3 from './web3';
import ElectionFactory from './Build/ElectionFact.json';

const instance = new web3.eth.Contract(
	JSON.parse(ElectionFactory.interface),
    '0x8bC9daBcffd29701e1FE9C2d200e1C7361cB09E8'
);

export default instance;