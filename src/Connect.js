import React, { useContext } from 'react'
import Onboard from 'bnc-onboard'
import { ethers } from 'ethers'
import { ProviderContext } from '../src/App'

/**
 * Simple connect button that uses Blocknative's onboarding library
 * Should be swapped for any other equivalent such as web3-react (self-hosted)
 * so that we don't depend on their API endpoint to keep existing...
 */
export const Connect = () => {
  const {setProvider} = useContext(ProviderContext)
  const connectWallet = async () => {
    console.log('connect!')
    const onboard = Onboard({
      dappId: "532c0014-463a-4053-85d1-7f3ae2f5c6d6",
      networkId: 4,
      subscriptions: {
        wallet: async (wallet) => {
          const ethersProvider = new ethers.providers.Web3Provider(
            wallet.provider
          )
          const signer = await ethersProvider.getSigner()
          setProvider(signer)
        }
      }
    });
    await onboard.walletSelect();
    await onboard.walletCheck();
  }

  return <button onClick={connectWallet}>Connect Wallet!</button>

}