import {useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {signIn} from 'next-auth/react'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import LinearProgress from '@mui/material/LinearProgress'
import Radio from '@mui/material/Radio'
import Stack from '@mui/material/Stack'
import GrainIcon from '@mui/icons-material/Grain'
import LoginIcon from '@mui/icons-material/Login'
import usePolkadot from '@/hooks/usePolkadot'
import {deepOrange} from '@mui/material/colors'

export function Connect() {
  const router = useRouter()
  const {
    accounts,
    selectedAccount,
    error,
    connect,
    setSelectedAccount,
    getSignature,
  } = usePolkadot()
  const [loading, setLoading] = useState<boolean>(false)
  const [signinError, setSigninError] = useState<Error>()

  useEffect(() => {
    const error = router.query.error
    if (error) {
      setSigninError(
        new Error(
          Array.isArray(error) ? (error as any).concat(',') : (error as string),
        ),
      )
    }
  }, [router.query.error])

  const handleConnect = useCallback(
    async function () {
      setSigninError(null)
      if (accounts.length > 0) {
        if (selectedAccount) {
          const message = `Sign-in request for address ${selectedAccount.address}.`
          const signature = await getSignature(message)
          if (signature) {
            setLoading(true)
            try {
              await signIn('polkadot', {
                address: selectedAccount.address,
                message,
                signature,
                callbackUrl: '/',
              })
            } catch (error: any) {
              setSigninError(error)
            }
            setLoading(false)
          }
        }
      } else {
        await connect()
      }
    },
    [accounts, selectedAccount],
  )

  function errorMessage(error?: Error) {
    if (error) {
      return (
        <Alert severity="error">
          Error with {accounts.length > 0 ? 'signin' : 'connect'}:{' '}
          {error.message}
        </Alert>
      )
    }
    return null
  }

  return (
    <Stack spacing={1}>
      {errorMessage(error)}
      {errorMessage(signinError)}
      {accounts.length > 0 && (
        <List dense sx={{width: '100%', bgcolor: 'background.paper'}}>
          {accounts.map((account) => {
            return (
              <ListItem
                key={account.address}
                onClick={() => setSelectedAccount(account)}
                secondaryAction={
                  <Radio
                    checked={selectedAccount?.address === account.address}
                  />
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar sx={{bgcolor: deepOrange[500]}}>
                      {account.meta.name}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={account.meta.name}
                    secondary={account.address}
                    primaryTypographyProps={{variant: 'h5'}}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      )}
      <Button
        variant="contained"
        aria-label={accounts.length > 0 ? 'Signin' : 'Connect'}
        startIcon={accounts.length > 0 ? <LoginIcon /> : <GrainIcon />}
        onClick={handleConnect}
        disabled={loading || (accounts.length > 0 && !selectedAccount)}
      >
        {accounts.length > 0 ? 'Signin' : 'Connect'}
      </Button>
      {loading && <LinearProgress />}
    </Stack>
  )
}
