import { useEffect, useState } from "react";
import { selectSrcToken } from "slices/swapInputSlice";
import { SquidChain } from "types/chain";
import { Token } from "types/token";
import { useAppSelector } from "./useAppSelector";
import useTokens from "./useTokens";

const useCrosschainToken = (chain?: SquidChain, token?: Token) => {
  const srcToken = useAppSelector(selectSrcToken);
  const tokens = useTokens(chain);
  const [crosschainToken, setCrosschainToken] = useState<Token>();

  useEffect(() => {
    let _crosschainToken = tokens.find((token) => token.crosschain);

    setCrosschainToken(_crosschainToken);
  }, [srcToken, token, tokens]);

  return crosschainToken;
};

export default useCrosschainToken;
