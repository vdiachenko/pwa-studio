import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './thumbnail.css';
import { grayPlaceholder } from 'src/shared/images';
import { makeProductMediaPath } from 'src/util/makeMediaPath';

class Thumbnail extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    render() {
        const { classes, item } = this.props;

        return (
            <div className={classes.root}>
                <img
                    className={classes.image}
                    src={item.file ? makeProductMediaPath(item.file) : grayPlaceholder}
                    alt={item.label}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(Thumbnail);
