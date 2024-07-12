import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useAccount, useConnect } from "wagmi";

export const Web3Modal = () => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const modalRef = useRef<any>();

  function closeModal() {
    if (modalRef?.current?.checked) modalRef.current.checked = false;
  }

  function handleOnMetamaskSwitch() {
    const metamaskConnector = connectors[0];
    connect({ connector: metamaskConnector });
  }

  function handleOnWalletConnectSwitch() {
    const walletConnectConnector = connectors[1];
    connect({ connector: walletConnectConnector });
  }

  function handleOnCoinbaseWalletSwitch() {
    const coinbaseConnector = connectors[2];
    connect({ connector: coinbaseConnector });
  }

  useEffect(() => {
    if (isConnected) closeModal();
  }, [isConnected]);

  function renderConnectors() {
    return (
      <div>
        <h4 className="text-lg font-light text-white">Select Wallet</h4>

        <div className="grid grid-cols-2 mt-4 gap-x-4 gap-y-5">
          <button
            className="relative flex btn btn-primary bg-[#181A25]"
            onClick={handleOnMetamaskSwitch}
          >
            <span>Metamask</span>
            <div className="ml-auto">
              <Image
                src="/assets/svg/metamask-logo.svg"
                alt="metamask"
                layout="intrinsic"
                objectFit="contain"
                height={30}
                width={30}
              />
            </div>
          </button>
          <button
            className="relative flex btn btn-primary bg-[#181A25]"
            onClick={handleOnWalletConnectSwitch}
          >
            <span>Wallet Connect</span>
            <div className="ml-auto">
              <Image
                src="/assets/svg/walletconnect-logo.svg"
                alt="metamask"
                layout="intrinsic"
                objectFit="contain"
                height={30}
                width={30}
              />
            </div>
          </button>
          <button
            className="relative flex btn btn-primary bg-[#181A25]"
            onClick={handleOnCoinbaseWalletSwitch}
          >
            <span>Coinbase Wallet</span>
            <div className="ml-auto">
              <Image
                src="/assets/svg/walletconnect-logo.svg"
                alt="metamask"
                layout="intrinsic"
                objectFit="contain"
                height={30}
                width={30}
              />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={modalRef}
        type="checkbox"
        id="web3-modal"
        className="modal-toggle"
      />
      <label
        htmlFor="web3-modal"
        className="cursor-pointer modal backdrop-blur-sm"
      >
        <label className="relative bg-gradient-to-b to-[#191E31] from-[#192431] modal-box max-w-lg">
          {renderConnectors()}
        </label>
      </label>
    </div>
  );
};
