import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

// Here we create the action creators
export const addIngredient = (name) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name
  }
};

export const removeIngredient = (name) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: name
  }
};

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients
  }
};

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  };
};

// Asynchronous action creator
// (taking the dispatch given by redux)
export const initIngredients = () => {
  return dispatch => {
    axios.get('/ingredients.json')
      .then(response => {
        dispatch(setIngredients(response.data))
      })
      .catch(error => {
        dispatch(fetchIngredientsFailed())
      });
  }
};
