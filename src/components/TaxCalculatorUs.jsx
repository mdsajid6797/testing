import React, { useState } from 'react';
import "./../css/TaxCalculator.css";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@mui/material';
import { Button } from 'reactstrap';
const stateTaxRates = {
    "Alabama": 0.41,
    "Alaska": 0.97,
    "Arizona": 0.39,
    "Arkansas": 0.53,
    "California": 0.66,
    "Colorado": 0.40,
    "Connecticut": 1.57,
    "Delaware": 0.48,
    "District of Columbia": 0.57,
    "Florida": 0.67,
    "Georgia": 0.70,
    "Hawaii": 0.30,
    "Idaho": 0.46,
    "Illinois": 1.78,
    "Indiana": 0.74,
    "Iowa": 1.25,
    "Kansas": 1.15,
    "Kentucky": 0.60,
    "Louisiana": 0.53,
    "Maine": 0.89,
    "Maryland": 0.76,
    "Massachusetts": 0.94,
    "Michigan": 1.06,
    "Minnesota": 0.90,
    "Mississippi": 0.55,
    "Missouri": 0.82,
    "Montana": 0.65,
    "Nebraska": 1.36,
    "Nevada": 0.44,
    "New Hampshire": 1.28,
    "New Jersey": 1.79,
    "New Mexico": 0.60,
    "New York": 1.12,
    "North Carolina": 0.80,
    "North Dakota": 1.00,
    "Ohio": 1.18,
    "Oklahoma": 0.90,
    "Oregon": 0.93,
    "Pennsylvania": 0.76,
    "Rhode Island": 1.56,
    "South Carolina": 0.56,
    "South Dakota": 0.64,
    "Tennessee": 0.66,
    "Texas": 1.17,
    "Utah": 0.58,
    "Vermont": 0.98,
    "Virginia": 0.82,
    "Washington": 0.94,
    "West Virginia": 0.59,
    "Wisconsin": 1.10,
    "Wyoming": 0.61,
};
function PropertyTaxCalculatorPopup({ onClose }) {
    const [state, setState] = useState(Object.keys(stateTaxRates)[0]);
    const [customStateTaxRates, setCustomStateTaxRates] = useState('');
    const [assessedValue, setAssessedValue] = useState(0);
    const [propertyTax, setPropertyTax] = useState(0);
    const [isCopied, setIsCopied] = useState(false);

    const calculatePropertyTax = () => {
        const taxRate = customStateTaxRates ? parseFloat(customStateTaxRates) : stateTaxRates[state];
        const propertyTax = (assessedValue * taxRate) / 100;
        setPropertyTax(propertyTax);
    };

    const handleCopyClick = () => {
        const propertyTaxValue = document.getElementById('propertyTaxValue');
        if (propertyTaxValue) {
            const range = document.createRange();
            range.selectNode(propertyTaxValue);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        }
    };

    const clearInputs = () => {
        setCustomStateTaxRates('');
        setAssessedValue(0);
    };

    return (
        <div className=''>


            <div className="taxback">
                <div className="popup_content_cal">

                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%", marginBottom: "20px" }}>
                        <span style={{ color: "red" }}>It is not fully accurate now.!!!</span>
                        <span style={{ color: "red" }}>We are currently working on it.</span>
                    </div>

                    <div className='cal_heading_base'>
                        <span className="cal_close_btn" onClick={onClose}>
                            <div className="cal_close_btn_icon">
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        </span>
                        <h1 className='cal_heading'>Property Tax Calculator</h1>
                    </div>
                    <div className='cal_main_basepage '>
                        <div className='cal_input_box'>
                            <label>Select State</label>
                            <select value={state} onChange={(e) => setState(e.target.value)}>
                                {Object.keys(stateTaxRates).map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='cal_input_box'>
                            <label>Custom Property Tax Rate</label>
                            <input
                                type="number"
                                placeholder={`Property Tax Rate for '${state}' is ${stateTaxRates[state]}%`}
                                value={customStateTaxRates}
                                onChange={(e) => setCustomStateTaxRates(e.target.value)}
                            />
                        </div>
                        <div className='cal_input_box'>
                            <label>Assessed Value</label>
                            <input
                                type="number"
                                placeholder="Enter Assessed Value"
                                // value={assessedValue}
                                onChange={(e) => setAssessedValue(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className='cal_buttons'>
                            <div>
                                <Button
                                    className='cal_reset_btn'
                                    type="reset"
                                    onClick={clearInputs}
                                    outline
                                >
                                    Clear
                                </Button>
                            </div>
                            <div className='cal_calculate_btn'>
                                <a onClick={calculatePropertyTax}>Calculate Tax</a>
                            </div>
                        </div>

                        <div className='cal_result_value'>
                            <label>Approx Property Tax is $:</label>
                            <Tooltip title="Click to copy">
                                <span
                                    id="propertyTaxValue"
                                    onClick={handleCopyClick}
                                    style={{ cursor: 'pointer', color: 'green' }}
                                >
                                    {propertyTax.toFixed(3)}
                                </span>
                            </Tooltip>
                            {isCopied && <span style={{ marginLeft: '10px', color: 'green' }}>Copied</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyTaxCalculatorPopup;



