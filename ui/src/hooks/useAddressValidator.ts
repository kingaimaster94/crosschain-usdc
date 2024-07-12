import config from "config/constants";
import { useEffect, useState } from "react";
import { getProvider } from "utils/provider";

export interface Validation {
  isValid: boolean;
  error?: string;
}

const useAddressValidator = (aliasAddress: string | undefined) => {
  const [valid, setValid] = useState<Validation>({ isValid: true });

  useEffect(() => {
    (async () => {
      if (!aliasAddress) return;

      try {
        const addr = aliasAddress?.trim();
        if (!(await getProvider(config.chains[0]).resolveName(addr))) {
          setValid({
            isValid: false,
            error: `Unresolved alias address: ${addr}`,
          });
          return;
        } else {
          setValid({
            isValid: true,
          });
        }
      } catch (e) {
        console.log(e);
        setValid({
          isValid: false,
          error: "Incorrect alias",
        });
      }
    })();
  }, [aliasAddress]);

  return valid;
};

export default useAddressValidator;
