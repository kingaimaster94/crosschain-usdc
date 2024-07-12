import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { Result } from "ethers/lib/utils";
import multicallAbi from "../abi/multicall.json";

function encodeFunctionCalls(
  functionName: string,
  args: any[],
  abi: any
): string {
  const abiInterface = new ethers.utils.Interface(abi);
  return abiInterface.encodeFunctionData(functionName, args);
}

function decodeFunctionCall(
  functionName: string,
  result: any,
  abi: any
): Result {
  const abiInterface = new ethers.utils.Interface(abi);
  const outputs = abiInterface.decodeFunctionResult(functionName, result);
  return outputs[0];
}

interface Call {
  name: string;
  targetAddress: string;
  params: string[];
}

export function makeCalls(
  multicallAddress: string,
  provider: Provider,
  abi: any,
  _calls: Call[]
): Promise<any[]> {
  const contract = new ethers.Contract(
    multicallAddress,
    multicallAbi,
    provider
  );
  const calls = _calls.map((call) => ({
    target: call.targetAddress,
    callData: encodeFunctionCalls(call.name, call.params, abi),
  }));
  return contract
    .aggregate(calls)
    .then((res: any) => res.returnData)
    .then((datas: any) => {
      return datas.map((data: any, i: number) =>
        decodeFunctionCall(_calls[i].name, data, abi)
      );
    });
}
