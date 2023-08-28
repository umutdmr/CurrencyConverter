import React, { useState } from 'react';
import { Container, TextInput, Button, Select } from '@mantine/core'
import index from "../styles/index.module.css"
import { fetchData } from '../services/apiService';
import {countries} from '../model/countries'
import Head from 'next/head';
export default function App() {

  let [data] = useState([]);
  const api_url = "https://api.exchangerate-api.com/v4/latest/"

  let [amount, setAmount] = useState('');
  let [convert, setConvert] = useState('');
  let [selectedFrom, setSelectedFrom] = useState('');
  let [selectedTo, setSelectedTo] = useState('');




  async function currencyService(from) {
    try {
      const result = await fetchData(api_url + from);
      return result;      
    } catch (error) {
      console.error(error);
    }
  }

  async function prepareData(from) {

    try {
      data = await currencyService(from);  
      data = data['rates']
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  


  

  const handleSubmit = (e) => {
    e.preventDefault();
    prepareData(selectedFrom).then( () => {

      const res = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => key == selectedTo)
      );
      

      convert = amount * res[selectedTo];
      setConvert(convert)
    }
    )

    
    
  };
  const handleReset = (e) => {
    setAmount('')
    setConvert('')
    setSelectedFrom(null)
    setSelectedTo(null)
  };

  const handleSelectChangeFrom = (value) => {
    setSelectedFrom(value); 
  };

  const handleSelectChangeTo = (value) => {
    setSelectedTo(value); 
  };




  return (
    
    <>
      <Head>
        <title>Currency Converter App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container size="xs">

        <h1>Currency Converter</h1>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div className={index.container}>

            <TextInput
              className={index.input}
              id='amountText'
              label="Amount"
              placeholder="Enter the amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              />
            <Select
              className={index.select}
              label="From"
              placeholder="Pick one"
              value={selectedFrom}
              onChange={handleSelectChangeFrom}
              data={countries}
              required
              />

          </div>
          <div className={index.container}>
            <TextInput
              className={index.input}
              label="Convert"
              placeholder="Result"
              value={convert}
              readOnly
              />
            <Select
              className={index.select}
              label="To"
              placeholder="Pick one"
              value={selectedTo}
              onChange={handleSelectChangeTo}
              data={countries}
              required
              />
          </div>
          <Button
           className={index.button}
           type="submit" 
           variant="filled" 
           color="blue">
            Submit
          </Button>
          <Button
           className={index.button}
           type="reset" 
           variant="filled" 
           color="blue">
            Reset
          </Button>
        </form>
      </Container>
    </>
  );
  
}


