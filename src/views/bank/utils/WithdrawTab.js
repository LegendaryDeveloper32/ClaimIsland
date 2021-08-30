import React, { useState } from "react";
import { get } from "lodash";

import { withdraw } from "../../../web3/bank";
import { formatToWei } from "../../../web3/shared";

import { useForm } from "react-hook-form";
import BigNumber from "bignumber.js";
import { formatNumber, getBalancesFormatted } from "./";
import SliderWithPercentages from "./SliderWithPercentages";

import {
  onDepositHarvestTxn,
  onDepositHarvestError,
  onDepositHarvestSuccess,
  onWithdrawPearlRewardsAlert,
} from "../character/OnDepositHarvest";

const WithdrawTab = ({ useSharedState, updateCharacter, updateAccount }) => {
  const [state, setSharedState] = useSharedState();
  const [withdrawFee, setWithdrawFee] = useState(false);
  const { pool, account, withdrawAmount } = state;
  const [inTx, setInTx] = useState(false);

  const { handleSubmit, formState } = useForm();
  const { errors } = formState;

  const handleWithdrawChange = (e) => {
    setSharedState({ ...state, withdrawAmount: e.target.value });
  };

  const handleWithdraw = async () => {
    if (withdrawFee) {
      onWithdrawPearlRewardsAlert(updateCharacter, async () => {
        await executeWithdraw();
      });
    } else {
      await executeWithdraw();
    }
  };

  const executeWithdraw = async () => {
    setInTx(true);
    onDepositHarvestTxn(updateCharacter);

    try {
      await withdraw(pool.poolId, formatToWei(withdrawAmount));
      const balances = await getBalancesFormatted(account, pool.lpToken, pool.isSingleStake);

      const currentDepositBN = new BigNumber(pool.userDepositAmountInPool);
      const depositBN = new BigNumber(withdrawAmount);
      const newDepositBN = currentDepositBN.minus(depositBN).toString();

      setSharedState({
        ...state,
        balances,
        withdrawAmount: "0",
        pool: {
          ...pool,
          userDepositAmountInPool: newDepositBN,
        },
      });
      setInTx(false);
      onDepositHarvestSuccess(updateCharacter);
    } catch (error) {
      onDepositHarvestError(updateCharacter);
      setInTx(false);
      updateAccount({ error: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleWithdraw)} className="w-full">
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex items-center justify-between opacity-40 text-xl">
          <div className="">Vault:</div>
          <div className="flex items-center">
            <div className="mx-2">
              {formatNumber(+get(state, "pool.userDepositAmountInPool", "0"), 3)}
            </div>
            {/* TODO convert LP to dolar */}
            {/* <div className="text-sm">($15.01) </div> */}
          </div>
        </div>

        {/* TODO */}
        {/* <div className="flex items-center  my-4">
        <div className="text-xl mr-4">Withdraw to</div>

        <div className="flex items-center">
          <div className="avatar">
            <div className=" rounded-full w-8 h-8">
              <img src="https://clamisland.fi/favicon/android-chrome-192x192.png" />
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div> */}

        <div className="flex flex-col px-8 py-4">
          <div className="w-full flex justify-between items-center ">
            <input
              className="text-4xl text-right pt-2 w-full rounded bg-transparent"
              placeholder="Amount"
              type="number"
              max={get(state, "pool.userDepositAmountInPool")}
              value={formatNumber(+state.withdrawAmount, 3)}
              onChange={handleWithdrawChange}
            />

            {/* TODO convert to dolar */}
            {/* <div className="text-md opacity-40"> ($7.01) </div> */}
          </div>

          <SliderWithPercentages useSharedState={useSharedState} />

          {errors.withdrawAmount && <div className="my-2 text-error">Validation Error</div>}
        </div>

        <button
          disabled={inTx}
          type="submit"
          className="w-full text-white bg-red-500 hover:bg-red-400 rounded-xl shadow-xl p-2 text-center text-2xl"
        >
          Withdraw {get(state, "pool.name")}
        </button>
      </div>
    </form>
  );
};
export default WithdrawTab;