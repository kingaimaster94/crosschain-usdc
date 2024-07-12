import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  motion,
} from "framer-motion";
import { WagmiConfig } from "wagmi";
import { store } from "store";
import { PageLayout } from "components/layout";
import { wagmiClient } from "../config/wagmi-client";
import { Web3Modal } from "../components/web3";

import "react-loading-skeleton/dist/skeleton.css";
import "styles/globals.css";
import { useIsMounted } from "hooks/useIsMounted";

const animation = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const transition = {
  duration: 0.5,
};

function MyApp({ Component, pageProps, router }: AppProps) {
  const isMounted = useIsMounted();
  if (!isMounted) return null;

  return (
    <Provider store={store}>
      <WagmiConfig client={wagmiClient}>
        <PageLayout>
          <LazyMotion features={domAnimation}>
            <AnimatePresence exitBeforeEnter>
              <motion.main
                className="w-full pt-20"
                key={router.route.concat("fade")}
                variants={animation}
                transition={transition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Web3Modal />
                <Component {...pageProps} />
              </motion.main>
            </AnimatePresence>
          </LazyMotion>
        </PageLayout>
      </WagmiConfig>
    </Provider>
  );
}

export default MyApp;
