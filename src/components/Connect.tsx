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
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import GrainIcon from '@mui/icons-material/Grain'
import LoginIcon from '@mui/icons-material/Login'
import usePolkadot from '@/hooks/usePolkadot'
import {deepOrange} from '@mui/material/colors'

export function Connect() {
  const {
    accounts,
    hasAccount,
    selectedAccount,
    error,
    connect,
    setSelectedAccount,
    getSignature,
  } = usePolkadot()
  const [loading, setLoading] = useState<boolean>(false)
  const [signinError, setSigninError] = useState<Error>()
  const router = useRouter()

  useEffect(() => {
    setSigninError(error)
  }, [error])

  const handleConnect = useCallback(
    async function () {
      hideSigninError()
      if (hasAccount) {
        if (selectedAccount) {
          const message = `Sign-in request for address ${selectedAccount.address}.`
          const signature = await getSignature(message)
          if (signature) {
            setLoading(true)
            try {
              const resp = await signIn('polkadot', {
                address: selectedAccount.address,
                message,
                signature,
                redirect: false,
              })
              if (resp.ok) {
                await router.push('/')
              } else {
                throw new Error(resp.error)
              }
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

  function hideSigninError() {
    setSigninError(null)
  }

  return (
    <Stack spacing={1}>
      {hasAccount && (
        <List dense sx={{width: '100%', bgcolor: 'background.paper'}}>
          {accounts.map((account) => {
            return (
              <ListItem
                key={account.address}
                onClick={() => setSelectedAccount(account)}
                disablePadding
              >
                <ListItemButton
                  selected={selectedAccount?.address === account.address}
                  disabled={loading}
                  onClick={() => setSelectedAccount(account)}
                >
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
        aria-label={hasAccount ? 'Signin' : 'Connect'}
        startIcon={hasAccount ? <LoginIcon /> : <GrainIcon />}
        onClick={handleConnect}
        disabled={loading || (hasAccount && !selectedAccount)}
      >
        {hasAccount ? 'Signin' : 'Connect'}
      </Button>
      {loading && <LinearProgress />}
      <Snackbar
        open={!!signinError}
        autoHideDuration={6000}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        onClose={hideSigninError}
      >
        <Alert severity="error">
          Error with {hasAccount ? 'signin' : 'connect'}: {signinError?.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}
