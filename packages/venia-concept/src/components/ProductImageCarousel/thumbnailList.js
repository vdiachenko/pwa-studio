import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Thumbnail from './thumbnail';
import defaultClasses from './thumbnailList.css';
import { mediaGalleryEntry } from 'src/shared/propShapes';

class ThumbnailList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        items: PropTypes.arrayOf(mediaGalleryEntry).isRequired
    };

    render() {
        // linear-time sort is possible when we have a numeric 'position' prop
        const validItems = this.props.items
            .filter(i => !i.disabled)
            .reduce((sorted, item) => {
                sorted[item.position - 1] = item;
                return sorted;
            }, []);
        return <List renderItem={Thumbnail} {...this.props} items={validItems} />;
    }
}

export default classify(defaultClasses)(ThumbnailList);
