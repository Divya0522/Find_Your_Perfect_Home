
import React from "react";
import { Typography, TextField } from "@mui/material";
import { Stack } from "@mui/system";

const SliderSelect = ({ data, setData }) => {
  const handleChange = (event, key) => {
    const value = parseFloat(event.target.value); // Convert input value to a number
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <Stack spacing={4}>
      <Stack>
        <Typography variant="h6">Home Value</Typography>
        <TextField
          type="number"
          value={data.homeValue}
          onChange={(e) => handleChange(e, "homeValue")}
          inputProps={{ min: 1000000, max: 10000000, step: 100000 }} // 10 Lakhs to 1 Crore
          fullWidth
          variant="outlined"
          placeholder="Enter home value"
          sx={{ marginTop: 1 }}
        />
      </Stack>

      <Stack>
        <Typography variant="h6">Down Payment</Typography>
        <TextField
          type="number"
          value={data.downPayment}
          onChange={(e) => handleChange(e, "downPayment")}
          inputProps={{ min: 0, max: data.homeValue, step: 100000 }} // Up to home value
          fullWidth
          variant="outlined"
          placeholder="Enter down payment"
          sx={{ marginTop: 1 }}
        />
      </Stack>

      <Stack>
        <Typography variant="h6">Loan Amount</Typography>
        <TextField
          type="number"
          value={data.loanAmount}
          onChange={(e) => handleChange(e, "loanAmount")}
          inputProps={{ min: 0, max: data.homeValue - data.downPayment, step: 100000 }} // Up to home value minus down payment
          fullWidth
          variant="outlined"
          placeholder="Enter loan amount"
          sx={{ marginTop: 1 }}
        />
      </Stack>

      <Stack>
        <Typography variant="h6">Interest Rate</Typography>
        <TextField
          type="number"
          value={data.interestRate}
          onChange={(e) => handleChange(e, "interestRate")}
          inputProps={{ min: 2, max: 18, step: 0.5 }} // 2% to 18%
          fullWidth
          variant="outlined"
          placeholder="Enter interest rate"
          sx={{ marginTop: 1 }}
        />
      </Stack>
    </Stack>
  );
};

export default SliderSelect;