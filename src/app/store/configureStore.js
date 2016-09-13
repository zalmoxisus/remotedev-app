import { createStore, compose, applyMiddleware } from 'redux';
import api from '../middlewares/api';
import persist from '../middlewares/persist';
import rootReducer from '../reducers';

export default function configureStore(preloadedState) {
  let enhancer;
  const middlewares = applyMiddleware(api, persist());
  if (process.env.NODE_ENV === 'production') {
    enhancer = middlewares;
  } else {
    enhancer = compose(
      middlewares,
      window.devToolsExtension ? window.devToolsExtension() : noop => noop
    );
  }
  const store = createStore(rootReducer, preloadedState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
