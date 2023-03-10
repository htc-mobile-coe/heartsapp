import React, { Component } from 'react';
import SpotLight from './SpotLight';
import { withTranslation } from 'react-i18next';
import spotlightImage from './img';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class SpotlightScreen extends Component {
    render = () => {
        const {
            onPressSpotLight,
            onSkipPress,
            showSpotLightPopup,
            spotLightImageContent,
            images,
        } = this.props;
        const image = images[spotLightImageContent.image];
        return (
            <SpotLight
                onPressSpotLight={onPressSpotLight}
                onSkipPress={onSkipPress}
                showSpotLightPopup={showSpotLightPopup}
                image={image}
            />
        );
    };
}
export default withTranslation()(
    withTheme(SpotlightScreen, null, spotlightImage),
);
