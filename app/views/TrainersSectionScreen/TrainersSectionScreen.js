import React, { Component } from 'react';
import { View } from 'native-base';
import { get } from 'lodash';
import { withTranslation } from 'react-i18next';
import { styles as TrainersSectionScreenStyles } from './TrainersSectionScreen.styles';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import TileBox from './TileBox';
import ScreenContainer from '../shared/ScreenContainer';
import TrainersSectionScreenImages from './img';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { map } from 'lodash';
export class TrainersSectionScreen extends Component {
    _renderListItem = item => {
        const { images, onTileBoxPress } = this.props;

        const id = get(item, 'id');
        const title = get(item, 'title');
        const subTitle = get(item, 'subTitle');
        const imageSource = images[get(item, 'image')];
        const disable = get(item, 'disable');

        return (
            <TileBox
                key={id}
                id={id}
                disable={disable}
                onPress={onTileBoxPress}
                title={title}
                subTitle={subTitle}
                imageSource={imageSource}
            />
        );
    };

    render() {
        const { t, styles, onBackPress, contents } = this.props;
        return (
            <ScreenContainer>
                <OptionsScreenHeader
                    title={t('trainersSection:title')}
                    onBackPress={onBackPress}
                    style={styles.headingContainer}
                />
                <View style={styles.container}>
                    {map(contents, this._renderListItem)}
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        TrainersSectionScreen,
        TrainersSectionScreenStyles,
        TrainersSectionScreenImages,
    ),
);
