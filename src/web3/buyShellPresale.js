import shellPresaleAbi from './abi/shellPresale.json'
import {shellPresaleAddress} from './constants'
import { contractFactory } from './index'

const buyShellPresale = async ({ account, amount }, callback, errCallback) => {
  const shellPresale = contractFactory({abi: shellPresaleAbi, address: shellPresaleAddress })

  const method = shellPresale.methods.buyTokens()

  const gasEstimation = await method.estimateGas({
    from: account,
    value: amount
  });

  await method.send({
    from: account,
    gas: gasEstimation,
    value: amount
  }).once('confirmation', async () => {
    try {
      console.log('Success') // add a toaster here
      callback('sale_success');
    } catch (error) {
      console.error(error) // add toaster to show error
      callback('sale_failure');
      errCallback(error.message);
    }
  });
}

export default buyShellPresale;

export const getPresaleRate = async () => {
  const shellPresale = contractFactory({abi: shellPresaleAbi, address: shellPresaleAddress })
  const rate = await shellPresale.methods.RATE().call()

  return rate;
}

export const individualLimitUsed = async (account) => {
  const shellPresale = contractFactory({abi: shellPresaleAbi, address: shellPresaleAddress })
  const value = await shellPresale.methods.individualLimit(account).call()

  return value;
}