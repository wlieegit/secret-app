import {useEffect, useState} from 'react'
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp'
import type {InjectedAccountWithMeta} from '@polkadot/extension-inject/types'
import {stringToHex} from '@polkadot/util'

type PolkadotData = {
  accounts: InjectedAccountWithMeta[]
  hasAccount: boolean
  selectedAccount?: InjectedAccountWithMeta
  error?: Error
  connect: () => Promise<void>
  setSelectedAccount: (account: InjectedAccountWithMeta) => void
  getSignature: (
    message: string,
    account?: InjectedAccountWithMeta,
  ) => Promise<string>
}

export default function (autoConnect: boolean = false): PolkadotData {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (isWeb3Injected) {
      connect()
    } else {
      setError(new Error('NO_WEB3_INJECTED'))
    }
  }, [isWeb3Injected, autoConnect])

  useEffect(() => {
    if (selectedAccount) {
      setSelectedAccount(selectedAccount)
    }
  }, [selectedAccount])

  async function connect() {
    try {
      hideError()
      const injectedExtensions = await web3Enable('secret-app')
      if (injectedExtensions.length > 0) {
        const accounts = await web3Accounts()
        if (accounts.length === 0) {
          throw new Error('NO_ACCOUNTS_CONNECTED')
        }
        setAccounts(accounts)
      } else {
        throw new Error('NO_INJECTED_EXTENSIONS')
      }
    } catch (error: any) {
      setError(error)
    }
  }

  async function getSignature(
    message: string,
    account?: InjectedAccountWithMeta,
  ) {
    try {
      hideError()
      const accountForSignature = account ?? selectedAccount
      const injector = await web3FromSource(accountForSignature.meta.source)
      return (
        await injector.signer?.signRaw({
          address: accountForSignature.address,
          data: stringToHex(message),
          type: 'bytes',
        })
      ).signature
    } catch (error: any) {
      setError(error)
    }
  }

  function hideError() {
    setError(null)
  }

  return {
    accounts,
    hasAccount: accounts.length > 0,
    selectedAccount,
    error,
    connect,
    setSelectedAccount,
    getSignature,
  }
}
