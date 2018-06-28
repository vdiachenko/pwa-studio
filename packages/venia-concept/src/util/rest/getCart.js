import restRequest from './restRequest';

export default async function getCart(cartId) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Getting cart. First getting cart ID...');
    }

    const cart = await restRequest({
        method: 'GET',
        path: `guest-carts/${cartId}`
    });

    if (process.env.NODE_ENV !== 'production') {
        console.log('Cart retrieved', cart);
    }
    return cart;
}
