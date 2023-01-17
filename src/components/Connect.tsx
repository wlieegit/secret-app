import { beatifyAddress } from "@/utils";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useState } from "react";
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

  const handleConnect = () => {
    setState({ ...initialExtensionState, loading: true });

    web3Enable("polkadot-extension-dapp-example")
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
        console.error("Error with connect", error);
        setState({ error, loading: false, data: undefined });
      });
  };

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
