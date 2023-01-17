import dynamic from "next/dynamic";
import styles from '@/styles/Login.module.css'
const Connect = dynamic(
  () => import("../components/Connect").then((m) => m.Connect),
  {
    ssr: false,
  }
);

const LoginPage = () => {
  return (
    <div className={styles.loginPage}>
      <h1>Login page</h1>
      <Connect />
    </div>
  );
};
export default LoginPage;
