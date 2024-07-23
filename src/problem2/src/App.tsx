import React, { useMemo, useState } from "react";
import "./App.css";
import {
  AutoComplete,
  Button,
  Form,
  AutoCompleteProps,
  Flex,
  Row,
  Col,
  InputNumber,
  Image,
} from "antd";
import useCurrency from "./hooks/useCurrency";
import useTokens from "./hooks/useTokenPrice";

function App() {
  const { convert, prices } = useCurrency();
  const { getImage } = useTokens();
  const [fromCurrency, setFromCurrency] = useState<string | null>("USD");
  const [toCurrency, setToCurrency] = useState<string | null>("USDC");
  const [send, setSend] = useState<number | null>(0);

  const receive = useMemo(() => {
    if (fromCurrency && toCurrency) {
      return convert(send!, fromCurrency, toCurrency);
    } else {
      return null;
    }
  }, [send, fromCurrency, toCurrency, convert]);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };
  const autoCompleteProps: AutoCompleteProps = {
    options: prices.map((item, index) => {
      return {
        key: index,
        value: item.currency,
      };
    }),
    style: { width: 100 },
    placeholder: "Select a currency",
    filterOption: (inputValue, option) => {
      return (
        option?.value
          ?.toString()
          .toUpperCase()
          .indexOf(inputValue.toUpperCase()) !== -1
      );
    },
  };
  return (
    <div className="swap-container">
      <h1>Swap</h1>

      <Form className="swap-form">
        <Flex vertical justify="space-around" align="center" gap={15}>
          <Row gutter={16} className="swap-row">
            <Col>
              <label>Amount to send:</label>
            </Col>
            <Col>
              <InputNumber
                className="swap-input"
                value={send}
                onChange={(value) => setSend(value)}
              />
              <AutoComplete
                {...autoCompleteProps}
                value={fromCurrency}
                onChange={(value) => {
                  setFromCurrency(value);
                }}
              />
              <Image
                className="token-image"
                src={getImage(fromCurrency)}
                preview={false}
              />
            </Col>
          </Row>
          <Row gutter={16} className="swap-row">
            <Col>
              <label>Amount to receive:</label>
            </Col>
            <Col>
              <InputNumber className="swap-input" disabled value={receive} />
              <AutoComplete
                {...autoCompleteProps}
                value={toCurrency}
                onChange={(value) => setToCurrency(value)}
              />
              <Image
                className="token-image"
                src={getImage(toCurrency)}
                preview={false}
              />
            </Col>
          </Row>
          <Button className="swap-btn" onClick={handleSwap}>
            CONFIRM SWAP
          </Button>
        </Flex>
      </Form>
    </div>
  );
}

export default App;
