import dynamic from 'next/dynamic'
import {getSession} from 'next-auth/react'
import {NextPageContext} from 'next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

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
        display: 'flex',
        justifyContent: 'center',
        paddingY: '20px',
      }}
    >
      <Card sx={{width: 650}}>
        <CardHeader
          aria-label="Signin with Polkadot"
          title="Signin with Polkadot"
        />
        <CardContent>
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
        destination: '/',
        permanent: true,
      },
    }
  }
  return {
    props: {},
  }
}
