import {useEffect, useState} from 'react'
import {signIn} from 'next-auth/react'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Snackbar from '@mui/material/Snackbar'
import {deepOrange} from '@mui/material/colors'
import LogoutIcon from '@mui/icons-material/Logout'
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount'
import {usePolkadot} from '@/hooks/usePolkadot'
import type {InjectedAccountWithMeta} from '@polkadot/extension-inject/types'

type Props = {
  address: string
  onSignout: () => void
}

export default function ({address, onSignout}: Props) {
  const {
    accounts,
    hasAccount,
    selectedAccount,
    setSelectedAccount,
    getSignature,
    error,
  } = usePolkadot(true)
  const [isShowAccountPicker, setIsShowAccountPicker] = useState<boolean>(false)
  const [signinError, setSigninError] = useState<Error>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (hasAccount) {
      accounts.forEach((account) => {
        if (account.address === address) {
          setSelectedAccount(account)
        }
      })
    }
  }, [address, accounts])

  useEffect(() => {
    setSigninError(error)
  }, [error])

  async function handleSwitch(account: InjectedAccountWithMeta) {
    hideSigninError()
    hideAccountPicker()
    const message = `Sign-in request for address ${account.address}.`
    const signature = await getSignature(message, account)
    if (signature) {
      setLoading(true)
      try {
        const resp = await signIn('polkadot', {
          address: account.address,
          message,
          signature,
          redirect: false,
        })
        if (resp.ok) {
          setSelectedAccount(account)
        } else {
          throw new Error(resp.error)
        }
      } catch (error: any) {
        setSigninError(error)
      }
      setLoading(false)
    }
  }

  function showAccountPicker() {
    setIsShowAccountPicker(true)
  }

  function hideAccountPicker() {
    setIsShowAccountPicker(false)
  }

  function hideSigninError() {
    setSigninError(null)
  }

  return (
    <>
      <CardHeader
        title="Secret Page"
        action={
          <Button
            variant="outlined"
            aria-label="Signout"
            startIcon={<LogoutIcon />}
            onClick={onSignout}
          >
            Signout
          </Button>
        }
      />
      <Divider />
      <CardHeader
        avatar={
          <Avatar sx={{bgcolor: deepOrange[500]}}>
            {selectedAccount?.meta.name ?? address}
          </Avatar>
        }
        title={selectedAccount?.meta.name}
        titleTypographyProps={{variant: 'h5'}}
        subheader={address}
        action={
          <Button
            aria-label="Switch account"
            variant="outlined"
            startIcon={<SwitchAccountIcon />}
            onClick={showAccountPicker}
          >
            Switch
          </Button>
        }
      />
      <Dialog
        open={isShowAccountPicker}
        onClose={hideAccountPicker}
        disableEscapeKeyDown={false}
      >
        <DialogTitle>Select an account</DialogTitle>
        <List sx={{pt: 0}}>
          {accounts.map((account) => (
            <ListItem key={account.address} disableGutters>
              <ListItemButton
                onClick={() => handleSwitch(account)}
                disabled={account.address === selectedAccount?.address}
              >
                <ListItemAvatar>
                  <Avatar sx={{bgcolor: deepOrange[500]}}>
                    {selectedAccount?.meta.name ?? address}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={account.meta.name}
                  secondary={account.address}
                  primaryTypographyProps={{variant: 'h5'}}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
      <Backdrop
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={!!signinError}
        autoHideDuration={6000}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        onClose={hideSigninError}
      >
        <Alert severity="error" sx={{width: '100%'}}>
          Error with switch: {signinError?.message}
        </Alert>
      </Snackbar>
    </>
  )
}
