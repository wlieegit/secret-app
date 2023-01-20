import {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import {useSignout} from '@/hooks/useSignout'
import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true)
      fetch('/api/v1/secret').then(async (res) => {
        const {secret} = await res.json()
        setSecret(secret)
      }).catch(setError).finally(() => {
        setLoading(false)
      })
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  return (
    <Container
      data-testid="page-container"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingY: '20px',
      }}
    >
      <Card sx={{width: 650, minWidth: 650}}>
        <Header address={session.user.address} onSignout={handleSignout} />
        <CardContent>
          {secret && (
            <Typography
              data-testid="secret-text"
              variant="h5"
              component="div"
              color="text.primary"
              gutterBottom
              aria-label={secret}
            >
              {secret}
            </Typography>
          )}
          {loading && (
            <>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton />
            </>
          )}
        </CardContent>
      </Card>
      {error && (
        <Alert severity="error" sx={{width: '100%'}}>
          Error retrieve secret: {error?.message}
        </Alert>
      )}
    </Container>
  )
}

export default SecretPage
