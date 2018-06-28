import { applyMiddleware, compose, createStore } from 'redux';
import { exposeSlices } from './enhancers';
import middlewares from './middleware';

const reducer = (state = {}) => state;

const initStore = () =>
    createStore(
        reducer,
        compose(
            applyMiddleware(...middlewares),
            exposeSlices
        )
    );

export default initStore;
