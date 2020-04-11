import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-builder-392f6.firebaseio.com/'
});

export default instance;