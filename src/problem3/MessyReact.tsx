import React, { useMemo } from "react";
import useWalletBalances from "src/hooks/useWalletBalances";
import usePrices from "src/hooks/usePrices";
import WalletRow from "src/components/WalletRow";
import { makeStyles } from '@material-ui/core/styles'; 
import { BoxProps } from '@material-ui/core';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // add blockchain property
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: string; // add blockchain property
}

interface Props extends BoxProps {} // import BoxProps from @material-ui/core
const WalletPage: React.FC<Props> = (props: Props) => {
  const useStyles = makeStyles((theme) => ({ 
    row: {
      // Define the styles for the row
    },
  }));
  const classes = useStyles(); // create a classes object

  const { ...rest } = props; // children is not used
  const balances = useWalletBalances(); // import useWalletBalances hook
  const prices = usePrices(); // import usePrices hook

  const blockchainPriorities: { [key: string]: number } = { // create a objcect with the blockchain priorities
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };
  const getPriority = (blockchain: string): number => { // any should be string
    // switch (blockchain) {
    //   case "Osmosis":
    //     return 100;
    //   case "Ethereum":
    //     return 50;
    //   case "Arbitrum":
    //     return 30;
    //   case "Zilliqa":
    //     return 20;
    //   case "Neo":
    //     return 20;
    //   default:
    //     return -99;
    // }
    return blockchainPriorities[blockchain] || -99; // simplify the switch statement
  };

  const sortedBalances: WalletBalance[] = useMemo(() => { // add type to sortedBalances, it will help to understand the code
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain); // blockchain is not a property of WalletBalance
        // if (balancePriority > -99) { // wrong variable name
        //   if (balance.amount <= 0) {
        //     return true;
        //   }
        // }
        // return false;
        return balancePriority>-99 && balance.amount<=0; // simplify the if-else statement
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // if (leftPriority > rightPriority) { // 
        //   return -1;
        // } else if (rightPriority > leftPriority) {
        //   return 1;
        // }
        return rightPriority - leftPriority  ; // simplify the if-else statement
      });
  }, [balances, prices]);

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map((balance: WalletBalance) => { // add type to balance
    return {
      ...balance,
      formatted: balance.amount.toFixed(), // coding faster, ctrl+space to see the available properties
    };
  });

  const rows = formattedBalances.map( // change to formattedBalances
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = (prices[balance.currency] || 0) * balance.amount; //check if the price is available
      return (
        <WalletRow // import WalletRow
          className={classes.row} // import classes from makeStyles
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
