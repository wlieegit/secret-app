import { beatifyAddress } from "@/utils";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useCallback, useState } from "react";
import { signIn } from 'next-auth/react'
import styles from "@/styles/Login.module.css";

type TExtensionState = {
  data?: {
    accounts: InjectedAccountWithMeta[];
    defaultAccount: InjectedAccountWithMeta;
  };
  loading: boolean;
  error: null | Error;
};

const initialExtensionState: TExtensionState = {
  data: undefined,
  loading: false,
  error: null,
};

export const Connect = () => {
  const [state, setState] = useState(initialExtensionState);
  const handleConnect = useCallback (() => {
    const callbackUrl = '/secret'
    setState({ ...initialExtensionState, loading: true });
    web3Enable("secret-app")
      .then((injectedExtensions) => {
        if (!injectedExtensions.length) {
          return Promise.reject(new Error("NO_INJECTED_EXTENSIONS"));
        }
        return web3Accounts();
      })
      .then((accounts) => {
        if (!accounts.length) {
          return Promise.reject(new Error("NO_ACCOUNTS"));
        }
        signIn('credentials', { address: accounts[0].address, callbackUrl })
        setState({
          error: null,
          loading: false,
          data: {
            accounts: accounts,
            defaultAccount: accounts[0],
          },
        });
      })
      .catch((error) => {
        setState({ error, loading: false, data: undefined });
      });
  }, [])

  if (state.error) {
    return (
      <span className="text-red-500 font-bold tracking-tight">
        Error with connect: {state.error.message}
      </span>
    );
  }

  return state.data ? (
    <p className={styles.userName}>Hello, {beatifyAddress(state.data.defaultAccount.address)}!</p>
  ) : (
    <button
      className={styles.connectButton}
      disabled={state.loading}
      onClick={handleConnect}
    >
      {state.loading ? "Connecting..." : "Connect"}
    </button>
  );
};
