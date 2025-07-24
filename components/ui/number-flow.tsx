import React, { useState, useEffect } from "react";

interface NumberFlowProps {
  value: number;
  format?: {
    style?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
  };
  formatter?: (value: string) => string;
  transformTiming?: {
    duration?: number;
    easing?: string;
  };
  willChange?: boolean;
  className?: string;
}

const NumberFlow: React.FC<NumberFlowProps> = ({
  value,
  format = {},
  formatter = (val) => val,
  transformTiming: _transformTiming = {},
  willChange: _willChange = false,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formatValue = (val: number) => {
    try {
      if (format.style === "currency") {
        const currency = format.currency || "INR";
        const locale =
          format.locale || (currency === "INR" ? "en-IN" : "en-US");

        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          minimumFractionDigits: format.minimumFractionDigits ?? 0,
          maximumFractionDigits: format.maximumFractionDigits ?? 0,
        }).format(val);
      }
      return val.toString();
    } catch (error) {
      // Fallback for currency formatting
      if (format.style === "currency") {
        const currency = format.currency || "INR";
        const symbol = currency === "INR" ? "₹" : "$";
        return `${symbol}${val.toLocaleString()}`;
      }
      return val.toString();
    }
  };

  const formattedValue = formatter(formatValue(displayValue));

  return <span className={className}>{formattedValue}</span>;
};

export default NumberFlow;
