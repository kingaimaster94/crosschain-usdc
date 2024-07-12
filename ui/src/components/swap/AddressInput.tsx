import { ComponentStyle } from "types/component";
import React, { ChangeEvent } from "react";
import { Validation } from "hooks/useAmountValidator";
import { DebounceInput } from "react-debounce-input";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import {
  selectSenderAddress,
  setRecipientAddress,
} from "slices/swapInputSlice";
import { useAppSelector } from "../../hooks/useAppSelector";

interface AddressInputProps extends ComponentStyle {
  validState?: Validation;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  className,
  validState,
}) => {
  const dispatch = useDispatch();
  const receipientAddress = useAppSelector(selectSenderAddress);

  const updateDestinationAddress = (address: string) => {
    const isAddress = ethers.utils.isAddress(address);
    if (isAddress) {
      dispatch(setRecipientAddress(address));
    }
  };

  return (
    <div className={className}>
      {/* <label className={`text-[#93BEFF] font-light text-sm ${className}`}>
        Destination Address
      </label> */}
      <div className="flex border items-center justify-end border-[#282B3D] w-full rounded-md">
        <DebounceInput
          className="w-full h-full px-4 py-3 text-sm font-medium text-right text-white bg-transparent outline-none placeholder:text-gray-500 placeholder:font-normal"
          placeholder={receipientAddress}
          debounceTimeout={200}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            updateDestinationAddress(e.target.value);
          }}
        />
      </div>
      {/* <div className="mt-3 text-xs font-light text-right">
        {validState?.error && (
          <span className="text-red-100">{validState?.error}</span>
        )}
      </div> */}
    </div>
  );
};
