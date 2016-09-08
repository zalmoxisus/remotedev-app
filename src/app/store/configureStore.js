import { createStore, compose, applyMiddleware } from 'redux';
import api from '../middleware/api';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let enhancer;
  const middlewares = applyMiddleware(api);
  if (process.env.NODE_ENV === 'production') {
    enhancer = middlewares;
  } else {
    enhancer = compose(
      middlewares,
      window.devToolsExtension && window.devToolsExtension()
    );
  }
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
