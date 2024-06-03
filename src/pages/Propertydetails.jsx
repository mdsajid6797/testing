import React from 'react';
import {
    getActiveIncome,
    getBankRow,
    getCredential,
    getCryptoasset,
    getInvestment,
    getLifeInsurance,
    getRealEstateContent,
    getToken,
    getVehicle,
    getjewelery,
  } from "../services/user-service";
import { useState } from 'react';
import { useEffect } from 'react';
import { getSingleRealEstate } from '../services/RealEstate-service';
import { getSingleBank } from '../services/bank-service';
import { getSingleInvestment } from '../services/investment-service';
import { getSingleCryptoAssest } from '../services/CryptoService';
import { getSinglejewelry } from '../services/JewelryService';
import { getSingleVehicle } from '../services/VehicleService';
import { getSingleIncome } from '../services/IncomeService';
export default function Propertydetails({property,Id}) {


    const [properti,setProperty]=useState({});
    const [name,setName]=useState("");
    let token = "Bearer " + getToken();

    const getData=()=>{
        switch (property) {
            case "realEstate":
              getSingleRealEstate(token,Id)
                .then((res) => {

                  setProperty(res);
                  setName(res.realEstate.estPropertyVal)

                })
                .catch((err) => {});
              break;
            case "banks":
              getSingleBank(token,Id)
                .then((res) => {

                  setProperty(res);
                  setName(res.bank.bankName);
                })
                .catch((err) => {});
              break;
            case "investment":
              getSingleInvestment(token,Id)
                .then((res) => {
    
                  setProperty(res);
                  setName(res.investment.nameOfTheInvestment);
                })
                .catch((err) => {});
              break;
            case "crypto":
              getSingleCryptoAssest(token,Id)
                .then((res) => {
            
                  setProperty(res);
                  setName(res.cryptoAssest.coin);
                })
                .catch((err) => {});
              break;
            case "jewelry":
              getSinglejewelry(token,Id)
                .then((res) => {
                    setProperty(res);
                    setName(res.jewelry.jewelryName);
                 
                })
                .catch((err) => {});
              break;
            case "insurance":
              getLifeInsurance(token,Id)
                .then((res) => {
          
                  setProperty(res);
                  setName(res.details);
                })
                .catch((err) => {});
              break;
            case "vehicle":
              getSingleVehicle(token,Id)
                .then((res) => {
             
                  setProperty(res);
                  setName(res.vehicle.make);
                })
                .catch((err) => {});
              break;
            case "credentials":
              getCredential(token,Id)
                .then((res) => {
                
                  setProperty(res);
                  setName(res.nonFinancialAccount);
                })
                .catch((err) => {});
              break;
            case "income":
              getSingleIncome(token,Id)
                .then((res) => {
          
                  setProperty(res);
                  setName(res.income.businessSource);
                })
                .catch((err) => {});
              break;
            default:
          }

    }

    useEffect(()=>{
        getData();
    },[]);
    
   




return (
    <div>{name}</div>
  )
}
