import config from "config/constants";

export function fetchBalance(
  senderAddress: string,
  spenderAddresses: string[],
  tokenAddresses: string[],
  chainId: number
) {
  return fetch(window.origin + "/api/balance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress: senderAddress,
      spenderAddresses,
      tokenAddresses,
      chainId,
    }),
  }).then((res) => {
    if (!res.ok)
      return res.text().then((text) => {
        throw new Error(text);
      });
    return res.json();
  });
}

export function fetchSwapStatus(txHash: string) {
  return fetch(config.AXELAR_SCAN_GMP + `/?method=searchGMP&txHash=${txHash}`).then(
    async (res) => {
      if (!res.ok) {
        return null;
      }
      return res
        .json()
        .then((events) => events.data[0])
        .catch((e) => null);
    }
  );
}
