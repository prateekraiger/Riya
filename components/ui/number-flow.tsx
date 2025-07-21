import React, { useState, useEffect } from "react";

interface NumberFlowProps {
  value: number;
  format?: {
    style?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
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
  transformTiming = {},
  willChange = false,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formatValue = (val: number) => {
    try {
      if (format.style === "currency") {
        // Add the dollar sign here
        return (
          "$" +
          val.toFixed(
            format.maximumFractionDigits !== undefined
              ? format.maximumFractionDigits
              : 2
          )
        );
      }
      return val.toString();
    } catch (error) {
      return val.toString();
    }
  };

  const formattedValue = formatter(formatValue(displayValue));

  return <span className={className}>{formattedValue}</span>;
};

export default NumberFlow;
