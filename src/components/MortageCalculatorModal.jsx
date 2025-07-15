
import React, { useState } from "react";
import { Grid, Container, Typography, Button } from "@mui/material";
import SliderSelect from "./SliderSelect";
import TenureSelect from "./TenureSelect";
import Result from "./Result";

const MortgageCalculatorModal = ({ onClose }) => {
  const [data, setData] = useState({
    homeValue: 3000000, // Default home value in rupees (30 Lakhs)
    downPayment: 3000000 * 0.2, // 20% down payment
    loanAmount: 3000000 * 0.8, // 80% loan amount
    loanTerm: 5,
    interestRate: 5,
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Button
          className="close-modal-button"
          onClick={onClose}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          X
        </Button>
        <Typography variant="h4" gutterBottom>
          Mortgage Calculator
        </Typography>
        <Container maxWidth="xl" sx={{ marginTop: 4 }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <SliderSelect data={data} setData={setData} />
              <TenureSelect data={data} setData={setData} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Result data={data} />
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default MortgageCalculatorModal;