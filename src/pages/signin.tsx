import dynamic from 'next/dynamic'
import {getSession} from 'next-auth/react'
import {NextPageContext} from 'next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

const Connect = dynamic(
  () => import('@/components/Connect').then((m) => m.Connect),
  {
    loading: () => <LinearProgress />,
    ssr: false,
  },
)

function SigninPage() {
  return (
    <Container
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingY: '20px',
      }}
    >
      <Card sx={{width: 500}}>
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            color="text.primary"
            gutterBottom
          >
            Signin with Polkadot
          </Typography>
          <Connect />
        </CardContent>
      </Card>
    </Container>
  )
}

export default SigninPage

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context)
  if (session) {
    return {
      redirect: {
        destination: '/secret',
        permanent: true,
      },
    }
  }
  return {
    props: {},
  }
}
