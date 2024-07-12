import { InputContainer } from "components/swap";
import * as swap from "components/swap";
import { useAppDispatch, useAppSelector } from "hooks/useAppSelector";
import type { NextPage } from "next";
import {
  selectAmount,
  selectDestChain,
  selectDestToken,
  selectSrcChain,
  selectSrcToken,
  setDestToken,
  setSrcToken,
} from "slices/swapInputSlice";
import { useEffect } from "react";
import useAmountValidator from "hooks/useAmountValidator";
import useApproveChecker from "hooks/useApproveChecker";
import { SwapEstimator } from "components/swap";
import { ChainInputModalKey } from "components/modals";
import { SwapRoute } from "components/utils";
import { useNetworkSwitcher } from "hooks";
import useTokens from "hooks/useTokens";
import { AxelarFee } from "components/swap/Fee";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const amount = useAppSelector(selectAmount);
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const destChain = useAppSelector(selectDestChain);
  const destToken = useAppSelector(selectDestToken);
  const srcTokens = useTokens(srcChain);
  const destTokens = useTokens(destChain);
  const isRequiredApproval = useApproveChecker();
  const amountValidation = useAmountValidator(amount, srcToken);

  // Automatically update `srcChain` and `destChain` whenever connected wallet's network has changed.
  useNetworkSwitcher();

  useEffect(() => {
    if (!srcToken && !destToken) {
      dispatch(setSrcToken(srcTokens.find((token) => !token.crosschain)));
      dispatch(setDestToken(destTokens.find((token) => !token.crosschain)));
    }
  }, [destToken, destTokens, dispatch, srcToken, srcTokens]);

  return (
    <swap.SwapContainer>
      <h1 className="text-2xl font-thin text-center text-white">
        Swap Native Tokens ✨
      </h1>
      <div className="mt-5">
        <div className="mb-2 font-light text-white">Sender</div>
        <InputContainer>
          <div className="flex items-center">
            <swap.ChainInput
              selectedChain={srcChain}
              label="From"
              modalKey={ChainInputModalKey.ModalChainFrom}
              isSrcChain={true}
            />
            <swap.AmountInput
              className="ml-4 flex-1"
              selectedToken={srcToken}
              validState={amountValidation}
            />
          </div>
        </InputContainer>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-white">Recipient</div>
        <InputContainer>
          <div className="flex items-center">
            <swap.ChainInput
              selectedChain={destChain}
              label="To"
              modalKey={ChainInputModalKey.ModalChainTo}
            />
            <swap.AddressInput className="ml-4 flex-1" />
          </div>
        </InputContainer>
      </div>

      <div className="mt-4">
        <InputContainer>
          <AxelarFee amount={amount} />
          <div className="mt-4">
            <SwapEstimator amount={amount} />
          </div>
        </InputContainer>
        <SwapRoute />
      </div>
      <div className="flex flex-col mt-8">
        <swap.SwapButton amount={amount} amountValidation={amountValidation} />
      </div>
    </swap.SwapContainer>
  );
};

export default Home;
