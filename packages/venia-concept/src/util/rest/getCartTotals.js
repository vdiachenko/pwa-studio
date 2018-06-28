import restRequest from './restRequest';

export default async function getCartTotals(cartId) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Getting cart totals. for cart Id ${cartId}...`);
    }

    const totals = await restRequest({
        method: 'GET',
        path: `guest-carts/${cartId}/totals`
    });

    if (process.env.NODE_ENV !== 'production') {
        console.log('Cart totals retrieved', totals);
    }

    return totals;
}
