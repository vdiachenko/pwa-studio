import * as A from 'src/actions/actionNames';
// const IMAGES_BY_SKU = 'M2imagesBySku';
// Since initialState builds by calling a side effect (calling localStorage),
// avoid side effects on module load by putting initialState in a function.
const getInitialState = () => ({
    drawer: null,
    overlay: false,
    pending: {}
    // imagesBySku: JSON.parse(localStorage.getItem(IMAGES_BY_SKU)) || {}
});

const reducer = (state = getInitialState(), { error, payload, type, meta }) => {
    switch (type) {
        case A.PROMISE_PENDING: {
            return {
                ...state,
                pending: {
                    ...pending,
                    [payload.action.type]: true
                }
            };
        }
        case A.PROMISE_DONE: {
            return {
                ...state,
                pending: {
                    ...pending,
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
            // cart items don't have images in the REST API;
            // this is the most efficient way to manage that,
            // but it should go in a data layer
            const { imagesBySku } = state;
            const {
                item: { sku },
                cartImage
            } = meta;
            if (sku && cartImage) {
                imagesBySku[sku] = cartImage;
            }
            return {
                ...state,
                imagesBySku,
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
