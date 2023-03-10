import React from 'react';
import CenterView from '../shared/CenterView';
import Images from '../shared/Images';
import FastImage from 'react-native-fast-image';
import { styles as appEntryStyles } from './AppEntryScreen.styles';
import { withTheme } from '../../styles/theme/WithThemeHOC';
class AppEntryScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { images, styles } = this.props;
        return (
            <CenterView>
                <FastImage
                    source={images.loader}
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.contain}
                    testID="appEntry_loader--image"
                />
            </CenterView>
        );
    }
}
export default withTheme(AppEntryScreen, appEntryStyles, Images);
