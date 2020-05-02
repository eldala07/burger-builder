import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axios-orders';

import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from '../../store/actions/index';

// We should export it here also to be able to test it without redux
// which is given in the default export
const BurgerBuilder = props =>  {

  const [purchasing, setPurchasing] = useState(false);

  // useDispatch and useSelector are used to replace connect
  // but this is not mandatory
  const dispatch = useDispatch();

  const ings = useSelector(state => state.burgerBuilder.ingredients);
  const price = useSelector(state => state.burgerBuilder.totalPrice);
  const error = useSelector(state => state.burgerBuilder.error);
  const isAuthenticated = useSelector(state => state.auth.token !== null);

  const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
  const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
  const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), []);
  const onInitPurchased = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map(igKey => ingredients[igKey])
      .reduce((sum, el) => {
        return sum +el;
      }, 0);
    return sum > 0;
  };

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      // to path where to user is redirected after login
      onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    onInitPurchased();
    props.history.push('/checkout');
  };

  const disabledInfo = {
    ...ings
  };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }
  let orderSummary = null;
  let burger = error ? <p>Ingredients can't be loaded...</p>: <Spinner />;

  if (ings) {
    burger = (
      <Auxiliary>
        <Burger ingredients={ings}/>
        <BuildControls
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientRemoved}
          disabled={disabledInfo}
          isAuth={isAuthenticated}
          purchasable={updatePurchaseState(ings)}
          ordered={purchaseHandler}
          price={price}/>
        {/*Here, we put the () for updatePurchaseState because we want to execute it at rendering*/}
      </Auxiliary>
    );
    orderSummary = <OrderSummary
      purchaseCanceled={purchaseCancelHandler}
      purchaseContinue={purchaseContinueHandler}
      ingredients={ings}
      price={price}/>;
  }
  return (
    <Auxiliary>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Auxiliary>
  );
};

// With this redux function
// we access the redux state and take
// what we are interested in
// EDIT: this has been replaced with the useSelector hook
// const mapStateToProps = state => {
//   return {
//     ings: state.burgerBuilder.ingredients,
//     price: state.burgerBuilder.totalPrice,
//     error: state.burgerBuilder.error,
//     isAuthenticated: state.auth.token !== null
//   };
// };

// With this redux function
// we access the dispatch function from redux
// and we can use it to dispatch actions
// after also importing the action types
// EDIT: this has been replaced with the useDispatch hook
// const mapDispatchToProps = dispatch => {
//   return {
//     onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
//     onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
//     onInitIngredients: () => dispatch(actions.initIngredients()),
//     onInitPurchased: () => dispatch(actions.purchaseInit()),
//     onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
//   };
// };

export default withErrorHandler(BurgerBuilder, axios);