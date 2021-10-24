import web3 from './web3';
import ElectionFactory from './Build/ElectionFact.json';

const instance = new web3.eth.Contract(
	JSON.parse(ElectionFactory.interface),
    '0x1d7f5040aD30820e83df4d17bD5669d5BF65DE2D'
);

export default instance;