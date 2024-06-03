import React, { useEffect, useState } from 'react';
import { faArrowTrendUp, faTimes } from '@fortawesome/free-solid-svg-icons'; // Use faTimes for the close (X) icon
import "./../../css/networth-popup.css";
import { Notification } from '../alerting-visitors/notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chart from "chart.js/auto";
import { Pie, Bar, Line } from "react-chartjs-2";
import { cryptoassetsGet, getNetworth, getToken, getUser } from '../../services/user-service';

function Networthpopup({ onClose, networthValue, totalCrypto }) {
    const [NetWorth, setNetWorth] = useState("");
    const fetchNetworth = () => {

        const id = getUser().commonId;

        getNetworth(id)
            .then((response) => {
                setNetWorth(response);
                
            })
            .catch((error) => {
                
            });
    };
    // const [category, setCategory] = useState([]);
    // const getData = () => {
    //     let userId = getUser().id;

    //     let token = "Bearer " + getToken();
    //     cryptoassetsGet(token, userId).then((res) => {
 
    //         setCategory(res);
    //     });

    // };

    useEffect(() => {
        fetchNetworth();
        // getData();
    }, []);


    // Calculate percentages
    const calculatePercentages = () => {
        if (NetWorth) {
            delete NetWorth.TotalNetWorth;
            let assetsToCalculate = { ...NetWorth };

            const totalNetWorth = Object.values(assetsToCalculate).reduce((acc, val) => acc + val, 0);

           

            const assetOrder = ["Bank", "Jewelry", "Crypto", "RealEstate", "Investment", "Vehicles"];

            // Assuming assetsToCalculate is an object containing asset values
            const percentages = assetOrder.map(asset => {
                const value = assetsToCalculate[asset] || 0; // If asset not found, set value to 0
                return ((value / totalNetWorth) * 100).toFixed(2);
            });
            return percentages;
        }

        return [];
    };
    
    const percentages = calculatePercentages();

    const calculatePercentages1 = () => {
        const percentages = [];
    
        if (NetWorth) {
            // Define the desired order for assets
            const assetOrder = ["Bank", "Jewelry", "Crypto", "RealEstate", "Investment", "Vehicles"];
    
            // Delete TotalNetWorth from the NetWorth object
            delete NetWorth.TotalNetWorth;
    
            const totalNetWorth = Object.values(NetWorth).reduce((acc, val) => acc + val, 0);
    
            // Calculate percentages for each asset and store them along with the asset name
            assetOrder.forEach((asset) => {
                if (NetWorth[asset]) {
                    const percentage = ((NetWorth[asset] / totalNetWorth) * 100).toFixed(2);
                    percentages.push({ asset: asset, amount: NetWorth[asset], percentage: percentage });
                }
            });
  
        }
    
        return percentages;
    };
    
    const assetPercentages = calculatePercentages1();

    // assetPercentages.forEach((asset) => {
    // });

    // const highestPercentage = Math.max(...percentages);
    const data = {
        labels: ["Bank", "Jewelry", "Crypto", "RealEstate", "Investment", "Vehicles"],
        datasets: [
            {
                label: "",
                data: percentages,
                backgroundColor: [
                    "#ff8cab",
                    "#ff8c8c",
                    "#ffff8c",
                    "#8eff8c",
                    "#8cf9ff",
                    "#908cff",
                    "#ee8cff",
                ],
                borderWidth: 1,
            },
        ],
    };

   

    const numberWithCommas = (number) => {
        return number.toLocaleString();
      };
    const net = networthValue.replace(/,/g, '');
    const net1 =  parseFloat(net).toFixed(2);
    let net3 = numberWithCommas(net1)


    return (
        <div className="popup">
            <div className="popup-content">
                <div className='networth_popup_page_heading'>
                    <div className='networth_popup_heading_div'>
                        <div className='networth_popup_heading'>Approx Net Worth
                            {/* <FontAwesomeIcon style={{marginLeft:"20px",color:"blue "}} icon={faArrowTrendUp} /> */}
                        </div>
                        <div className='networth_popup_show_networth' style={{letterSpacing:"1px"}}>
                            {/* $ {networthValue.replace(/,/g, '')} */}
                            $ {
                               net3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }


                        </div>
                    </div>

                    <div>
                        <button className="popup_btn" onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
                <div className='networth_page'>
                    <div className='networth_sidebar'>
                        <div className='networth_Sidebar_first'>
                            <h4 style={{ fontWeight: "bold" }}> total earning</h4>
                            <ul className='total_earning'>
                                <li className='total_earning_list'>Bank
                                    <li>$ {NetWorth?.Bank?.toFixed(2)}</li>
                                </li>
                                <li className='total_earning_list'>Jewelry
                                    {/* <li>$ {NetWorth.Jewelry.toFixed(2)}</li>    */}
                                    <li>$ {NetWorth?.Jewelry?.toFixed(2)}</li>

                                </li>
                                <li className='total_earning_list'>Crypto
                                    {/* <li>$ {NetWorth.Jewelry.toFixed(2)}</li>    */}
                                    <li>$ {NetWorth?.Crypto?.toFixed(2)}</li>

                                </li>
                                {/* {totalCrypto === 0 ? (
                                    <li className='total_earning_list'>Crypto
                                        <li>Loading...</li>
                                    </li>
                                ) : (
                                    <li className='total_earning_list'>Crypto
                                        <li>$ {NetWorth.totalCrypto.toFixed(2)}</li>
                                        <li>$ {NetWorth?.totalCrypto?.toFixed(2)}</li>

                                    </li>
                                )} */}
                                <li className='total_earning_list'>Realestate
                                    <li>$ {NetWorth?.RealEstate?.toFixed(2)}</li>
                                </li>
                                {/* <li className='total_earning_list'> Iternational Assets
                                    <li>$ {NetWorth.InternationalAssets}</li>
                                    <li>$ {NetWorth?.InternationalAssets?.toFixed(2)}</li>

                                </li> */}
                                <li className='total_earning_list'>Investment
                                    {/* <li>$ {NetWorth.Investment}</li> */}
                                    <li>$ {NetWorth?.Investment?.toFixed(2)}</li>

                                </li>
                                <li className='total_earning_list'>Vehicles
                                    {/* <li>$ {NetWorth.Vehicles}</li> */}
                                    <li>$ {NetWorth?.Vehicles?.toFixed(2)}</li>


                                </li>
                            </ul>
                        </div>
                        <div className='networth_Sidebar_Chart'>
                            <div style={{ width: 250, display: "flex", flexDirection: "row" }}>
                                <Pie data={data} width={50} height={50} style={{ display: "flex", flexDirection: "row" }} />
                            </div>
                        </div>

                    </div>
                    <div className='networth_chat'>
                        <div className='networth_chat_page'>
                            <h4 style={{ fontWeight: "bold" }}> graph of the networth</h4>
                            <div className="networth_mane_chat" >
                                <div className='networth_barchat' >
                                    <Bar data={data} width={50} height={50} />
                                </div>
                                <div className='networth_linechat' >
                                    <Line data={data} width={50} height={50} />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Networthpopup;
