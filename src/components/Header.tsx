import {useEffect, useState} from 'react'
import {signIn} from 'next-auth/react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import {deepOrange} from '@mui/material/colors'
import LogoutIcon from '@mui/icons-material/Logout'
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount'
import usePolkadot from '@/hooks/usePolkadot'
import type {InjectedAccountWithMeta} from '@polkadot/extension-inject/types'

type Props = {
  address: string
  onSignout: () => void
}

export default function ({address, onSignout}: Props) {
  const {accounts, selectedAccount, setSelectedAccount, getSignature} =
    usePolkadot(true)
  const [showPicker, setShowPicker] = useState<boolean>(false)

  useEffect(() => {
    if (accounts.length > 0) {
      accounts.forEach((account) => {
        if (account.address === address) {
          setSelectedAccount(account)
        }
      })
    }
  }, [address, accounts])

  async function handleSwitch(account: InjectedAccountWithMeta) {
    const message = `Sign-in request for address ${account.address}.`
    const signature = await getSignature(message)
    if (signature) {
      //   setLoading(true)
      try {
        await signIn('polkadot', {
          address: account.address,
          message,
          signature,
          callbackUrl: '/',
        })
      } catch (error: any) {
        // setSigninError(error)
      }
      //   setLoading(false)
    }
  }

  return (
    <>
      <CardHeader
        avatar={
          <Avatar sx={{bgcolor: deepOrange[500]}}>
            {selectedAccount?.meta.name ?? address}
          </Avatar>
        }
        title={selectedAccount?.meta.name}
        subheader={address}
        subheaderTypographyProps={{
          sx: {width: '100%', overflow: 'hidden'},
        }}
        action={
          <ButtonGroup variant="outlined" aria-label="Switch account & Signout">
            <Button
              aria-label="Switch account"
              startIcon={<SwitchAccountIcon />}
              onClick={() => setShowPicker(true)}
            >
              Switch
            </Button>
            <Button
              aria-label="Signout"
              startIcon={<LogoutIcon />}
              onClick={onSignout}
            >
              Signout
            </Button>
          </ButtonGroup>
        }
      />
      <Dialog
        open={showPicker}
        onClose={() => setShowPicker(false)}
        fullWidth
        disableEscapeKeyDown={false}
      >
        <DialogTitle>Select an account</DialogTitle>
        <List sx={{pt: 0}}>
          {accounts.map((account) => (
            <ListItem key={account.address} disableGutters>
              <ListItemButton onClick={() => handleSwitch(account)}>
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
    </>
  )
}
