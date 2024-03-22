import './App.css';
import donateLogo from "./donate_logo.png";
import {useState} from "react";
import RevolutCheckout from "@revolut/checkout";

function App() {
  const [amount, setAmount] = useState(1);
  const [requestedAmount, setRequestedAmount] = useState(0);
  const [pay, setPay] = useState(undefined);

  const cardFieldRequest = async () => {
    const amountForRequest = parseInt(amount.toString() + '00');
    setRequestedAmount(amount);

    const response = await fetch('http://localhost:8000/revolutCardField', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountForRequest })
    });
    const result = await response.json();

    const { createCardField } = await RevolutCheckout(result.token, "sandbox");
    const cardField = createCardField({
      target: document.getElementById("card-field"),
      onSuccess() {
        window.alert("Thank you!");

        const div = document.createElement('div');
        div.classList.add('successful_transaction');
        div.innerHTML = `
<div><b>Successful donation in the amount of ${amount} GBP.</b></div>
<div><b>Transaction ID:</b> ${result.id}</div>
<div><b>Created at:</b> ${result.created_at}</div>`;
        document.querySelector('.transaction_history').appendChild(div);

        setRequestedAmount(0);
      },
      onError(error) {
        window.alert(`Something went wrong. ${error}`);

        const div = document.createElement('div');
        div.classList.add('failed_transaction');
        div.innerHTML = `
<div><b>Failed donation in the amount of ${amount} GBP.</b></div>
<div><b>Transaction ID:</b> ${result.id}</div>
<div><b>Created at:</b> ${result.created_at}</div>
<div><b>Reason:</b> ${error}</div>`;
        document.querySelector('.transaction_history').appendChild(div);
      },
      styles: {
        default: {
          color: "#85C66A",
          "::placeholder": {
            color: "#90BDD4"
          }
        },
        autofilled: {
          color: "#0714a8"
        }
      }
    });

    setPay(cardField);
  }

  const payHandler = async () => {
    const meta = {
      name: "Customer Name",
      email: "customer@example.com",
      phone: "+441234567890",
      cardholderName: "Cardholder Name",
      billingAddress: {
        countryCode: "US",
        region: "CA",
        city: "San Francisco",
        postcode: "94105",
        streetLine1: "123 Market St",
        streetLine2: "Suite 100"
      },
      shippingAddress: {
        countryCode: "US",
        region: "CA",
        city: "San Francisco",
        postcode: "94105",
        streetLine1: "123 Market St",
        streetLine2: "Suite 100"
      }
    };

    pay.submit(meta);
  }

  return (
    <div className="App">
      <div className="container">
        <img src={donateLogo} alt="Donate jar" width="150px"/>
        <form id="amount_form">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="amount_input"
          />
        </form>

        <div className={"card-field_container"}>
          {requestedAmount > 0 &&
            <div className="card-filed_text">Enter your card to send the donation: {requestedAmount} GBP</div>}
          {requestedAmount > 0 && <div id="card-field"></div>}
        </div>

        <div className="buttons">
          <button onClick={cardFieldRequest}>Get new invoice</button>
          {requestedAmount > 0 && <button id="button-submit" onClick={payHandler}>Pay</button>}
        </div>
      </div>

      <div className="transaction_history"></div>
    </div>
  );
}

export default App;
