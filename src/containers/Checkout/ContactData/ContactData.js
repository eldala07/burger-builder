import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner  from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading: false
  };

  orderHandler = (e) => {
    // to not send a request and reload the page
    e.preventDefault();
    this.setState({loading: true});
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Dimitri Uytterhoeven',
        address: {
          street: 'Teststreet 1',
          zipCode: '41351',
          country: 'Germany'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    };
    // normally totalPrice should be calculated on the server

    axios.post('/orders.json', order)
      .then(response => {
        this.setState({
          loading: false
        });
        this.props.history.push('/');
        console.log(response);
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        console.log(error);
      });
  };

  render() {

    let form = (
      <form onSubmit={this.orderHandler}>
        <input className={classes.Input} type="text" name="name" placeholder="Your Name"/>
        <input className={classes.Input} type="email" name="email" placeholder="Your Mail"/>
        <input className={classes.Input} type="text" name="street" placeholder="Street"/>
        <input className={classes.Input} type="text" name="postal" placeholder="Postal Code"/>
        <Button btnType="Success" type="submit"  >ORDER</Button>
      </form>);
    if (this.state.loading) {
      form = <Spinner />
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    ) ;
  }

}

export default ContactData;