import isPromise from 'is-promise';
/**
 * For any action with a promise as payload, first dispatch a "PENDING" action.
 * This allows for easy loading state.
 *
 * @param {Store} store The store to augment.
 * @returns {Function}
 */

const promisePending = ({ dispatch }) => next => action => {
    const { payload } = action;
    if (isPromise(payload)) {
        dispatch({
            type: 'PROMISE_PENDING',
            payload: { action }
        });

        return action.payload.then(
            result => {
                dispatch({ ...action, payload: result });
                return dispatch({
                    type: 'PROMISE_DONE',
                    payload: { action, result }
                });
            },
            error => {
                dispatch({ ...action, payload: error, error: true });
                dispatch({
                    type: 'PROMISE_DONE',
                    error: true,
                    payload: { action, result: error }
                });
                return Promise.reject(error);
            }
        );
    }
    return next(action);
};

export default promisePending;
