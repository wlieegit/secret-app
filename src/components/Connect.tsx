import {beatifyAddress} from '@/utils'
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp'
import type {
  InjectedAccountWithMeta,
  InjectedExtension,
} from '@polkadot/extension-inject/types'
import {useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {signIn} from 'next-auth/react'
import {stringToHex} from '@polkadot/util'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import GrainIcon from '@mui/icons-material/Grain'
import LoginIcon from '@mui/icons-material/Login'

type ConnectState = {
  data?: {
    accounts: InjectedAccountWithMeta[]
    selectedAccount: number
  }
  loading: boolean
  error: Error | null
}

const initialConnectState: ConnectState = {
  data: undefined,
  loading: false,
  error: null,
}

export function Connect() {
  const router = useRouter()
  const error = router.query.error
  const [state, setState] = useState<ConnectState>(initialConnectState)

  useEffect(() => {
    const error = router.query.error
    if (error) {
      setState({
        ...initialConnectState,
        error: new Error(
          Array.isArray(error) ? (error as any).concat(',') : (error as string),
        ),
      })
    }
  }, [router.query.error])

  const handleConnect = useCallback(async () => {
    setState(initialConnectState)

    const injectedExtensions = await web3Enable('secret-app')
    if (!injectedExtensions.length) {
      setState({
        ...initialConnectState,
        error: new Error('NO_INJECTED_EXTENSIONS'),
      })
      return
    }

    let accounts: InjectedAccountWithMeta[]
    setState({...initialConnectState, loading: true})
    try {
      accounts = await web3Accounts()
    } catch (error: any) {
      setState({...initialConnectState, error})
      return
    }

    if (!accounts.length) {
      setState({
        ...initialConnectState,
        error: new Error('NO_ACCOUNTS'),
      })
      return
    }

    const account = accounts[0]
    let injector: InjectedExtension
    try {
      injector = await web3FromSource(account.meta.source)
    } catch (error: any) {
      setState({...initialConnectState, error})
      return
    }

    const message = `Sign-in request for address ${account.address}.`
    let signature: string
    try {
      signature = (
        await injector.signer?.signRaw({
          address: account.address,
          data: stringToHex(message),
          type: 'bytes',
        })
      ).signature
    } catch (error: any) {
      setState({...initialConnectState, error})
      return
    }

    try {
      await signIn('polkadot', {
        address: account.address,
        message,
        signature,
        callbackUrl: '/secret',
      })
    } catch (error: any) {
      setState({...initialConnectState, error})
      return
    }

    setState({
      ...initialConnectState,
      data: {
        accounts: accounts,
        selectedAccount: 0,
      },
    })
  }, [])

  return (
    <Stack spacing={1}>
      {state.error && (
        <Alert severity="error">
          Error with {isWeb3Injected ? 'sigin' : 'connect'}:{' '}
          {state.error.message}
        </Alert>
      )}
      {state.data && (
        <Typography variant="h5" component="div" color="text.secondary">
          Hello,{' '}
          {state.data.accounts[state.data.selectedAccount].meta.name ??
            beatifyAddress(
              state.data.accounts[state.data.selectedAccount].address,
            )}
          !
        </Typography>
      )}
      {!state.data && (
        <Button
          variant="contained"
          startIcon={isWeb3Injected ? <LoginIcon /> : <GrainIcon />}
          onClick={handleConnect}
          disabled={state.loading}
        >
          {isWeb3Injected ? 'Signin' : 'Connect'}
        </Button>
      )}
      {state.loading && <LinearProgress />}
    </Stack>
  )
}
