
import React from "react";
import { Typography, Box } from "@mui/material";

const Result = ({ data }) => {
  const { homeValue, loanAmount, loanTerm, interestRate } = data;

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const principal = loanAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyInterestRate === 0) {
      return principal / numberOfPayments;
    }

    return (
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    );
  };

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <Box>
      <Typography variant="h6">Monthly Payment</Typography>
      <Typography variant="h4" color="primary">
        ₹{monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </Typography>
    </Box>
  );
};

export default Result;