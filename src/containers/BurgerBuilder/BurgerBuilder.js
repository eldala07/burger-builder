import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';

import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {

  state = {
    purchasing: false,
  };

  componentDidMount() {
    this.props.onInitIngredients()
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map(igKey => ingredients[igKey])
      .reduce((sum, el) => {
        return sum +el;
      }, 0);
    return sum > 0;
  };

  purchaseHandler = () => {
    this.setState({purchasing: true});
  };

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  };

  purchaseContinueHandler = () => {
    this.props.onInitPurchased();
    this.props.history.push('/checkout');
  };

  render() {
    const disabledInfo = {
      ...this.props.ings
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }
    let burger = this.props.error ? <p>Ingredients can't be loaded...</p>: <Spinner />;
    if (this.props.ings) {
      burger = (
        <Auxiliary>
          <Burger ingredients={this.props.ings}/>
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            price={this.props.price}/>
          {/*Here, we put the () for updatePurchaseState because we want to execute it at rendering*/}
        </Auxiliary>
      );
      orderSummary = <OrderSummary
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinueHandler}
        ingredients={this.props.ings}
        price={this.props.price}/>;
    }
    return (
      <Auxiliary>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Auxiliary>
    );
  }
}

// With this redux function
// we access the redux state and take
// what we are interested in
const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error
  };
};

// With this redux function
// we access the dispatch function from redux
// and we can use it to dispatch actions
// after also importing the action types
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchased: () => dispatch(actions.purchaseInit())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));