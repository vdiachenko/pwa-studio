import { Component, createElement } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import { getCartDetails } from 'src/actions';
import classify from 'src/classify';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import ProductList from './productList';
import Trigger from './trigger';
import defaultClasses from './miniCart.css';

class MiniCart extends Component {
    static propTypes = {
        classes: shape({
            checkout: string,
            cta: string,
            header: string,
            root: string,
            root_open: string,
            subtotalLabel: string,
            subtotalValue: string,
            summary: string,
            title: string,
            totals: string
        })
    };

    constructor(...args) {
        super(...args);
        this.props.getCartDetails();
    }

    render() {
        if (this.props.loading) return <div>Fetching Data</div>;
        const { classes, cart, cartCurrencyCode, isOpen } = this.props;
        const className = isOpen ? classes.root_open : classes.root;
        const iconDimensions = { height: 16, width: 16 };

        return (
            <aside className={className}>
                <div className={classes.header}>
                    <h2 className={classes.title}>
                        <span>Shopping Cart</span>
                    </h2>
                    <Trigger>
                        <Icon name="x" />
                    </Trigger>
                </div>
                {cart.items ? (
                    <ProductList
                        currencyCode={cartCurrencyCode}
                        items={cart.items}
                    />
                ) : null}
                <div className={classes.summary}>
                    <dl className={classes.totals}>
                        <dt className={classes.subtotalLabel}>
                            <span>{`Subtotal${
                                cart.items_qty
                                    ? ` (${cart.items_qty} Items)`
                                    : '...'
                            }`}</span>
                        </dt>
                        {cart.subtotal ? (
                            <dd className={classes.subtotalValue}>
                                <span>Subtotal (${cart.items_qty} Items)</span>
                                <Price
                                    currencyCode={cartCurrencyCode}
                                    value={cart.subtotal}
                                />
                            </dd>
                        ) : null}
                    </dl>
                </div>
                <div className={classes.cta}>
                    <Button>
                        <Icon name="lock" attrs={iconDimensions} />
                        <span>Checkout</span>
                    </Button>
                </div>
            </aside>
        );
    }
}

export default compose(
    classify(defaultClasses),
    connect(
        ({ app: { cart = {}, lastItemAdded, gettingCart, imagesBySku } }) => {
            const loading = gettingCart;
            const { currency } = cart;
            const cartCurrencyCode = currency && currency.quote_currency_code;
            const itemsWithImages =
                cart.items &&
                cart.items.map(item => ({
                    ...item,
                    image: item.image || imagesBySku[item.sku] || ''
                }));
            return {
                cart: {
                    ...cart,
                    items: itemsWithImages
                },
                lastItemAdded,
                cartCurrencyCode,
                loading
            };
        },
        {
            getCartDetails
        }
    )
)(MiniCart);
