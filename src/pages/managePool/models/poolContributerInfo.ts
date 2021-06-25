import { PoolContributerInfo, Tx } from "@/services/managePool/data";
import {
  getCurrentCycle,
  getCycleBlocks,
  getCycleForBlock,
  getPoolContributors,
  PoolContributerInfoState,
  LocalPoolContributors,
  getLocalPoolContributorInfo,
  setLocalPoolContributorInfo,
  getBalanceAtBlock,
  getBalance,
} from "@/services/managePool/managePool";
import { b58ToC32 } from "c32check";
import { useState } from "react";

const { balanceCoef } = require("@/services/constants");

// if transaction positive, this was an input / contribution, else output / spent on mining
const getTransactionValue = (
  pooledBtcAddress: string,
  transaction: Tx
): number => {
  let value = 0;
  for (const input of transaction.inputs) {
    if (input.addresses && input.addresses.includes(pooledBtcAddress)) {
      value -= input.output_value;
    }
  }
  for (const output of transaction.outputs) {
    if (output.addresses && output.addresses.includes(pooledBtcAddress)) {
      value += output.value;
    }
  }
  // if this was an output, we also paid the fees
  if (value < 0) {
    value -= transaction.fees;
  }
  return value;
};

export default () => {
  let [poolContributerInfoState, setPoolContributerInfoState] =
    useState<PoolContributerInfoState>();
  const queryPoolContributerInfo = async (cycle: number) => {
    let pooledBtcAddress = localStorage.getItem("pooledBtcAddress")!;
    let res: PoolContributerInfo[] = getLocalPoolContributorInfo();
    let { startBlock, endBlock } = getCycleBlocks(cycle - 1);

    // get highest height from local info
    const highestHeight = Math.max(...res.map((o) => o.blockContribution));
    let currentBalance = 0;

    if (endBlock > highestHeight) {
      let { transactions, balance } = await getPoolContributors(
        highestHeight,
        endBlock
      );

      let txHashes = new Set(res.map((o) => o.transactionHash));
      transactions.map((transaction) => {
        // if we already stored this transaction or its not confirmed yet, skip
        if (txHashes.has(transaction.hash) || transaction.block_height == -1) {
          return;
        }

        let contribution = getTransactionValue(pooledBtcAddress, transaction);
        if (contribution > 0) {
          // sometimes the inputs can have multiple addresses, so we weigh contributions based on each address input
          const totalInputvalue = transaction.inputs.reduce(
            (prev, next) => prev + next.output_value,
            0
          );
          for (const input of transaction.inputs) {
            let weightedContribution =
              contribution * (input.output_value / totalInputvalue);
	      // https://github.com/blockstack/cli-blockstack/blob/master/src/cli.ts
            res.push({
              address: input.addresses[0], // TODO: deal with edge case where input has multiple addresses?
              stxAddress: input.addresses[0], // b58ToC32(input.addresses[0]),
              contribution: weightedContribution / balanceCoef,
              transactionHash: transaction.hash,
              cycleContribution: getCycleForBlock(transaction.block_height),
              blockContribution: transaction.block_height,
              isContribution: true,
            });
          }
        } else {
          res.push({
            address: "output",
            stxAddress: "output",
            contribution: contribution / balanceCoef,
            transactionHash: transaction.hash,
            cycleContribution: getCycleForBlock(transaction.block_height),
            blockContribution: transaction.block_height,
            isContribution: false,
          });
        }
      });
      currentBalance = balance / balanceCoef;
    } else {
      currentBalance = await getBalance();
    }

    setLocalPoolContributorInfo(res);
    res = res.filter(
      (contribution) =>
        contribution.blockContribution >= startBlock &&
        contribution.blockContribution <= endBlock &&
        contribution.isContribution
    );

    let balanceAtEndOfCycle = getBalanceAtBlock(endBlock, currentBalance);
    console.log("at the end of block", endBlock, "had", balanceAtEndOfCycle);
    return { data: res, success: true };
  };

  return {
    poolContributerInfoState,
    queryPoolContributerInfo,
  };
};
