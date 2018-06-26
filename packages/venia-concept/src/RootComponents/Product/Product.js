import { Component, createElement } from 'react';
import { shape, number, arrayOf, string } from 'prop-types';

import classify from 'src/classify';
import getUrlKey from 'src/util/getUrlKey';
import Page from 'src/components/Page';
import Carousel from 'src/components/ProductImageCarousel';
import Options from 'src/components/ProductOptions';
import Quantity from 'src/components/ProductQuantity';
import RichText from 'src/components/RichText';
import Currency from 'src/components/Currency';
import defaultClasses from './product.css';

import { mediaGalleryEntry, price } from 'src/shared/propShapes'

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const productDetailQuery = gql`
query productDetail($sku: String, $urlKey: String) {
  productDetail: products(filter: { sku: {eq: $sku}, or: {url_key: {eq: $urlKey }}}, pageSize: 1, currentPage: 1) {
    total_count
    items {
      id
      sku
      name
      price {
        regularPrice {
          amount {
            currency
            value
          }
        }
      }
      image
      image_label
      description
      short_description
      media_gallery_entries {
        id
        media_type
        label
        position
        disabled
        file
      }
      canonical_url
    }
  }
}`

class Product extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        data: shape({
            productDetail: shape({
                total_count: number,
                items: arrayOf(shape({
                    id: number,
                    sku: string.isRequired,
                    price: shape({
                        regularPrice: price.isRequired
                    }).isRequired,
                    image: string,
                    image_label: string,
                    media_gallery_entries: arrayOf(mediaGalleryEntry),
                    description: string,
                    short_description: string,
                    canonical_url: string
                })).isRequired
            }).isRequired
        })
    };

    render() {
        const { classes, data } = this.props;

        return (
            <Page>
                <Query query={productDetailQuery} variables={{ urlKey: getUrlKey() }}>
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <div>Fetching Data</div>;

                    const product = data.productDetail.items[0];
                    const { regularPrice } = product.price;

                return (
                    <article className={classes.root}>
                        <section className={classes.title}>
                            <h1 className={classes.productName}>
                                <span>{product.name}</span>
                            </h1>
                            <p className={classes.productPrice}>
                                <Currency {...regularPrice.amount} />
                            </p>
                        </section>
                        <section className={classes.imageCarousel}>
                            <Carousel images={product.media_gallery_entries} />
                        </section>
                        <section className={classes.actions}>
                            <button className={classes.action}>
                                <span>Add to Wishlist</span>
                            </button>
                        </section>
                        <section className={classes.quantity}>
                            <h2 className={classes.quantityTitle}>
                                <span>Quantity</span>
                            </h2>
                            <Quantity />
                        </section>
                        <section className={classes.cartActions}>
                            <button className={classes.addToCart}>
                                <span>Add to Cart</span>
                            </button>
                        </section>
                        <section className={classes.description}>
                            <h2 className={classes.descriptionTitle}>
                                <span>Product Description</span>
                            </h2>
                            <RichText content={product.description} />
                        </section>
                        <section className={classes.details}>
                            <h2 className={classes.detailsTitle}>
                                <span>SKU</span>
                            </h2>
                            <strong>{product.sku}</strong>
                        </section>
                    </article>
                )}}
            </Query>
        </Page>
        );
    }
}

export default classify(defaultClasses)(Product);
