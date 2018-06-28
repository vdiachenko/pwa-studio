import restRequest from './restRequest';

export default async function createGuestCart() {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Creating a guest cart over API...');
    }
    const cartId = await restRequest({
        method: 'POST',
        path: 'guest-carts'
    });
    if (process.env.NODE_ENV !== 'production') {
        console.log('New cart ID', cartId);
    }
    return cartId;
}
