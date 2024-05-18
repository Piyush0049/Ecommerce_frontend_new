import React, { useState, useEffect } from 'react';
import backimage from "./snapedit_1711040704089.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { createorder } from './actions/orderactions';

const Payment = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const totalprice = Number(localStorage.getItem("totalprice"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const totalmoney = totalprice;
  const { cartitems } = useSelector((state) => state.cart);
  const shippingdet = JSON.parse(localStorage.getItem("shippingdetails"));

  const userAddress = {
    line1: shippingdet.userDetails.address,
    line2: shippingdet.userDetails.address,
    city: JSON.parse(localStorage.getItem("shippingdetails")).selectedCity.label,
    state: JSON.parse(localStorage.getItem("shippingdetails")).selectedState.value,
    country: "US",
    postal_code: "125001",
  };

  const orderdis = {
    shippinginfo: {
      address: shippingdet.userDetails.address,
      city: JSON.parse(localStorage.getItem("shippingdetails")).selectedCity.label,
      state: JSON.parse(localStorage.getItem("shippingdetails")).selectedState.value,
      country: "US",
      pincode: 125001,
      phoneno: shippingdet.userDetails.phone,
    },
    orderitems: cartitems,
    paymentInfo: {
      id: "",
      status: "succeeded"
    },
    itemsPrice: (totalprice * 100) / 118,
    taxPrice: (totalprice * 18) / 118,
    shippingPrice: 0,
    totalPrice: totalmoney,
    orderStatus: "pending"
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to complete the payment?")) {
      setIsProcessing(true);

      try {
        const config = {
          "Content-Type": "application/json"
        };
        const { data } = await axios.post("https://snap-n-shop-fullmernstack-ecommerce.onrender.com/api/v1/payment/process", {
          description: "Description of the export transaction goes here",
          amount: Math.round(totalprice * 100),
        }, config, { withCredentials: true });

        const clientSecret = data.client_secret;
        // Replace the Stripe logic with your payment processing logic
        // Here, you would use the cardNumber, cardExpiry, and cardCvc values

        // Simulate successful payment for demonstration purposes
        const result = {
          paymentIntent: {
            status: "succeeded",
            id: "pi_fake_12345"
          }
        };

        if (result.paymentIntent.status === "succeeded") {
          const paymentId = result.paymentIntent.id;
          orderdis.paymentInfo.id = paymentId;
          dispatch(createorder(orderdis));
          navigate("/success");
        } else {
          setPaymentError("There's some issue while processing payment");
        }
      } catch (error) {
        console.error('Error:', error.message);
        setPaymentError(error.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: windowWidth >= 692 ? "60px" : '110px', paddingBottom: windowWidth >= 692 ? null : '70px', }}>
        <Link to="/mycart" style={{ fontSize: windowWidth >= 692 ? '25px' : '35px', color: "green", textDecoration: "none" }}>Place Order <i className="fa-solid fa-cart-shopping"></i></Link>
        <hr style={styles.hr2} />
        <Link style={{ fontSize: windowWidth >= 692 ? '25px' : '35px', color: "green", textDecoration: "none" }}>Confirm Order <i className="fa-solid fa-check"></i></Link>
        <hr style={styles.hr2} />
        <Link style={{ fontSize: windowWidth >= 692 ? '25px' : '35px', color: "red", textDecoration: "none" }}>Payment <i className="fa-solid fa-circle-check"></i></Link>
      </div>
      <div style={{ minHeight: "500px", height: "auto", opacity: 0.9, paddingTop: '80px', display: 'flex', justifyContent: 'center' }}>
        <div style={styles.cardForm}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <div>
              <h1 style={{ marginTop: '20px', textAlign: 'center', fontSize: windowWidth >= 692 ? "45px" : '70px', }}>Card Info.</h1>
              <b><hr style={{ width: "200px", backgroundColor: "black", position: "relative", bottom: "14px" }} /></b>
            </div>
          </div>
          <form onSubmit={handlePayment} style={{ justifyContent: "center", position: "relative", top: "40px" }}>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Card Number"
              style={styles.input}
            />
            <input
              type="text"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
              placeholder="Expiry Date (MM/YY)"
              style={styles.input}
            />
            <input
              type="text"
              value={cardCvc}
              onChange={(e) => setCardCvc(e.target.value)}
              placeholder="CVC"
              style={styles.input}
            />
            {paymentError && <div style={{ color: 'red' }}>{paymentError}</div>}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
              <button type="submit" className="btn btn-warning" style={{ padding: "10px", paddingInline: "40px", fontSize: windowWidth >= 692 ? "20px" : '55px', position: "relative", top: "80px" }} disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Pay ₹${totalprice}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: window.innerWidth >= 692 ? '1000px' : '3000px', // Adjusted height based on window width
    minWidth: window.innerWidth >= 692 ? '1540px' : '1540px',
    height: "auto",
    width: "auto",
    alignItems: 'center',
    background: '#f0f0f0',
    backgroundImage: `url(${backimage})`, backgroundSize: 'cover'
  },
  cardForm: {
    width: '500px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    background: '#fff',
  },
  hr2: {
    borderWidth: "2px",
    opacity: 0.6,
    width: "300px",
  },
  input: {
    width: '100%',
    padding: window.innerWidth >= 692 ? '12px' : '24px',
    fontSize: window.innerWidth >= 692 ? '18px' : '36px',
    border: '2px solid #ccc',
    borderRadius: window.innerWidth >= 692 ? '20px' : '40px',
    marginBottom: '20px',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default Payment;
