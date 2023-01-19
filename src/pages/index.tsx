import {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import useSignout from '@/hooks/useSignout'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

const Header = dynamic(() => import('@/components/Header'), {
  loading: () => <LinearProgress />,
  ssr: false,
})

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
      <Card sx={{width: 650, minWidth: 650}}>
        <Header address={session.user.address} onSignout={handleSignout} />
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
