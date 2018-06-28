import * as M2Rest from '../util/rest';
import * as A from 'src/actions/actionNames';

export function getCartId() {
    return {
        type: A.GET_CART_ID,
        payload: M2Rest.getCartId()
    };
}

export function addItemToCart({ cartId, item, quantity }) {
    const media = item.media_gallery_entries || [];
    const cartImage = media.find(image => image.position === 1);
    return {
        type: A.ADD_ITEM_TO_CART,
        payload: M2Rest.postNewCartItem(cartId, item, quantity),
        meta: { item, quantity, cartImage }
    };
}

// supports rolling requests.
// will multicast any outstanding promise. If `forceRefresh` is true,
// it will abort the outstanding Promise and replace it with another.
let lastCartReq;
export function getCartDetails({ cartId, forceRefresh }) {
    if (forceRefresh && lastCartReq) {
        lastCartReq.cancel();
        lastCartReq = null;
    }
    if (!lastCartReq) {
        const cartReqs = [M2Rest.getCart(cartId), M2Rest.getCartTotals(cartId)];
        const cancellers = cartReqs.map(M2.canceller);
        lastCartReq = {
            promise: Promise.all(cartReqs).then(
                ([cart, totals]) => {
                    lastCartReq = null;
                    return {
                        ...cart,
                        totals
                    };
                },
                () => {
                    lastCartReq = null;
                }
            ),
            cancel: () => cancellers.forEach(cancel => cancel())
        };
    }
    return {
        type: A.GET_CART_DETAILS,
        payload: lastCartReq.promise
    };
}

function toggleDrawer(drawerName) {
    return {
        type: A.TOGGLE_DRAWER,
        payload: drawerName
    };
}

export function toggleCart() {
    return toggleDrawer('cart');
}
