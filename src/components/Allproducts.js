import React, { Fragment, useEffect } from 'react';
import backgroundImage from './background-5.jpeg';
import ProductItem from './ProductItem';
import { allproducts } from './actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

function Allproducts() {
    const [x, setx] = useState("");
    useEffect(() => {
        if (localStorage.getItem("width") !== null) {
            setx(localStorage.getItem("width"));
        } else {
            setx(window.innerWidth);
        }
    }, []);
    const [categ, setcateg] = useState(""); // Initial range values
    const [range, setRange] = useState([0, 90000]); // Initial range values
    const [pagenum, setPagenum] = useState("");
    const dispatch = useDispatch();
    const params = useParams();
    useEffect(() => {
        dispatch(allproducts(params.keyword, pagenum, range[0], range[1], categ));
    }, [dispatch, pagenum, params, categ, range]);

    const { products, resultperpage, productcount } = useSelector((state) => state.products);
    const containerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start', // Align items at the start of the container
        position: 'relative',
        width: '90%',
        margin: 'auto',
        marginRight: '100px',
        marginTop: '-180px', // Adjusting the top margin to move the product items slightly upward
        padding: '20px',
        borderRadius: '10px'
    };

    const pageStyle = {
        backgroundColor: "#9DE2FF",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        minHeight: x >= 1080 ? '1200px' : '3000px', // Adjusted height based on window width
        minWidth: x >= 1080 ? '1540px' : '1540px',
        height: "auto",
        width: "auto",
    };
    let numofpages = 0;
    if (products) {
        numofpages = Math.ceil(productcount / resultperpage);
    }

    const handlePageChange = (event, p) => {
        setPagenum(p);
    };

    const handleChange = (event, newValue) => {
        setRange(newValue);
    };

    const onClickcateg = (e) => {
        setcateg(e.target.innerText);

    }

    return (
        <Fragment>
            <div style={pageStyle}>
                <h3 style={{ fontFamily: "revert", position: "absolute", left: '40%', color: "black", textAlign: "center", fontSize: x >= 1080 ? '60px' : '80px', marginTop: x >= 1080 ? '80px' : '120px', whiteSpace: "nowrap", paddingBottom :  x >= 1080 ? null : '50px'  }}>All Products</h3>
                <hr style={{ position: "absolute", top: "140px", borderWidth: "2px", marginLeft: "300px", marginRight: "300px", zIndex: 2 }} />
                <div style={{ width: 250, position: "relative", top: "200px", left: "50px", zIndex: 4 }}>
                    <Typography id="range-slider" gutterBottom style={{ color: "#333", marginBottom: "5px", fontSize: x >= 1080 ? '20px' : '40px', fontWeight: "bold", background: 'rgba(255, 255, 255, 0.7)', padding: '10px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.9)' }}>
                        Amount <i className="fa-solid fa-filter"></i>
                    </Typography>
                    <Slider
                        value={range}
                        onChange={handleChange}
                        aria-labelledby="range-slider"
                        min={0}
                        max={50000}
                        step={1}
                        marks={[{ value: 0, label: <span style={{ fontSize: x >= 1080 ? null : '15px' }}>₹0</span> }, { value: 50000, label: <span style={{ fontSize: x >= 1080 ? null : '15px' }}>₹50000</span> }]}
                        valueLabelDisplay="auto"
                        sx={{
                            color: '#0d47a1', // Darker primary color
                            '& .MuiSlider-rail': {
                                backgroundColor: '#666', // Darker rail color
                            },
                            '& .MuiSlider-track': {
                                backgroundColor: 'rgba(33, 150, 243, 0.7)', // Darker track color
                            },
                            '& .MuiSlider-thumb': {
                                backgroundColor: '#0d47a1', // Darker thumb color
                            },
                        }}
                        style={{ padding: '10px' }}
                    />

                    <Typography id="range-slider" gutterBottom style={{ color: "#333", marginBottom: "5px", fontSize: x >= 1080 ? '20px' : '30px', fontWeight: "bold", marginTop: "15px", background: 'rgba(255, 255, 255, 0.7)', padding: '10px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.9)' }}>
                        <h5 style={{ fontSize: x >= 1080 ? '30px' : '40px', fontWeight: "bold" }}> <i className="fa-solid fa-list"></i>  Categories </h5>
                        <ul>
                            <li style={{ cursor: 'pointer' }} onMouseOver={(e) => e.target.style.color = '#049EDF'} onMouseOut={(e) => e.target.style.color = 'black'} onClick={onClickcateg}>Machine</li>
                            <li style={{ cursor: 'pointer' }} onMouseOver={(e) => e.target.style.color = '#049EDF'} onMouseOut={(e) => e.target.style.color = 'black'} onClick={onClickcateg}>Device</li>
                            <li style={{ cursor: 'pointer' }} onMouseOver={(e) => e.target.style.color = '#049EDF'} onMouseOut={(e) => e.target.style.color = 'black'} onClick={onClickcateg}>Accessories</li>
                            <li style={{ cursor: 'pointer' }} onMouseOver={(e) => e.target.style.color = '#049EDF'} onMouseOut={(e) => e.target.style.color = 'black'} onClick={onClickcateg}>Top</li>
                            <li style={{ cursor: 'pointer' }} onMouseOver={(e) => e.target.style.color = '#049EDF'} onMouseOut={(e) => e.target.style.color = 'black'} onClick={onClickcateg}>Bottom</li>
                            <li style={{ cursor: 'pointer' }} onMouseOver={(e) => e.target.style.color = '#049EDF'} onMouseOut={(e) => e.target.style.color = 'black'} onClick={onClickcateg}>Footwear</li>
                        </ul>
                    </Typography>
                </div>

                <div style={containerStyle}>
                    {products && products.map((product) => (
                        <ProductItem key={product} product={product} style={{ background: 'rgba(255, 255, 255, 1)' }} />
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {numofpages > 1 ?
                        <div style={{ marginBottom: "20px" }}>
                            <Pagination count={numofpages} color="primary" size="large" onChange={handlePageChange} />
                        </div>
                        : null
                    }
                </div>
            </div>
        </Fragment >
    );
}

export default Allproducts;
