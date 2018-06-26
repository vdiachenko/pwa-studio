import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

export default class Currency extends Component {

    static propTypes = {
        locale: PropTypes.string,
        value: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
        tagName: PropTypes.string
    };

    static defaultProps = {
        tagName: 'span'
    };

    guessLocalLanguage() {
        if (!window.navigator) return;
        return window.navigator
        && (navigator.languages && navigator.languages[0])  // HTML5 spec
        || navigator.language                               // HTML5 spec
        || 'en_US';                                         // America!!!
    }


    render() {
        const { tagName: Tag, value, locale, currency, ...attrs } = this.props;
        const formatter = new Intl.NumberFormat(locale || this.guessLocalLanguage(), {
            style: 'currency',
            currency
        });
        return (
            <Tag {...attrs}>
                {formatter.format(value)}
            </Tag>
        );
    }
}
