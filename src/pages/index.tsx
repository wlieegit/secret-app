import {useEffect, useState} from 'react'
import useSignout from '@/hooks/useSignout'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import {deepOrange} from '@mui/material/colors'
import LogoutIcon from '@mui/icons-material/Logout'

function SecretPage() {
  const {handleSignout, session, isAuthenticated} = useSignout()
  const [secret, setSecret] = useState<string>()

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/v1/secret').then(async (res) => {
        const {secret} = await res.json()
        setSecret(secret)
      })
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingY: '20px',
      }}
    >
      <Card sx={{width: 500}}>
        <CardHeader
          avatar={
            <Avatar sx={{bgcolor: deepOrange[500]}}>
              {session.user.address}
            </Avatar>
          }
          action={
            <Button
              aria-label="Signout"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleSignout}
            >
              Signout
            </Button>
          }
        />
        <CardContent>
          {secret ? (
            <Typography
              variant="h5"
              component="div"
              color="text.primary"
              gutterBottom
              aria-label={secret}
            >
              {secret}
            </Typography>
          ) : (
            <>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton />
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default SecretPage
