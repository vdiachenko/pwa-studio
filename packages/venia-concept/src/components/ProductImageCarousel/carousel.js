import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import ThumbnailList from './thumbnailList';
import defaultClasses from './carousel.css';
import { makeProductMediaPath } from 'src/util/makeMediaPath';
import { transparentPlaceholder } from 'src/shared/images';

class Carousel extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            currentImageFile: PropTypes.string,
            root: PropTypes.string
        }),
        images: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                position: PropTypes.number.isRequired,
                disabled: PropTypes.bool,
                file: PropTypes.string.isRequired
            })
        ).isRequired
    };

    shouldComponentUpdate({ images }) {
        return (
            images.length !== this.props.images.length ||
            this.props.images.some(({ label, position, disabled, file }, i) => {
                const image = images[i];
                return (
                    image.label !== label ||
                    image.position !== position ||
                    image.disabled !== disabled ||
                    image.file !== file
                );
            })
        );
    }

    render() {
        const { classes, images } = this.props;
        // the order of the array is not guaranteed to be the position order,
        // but we can do linear-time sort with the `position` prop.
        const sortedImages = images
            .filter(i => !i.disabled)
            .reduce((sorted, { label, position, file }) => {
                sorted[position - 1] = {
                    label,
                    position,
                    file: makeProductMediaPath(file)
                };
                return sorted;
            }, []);

        const mainImage = sortedImages[0] || {};
        const src = mainImage.file || transparentPlaceholder;
        const alt = mainImage.label || 'product';
        return (
            <div className={classes.root}>
                <img className={classes.currentImage} src={src} alt={alt} />
                <ThumbnailList getItemKey={i => i.file} items={sortedImages} />
            </div>
        );
    }
}

export default classify(defaultClasses)(Carousel);
