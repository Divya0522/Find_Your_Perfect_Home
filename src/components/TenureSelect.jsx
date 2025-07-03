import React from "react";
import { Typography, ButtonGroup, Button, Stack } from "@mui/material";

const TenureSelect = ({ data, setData }) => {
  const handleTenureChange = (newTenure) => {
    setData((prevData) => ({
      ...prevData,
      loanTerm: newTenure,
    }));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Loan Tenure</Typography>
      <ButtonGroup
        fullWidth
        variant="outlined"
        aria-label="outlined button group"
        sx={{ flexWrap: "wrap", gap: 1 }} // Add gap and wrap for better spacing
      >
        {[5, 10, 15, 20, 25].map((tenure) => (
          <Button
            key={tenure}
            variant={data.loanTerm === tenure ? "contained" : "outlined"}
            onClick={() => handleTenureChange(tenure)}
            sx={{
              flex: "1 1 auto", // Allow buttons to grow and shrink
              minWidth: "100px", // Set a minimum width for buttons
              margin: "4px", // Add margin for spacing
            }}
          >
            {tenure} years
          </Button>
        ))}
      </ButtonGroup>
    </Stack>
  );
};

export default TenureSelect;