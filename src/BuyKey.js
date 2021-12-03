import React, { useContext, useEffect, useState } from 'react'

import { ProviderContext } from '../src/App'
import { Lock } from './utils'
import Loading from './Loading'

export const BuyKey = ({lockAddress}) => {
  const { provider } = useContext(ProviderContext)
  const [lock, setLock] = useState(null)
  const [loadingReason, setLoadingReason] = useState("loading lock")

  useEffect(() => {
    const loadLock = async () => {
      if (provider) {
        setLock(await Lock(lockAddress, provider))
        setLoadingReason("")
      }
    }
    loadLock()
  }, [lockAddress, provider])

  const buyKey = async () => {
    setLoadingReason("Check your wallet")
    try {
    await lock.purchase((state) => {
      setLoadingReason(state)
    })
    } catch(error) {
      alert('Transaction failed...')
    }
    setLoadingReason("")
    alert("Success! You now own an NFT membership!")
  }

  if(loadingReason) {
    return <Loading reason={loadingReason} />
  }
  return <button onClick={buyKey}>Buy Key for {lock.keyPrice}!</button>
}