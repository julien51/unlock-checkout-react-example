import { ethers } from 'ethers'
import PublicLockAbi from './PublicLock.abi'
import Erc20Abi from './PublicLock.abi'

const ZERO = '0x0000000000000000000000000000000000000000'


/**
 * Helper function that yields a lock object with price properties set
 * and a function for purchase. Needs an Ethers signer.
 * @param {*} address
 * @param {*} network
 */
export const Lock = async (address, signer) => {
  const lockContract = new ethers.Contract(address , PublicLockAbi , signer)
  const keyPrice = await lockContract.keyPrice()
  const currency = await lockContract.tokenAddress()
  let keyPriceSymbol = 'ETH'

  if (currency !== ZERO) {
    // We need to get the symbol from the ERC20 contract
    const erc20 = new ethers.Contract(currency, Erc20Abi, signer)
    keyPriceSymbol = await erc20.symbol()
  }

  /**
   * Function to purchase a key from the lock
   * Takes a callback that yields state
   */
  const purchase = async (callback) => {
    const recipient = await signer.getAddress()

    // If the lock is an ERC20, we need to set the approval tx first!
    if (currency !== ZERO) {
      callback(`Approving ${ethers.utils.formatUnits(keyPrice)} ${keyPriceSymbol} to be transfered to the lock`)
      const erc20 = new ethers.Contract(currency, Erc20Abi, signer)
      const approvalTx = await erc20.approve(address, keyPrice)
      callback('Waiting for transaction to be mined')
      await approvalTx.wait()
    }

    const purchaseParams = [
      keyPrice, // price to pay
      recipient, // recipient of NFT
      recipient, // recipient of UDT
      []
    ]
    const purchaseForOptions = {}

    callback('Estimating gas cost')
    // Get the gas cost, because estimates are often wrong.
    const gasLimit = await lockContract.estimateGas.purchase(
      ...purchaseParams,
      purchaseForOptions
    )
    // Bump by 20%
    purchaseForOptions.gasLimit = gasLimit.mul(12).div(10).toNumber()

    callback('Approving purchase transaction')
    const tx = await lockContract.purchase(
      ...purchaseParams,
      purchaseForOptions
    )
    callback('Waiting for transaction to be mined')
    await tx.wait()
  }

  return {
    keyPrice: `${ethers.utils.formatUnits(keyPrice)} ${keyPriceSymbol}`,
    purchase
  }
}