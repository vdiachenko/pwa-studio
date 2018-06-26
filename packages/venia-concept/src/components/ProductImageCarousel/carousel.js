import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';
import { makeProductMediaPath } from 'src/util/makeMediaPath';
import { mediaGalleryEntry } from 'src/shared/propShapes';
import { grayPlaceholder } from 'src/shared/images';

class Carousel extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            currentImageFile: PropTypes.string,
            root: PropTypes.string
        }),
        images: PropTypes.arrayOf(
            mediaGalleryEntry
        ).isRequired
    };

    render() {
        const { classes, images } = this.props;
        const mainImage = images[0] || {};
        const src = mainImage.file ? makeProductMediaPath(mainImage.file) : grayPlaceholder;
        const alt = mainImage.label || 'product';
        return (
            <div className={classes.root}>
                <img
                    className={classes.currentImage}
                    src={src}
                    alt={alt}
                />
                <ThumbnailList items={images} />
            </div>
        );
    }
}

export default classify(defaultClasses)(Carousel);
