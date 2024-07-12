import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { selectTokenApprovalByChainId } from "slices/tokenApprovalSlice";
import { selectSrcChain, selectSrcToken } from "slices/swapInputSlice";
import { useAppSelector } from "./useAppSelector";
import useTokens from "./useTokens";
import { useRouter } from "next/router";
import useSwapChecker from "./useSwapChecker";
import useSpenderAddress from "./useSpenderAddress";

const useApproveChecker = () => {
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const router = useRouter();
  const srcTokens = useTokens(srcChain);
  const swapType = useSwapChecker();
  const tokenApproval = useAppSelector((rootState) =>
    selectTokenApprovalByChainId(rootState, srcChain?.id)
  );
  const [isRequiredApproval, setIsRequiredApproval] = useState(false);
  const spenderAddress = useSpenderAddress();

  useEffect(() => {
    if (
      srcToken &&
      srcChain &&
      spenderAddress &&
      srcToken.address !== ethers.constants.AddressZero &&
      tokenApproval[srcToken.address] &&
      tokenApproval[srcToken.address][spenderAddress]
    ) {
      const _isRequiredApproval = ethers.BigNumber.from(
        tokenApproval[srcToken.address][spenderAddress]
      ).eq(0);

      setIsRequiredApproval(_isRequiredApproval);
    } else {
      setIsRequiredApproval(false);
    }
  }, [
    router.pathname,
    spenderAddress,
    srcChain,
    srcToken,
    srcTokens,
    swapType,
    tokenApproval,
  ]);

  return isRequiredApproval;
};

export default useApproveChecker;
