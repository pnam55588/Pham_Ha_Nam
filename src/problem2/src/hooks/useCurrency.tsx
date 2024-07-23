import { useState, useEffect, useCallback } from "react";

export interface Price {
  currency: string;
  date: string;
  price: number;
}

const useCurrency = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [currencyNames, setCurrencyNames] = useState<string[]>([]);
  const apiUrl = "https://interview.switcheo.com/prices.json";
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(apiUrl);
        const data: Price[] = await response.json();
        setPrices(data);
        setCurrencyNames([...data.map((item) => item.currency)]);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, [apiUrl]);

  const getCurrencyNames = useCallback(() => {
    return currencyNames;
  }, [currencyNames]);

  const getPrice = useCallback(
    (currency: string): number | null => {
        
      const priceObj = prices.find((item) => item.currency === currency);
      return priceObj ? priceObj.price : null;
    },
    [prices]
  );

  const convert = useCallback(
    (
      amount: number,
      fromCurrency: string,
      toCurrency: string
    ): number | null => {
      const fromPrice = getPrice(fromCurrency);
      const toPrice = getPrice(toCurrency);
      

      if (fromPrice !== null && toPrice !== null) {
        return (amount * toPrice) / fromPrice;
      } else {
        console.error("Currency not found");
        return null;
      }
    },
    [getPrice]
  );

  return {
    prices,
    getCurrencyNames,
    convert,
    getPrice,
  };
};

export default useCurrency;
