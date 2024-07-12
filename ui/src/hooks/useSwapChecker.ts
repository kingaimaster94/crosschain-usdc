import { useEffect, useState } from "react";
import {
  selectDestChain,
  selectDestToken,
  selectSrcChain,
  selectSrcToken,
} from "slices/swapInputSlice";
import { requiredSwapDest, requiredSwapSrc } from "utils/swap";
import { useAppSelector } from "./useAppSelector";

export enum SWAP_TYPE {
  SWAP_SEND_SWAP = 1,
  SWAP_SEND = 2,
  SEND_SWAP = 3,
  SEND = 4,
}

const useSwapChecker = () => {
  const srcToken = useAppSelector(selectSrcToken);
  const destToken = useAppSelector(selectDestToken);
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const [swapType, setSwapType] = useState<SWAP_TYPE>();

  useEffect(() => {
    if (srcToken && srcChain && destToken) {
      if (
        requiredSwapSrc(srcToken) &&
        requiredSwapDest(srcToken, destToken, destChain)
      ) {
        setSwapType(SWAP_TYPE.SWAP_SEND_SWAP);
      } else if (requiredSwapSrc(srcToken)) {
        setSwapType(SWAP_TYPE.SWAP_SEND);
      } else if (requiredSwapDest(srcToken, destToken, destChain)) {
        setSwapType(SWAP_TYPE.SEND_SWAP);
      } else {
        setSwapType(SWAP_TYPE.SEND);
      }
    }
  }, [srcChain, srcToken, destToken, destChain]);

  return swapType;
};

export default useSwapChecker;
