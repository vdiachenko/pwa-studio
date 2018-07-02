import * as A from 'src/actions/actionNames';
// Since initialState builds by calling a side effect (calling localStorage),
// avoid side effects on module load by putting initialState in a function.
const getInitialState = () => ({
    drawer: null,
    overlay: false,
    pending: {}
});

const reducer = (state = getInitialState(), { error, payload, type }) => {
    switch (type) {
        case A.PROMISE_PENDING: {
            switch (payload.action.type) {
                case A.ADD_ITEM_TO_CART:
                case A.GET_CART_DETAILS:
                    return {
                        ...state,
                        imagesBySku: payload.action.meta.imagesBySku,
                        pending: {
                            ...state.pending,
                            [payload.action.type]: true
                        }
                    };
            }
            return {
                ...state,
                pending: {
                    ...state.pending,
                    [payload.action.type]: true
                }
            };
        }
        case A.PROMISE_DONE: {
            return {
                ...state,
                pending: {
                    ...state.pending,
                    [payload.action.type]: false
                }
            };
        }
        case A.TOGGLE_DRAWER: {
            return {
                ...state,
                drawer: payload,
                overlay: !!payload
            };
        }
        case A.GET_CART_DETAILS: {
            return {
                ...state,
                showError: error,
                gettingCart: false,
                cart: payload
            };
        }
        case A.ADD_ITEM_TO_CART: {
            return {
                ...state,
                showError: error,
                addingToCart: false,
                lastItemAdded: payload
            };
        }
        default: {
            return state;
        }
    }
};

const selectAppState = ({ app }) => ({ app });

export { reducer as default, selectAppState };
