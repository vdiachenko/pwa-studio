import * as M2Rest from '../util/rest';
import * as A from 'src/actions/actionNames';
import BrowserPersistence from 'src/util/simplePersistence';
const storage = new BrowserPersistence();

let imagesBySku = storage.getItem('imagesBySku') || {};

export function makeNewCart() {
    return M2Rest.createGuestCart().then(cartId => {
        return storage.setItem('cartId', cartId, 86400).then(() => cartId);
    });
}

export function getCartId() {
    const cartId = storage.getItem('cartId');
    return cartId ? Promise.resolve(cartId) : makeNewCart();
}

export function addItemToCart({ item, quantity }) {
    // cart items don't have images in the REST API;
    // this is the most efficient way to manage that,
    // but it should go in a data layer
    const media = item.media_gallery_entries || [];
    const cartImage = media.find(image => image.position === 1);
    if (item.sku && cartImage && imagesBySku[item.sku] !== cartImage) {
        imagesBySku[item.sku] = cartImage;
        storage.setItem('imagesBySku', imagesBySku);
    }
    return {
        type: A.ADD_ITEM_TO_CART,
        payload: getCartId().then(cartId =>
            M2Rest.postNewCartItem(cartId, item, quantity)
        ),
        meta: { item, quantity, imagesBySku }
    };
}

// supports rolling requests.
// will multicast any outstanding promise. If `forceRefresh` is true,
// it will abort the outstanding Promise and replace it with another.
let lastCartReq;
export function getCartDetails({ forceRefresh } = {}) {
    if (forceRefresh && lastCartReq) {
        lastCartReq.cancel();
        lastCartReq = null;
    }
    if (!lastCartReq) {
        let cancellers = [];
        const allCartReq = getCartId()
            .then(cartId => {
                const cartReq = M2Rest.getCart(cartId);
                const totalsReq = M2Rest.getCartTotals(cartId);
                cancellers.push(
                    M2Rest.canceller(cartReq),
                    M2Rest.canceller(totalsReq)
                );
                return Promise.all([cartReq, totalsReq]);
            })
            .then(([cart, totals]) => {
                lastCartReq = null;
                return {
                    ...cart,
                    totals
                };
            });

        lastCartReq = {
            promise: allCartReq.catch(e => {
                lastCartReq = null;
                throw e;
            }),
            cancel: () => cancellers.forEach(cancel => cancel())
        };
    }
    return {
        type: A.GET_CART_DETAILS,
        payload: lastCartReq.promise,
        meta: { imagesBySku }
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
