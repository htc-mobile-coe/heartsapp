import React from 'react';
import { StyleSheet, Text, View, Image, TouchableNativeFeedback } from 'react-native';

import { BackgroundColor, FontColor } from '../../config/ColorContants';
import { FontFamily } from '../../config/FontConstants';
import FontIcon, { Icons } from '../icons/FontIcon';

export default class CollectionDocumentListItem extends React.Component {
    constructor(props) {
        super(props);

        this.renderStyles = this.renderStyles.bind(this);
        this.renderPreviewImage = this.renderPreviewImage.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
        this.renderMetadata = this.renderMetadata.bind(this);
        this.renderMetadataItem = this.renderMetadataItem.bind(this);
        this.renderPremiumContentIndicator = this.renderPremiumContentIndicator.bind(this);
        this.onPress = this.onPress.bind(this);

        this.styles = this.renderStyles();
    }

    renderStyles() {
        const containerPaddingTop = this.props.index === 0 ? 15 : 0;

        return StyleSheet.create({
            container: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 12,
                paddingRight: 12,
                paddingBottom: 2,
                paddingTop: containerPaddingTop
            },

            card: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: BackgroundColor.collectionListItemCard,
                borderRadius: 2,
            },

            previewImageSlot: {
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingTop: 20,
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 20,
                elevation: 10
            },

            contentSlot: {
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: 22,
                paddingRight: 10,
                paddingBottom: 20
            },

            titleSlot: {
                marginBottom: 10
            },

            metadataSlot: {

            },

            premiumContentIndicatorSlot: {
                paddingTop: 10,
                flexDirection: 'row',
                paddingRight: 10
            },

            metadataItemContainer: {
                marginBottom: 10,
            },

            imageContainer: {
                elevation: 10,
                borderWidth: 1,
                borderColor: '#FAFAFA',
            },

            previewImage: {
                height: 100,
                width: 80
            },

            title: {
                fontFamily: FontFamily.collectionListItemTitle,
                fontSize: 18,
                color: FontColor.collectionListItemTitle
            },

            metadataTitle: {
                fontFamily: FontFamily.collectionListItemMetadataTitle,
                fontSize: 12,
                color: FontColor.collectionListItemMetadataTitle
            },

            metadataValue: {
                fontFamily: FontFamily.collectionListItemMetadataValue,
                fontSize: 12,
                color: FontColor.collectionListItemMetadataValue
            },

            premiumContentIndicator: {
                fontSize: 20,
                color: FontColor.collectionListItemMetadataValue
            }
        });
    }

    renderPreviewImage() {
        const source = {
            uri: this.props.previewImageLink
        };

        return <View style={this.styles.imageContainer}><Image style={this.styles.previewImage} source={source} /></View>;
    }

    onPress() {
        const { resourceId, requiresSubscriptionToViewDetail, index } = this.props;
        this.props.onPress(resourceId, requiresSubscriptionToViewDetail, index);
    }

    shouldComponentUpdate(nextProps, nextState){
        return this.props.resourceId !== nextProps.resourceId;
    }

    renderTitle() {
        const { title } = this.props;

        return (
            <Text style={this.styles.title}>{title}</Text>
        );
    }

    renderMetadataItem(metadataItem, key) {
        const { title, value } = metadataItem;

        return (
            <View key={key} style={this.styles.metadataItemContainer}>
                <Text style={this.styles.metadataTitle}>
                    {title}
                </Text>
                <Text style={this.styles.metadataValue}>
                    {value}
                </Text>
            </View>
        );
    }

    renderMetadata() {
        const { authors, metadatas } = this.props;

        const allMetada = [];

        if (authors && authors.length > 0) {
            allMetada.push({
                title: 'Author',
                value: authors.join(', ')
            });
        }

        if (metadatas && metadatas.length > 0) {
            allMetada.push(...metadatas);
        }

        if (allMetada.length > 0) {
            return allMetada.map((metadataItem, i) => {
                return this.renderMetadataItem(metadataItem, i + 1);
            });
        }

        return null;
    }

    renderPremiumContentIndicator() {
        const { requiresSubscriptionToViewDetail } = this.props;

        if (requiresSubscriptionToViewDetail) {
            return <FontIcon style={this.styles.premiumContentIndicator} icon={Icons.lock} />;
        }

        return null;
    }

    renderCard = () => {
        const previewImage = this.renderPreviewImage();
        const title = this.renderTitle();
        const metadata = this.renderMetadata();
        const premiumContentIndicator = this.renderPremiumContentIndicator();

        return (
            <View style={this.styles.card}>
                <View style={this.styles.previewImageSlot}>
                    {previewImage}
                </View>
                <View style={this.styles.contentSlot}>
                    <View style={this.styles.titleSlot}>
                        {title}
                    </View>
                    <View style={this.styles.metadataSlot}>
                        {metadata}
                    </View>
                </View>
                <View style={this.styles.premiumContentIndicatorSlot}>
                    {premiumContentIndicator}
                </View>
            </View>
        );
    }

    render() {
        const card = this.renderCard();

        return (
            <View style={this.styles.container}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    onPress={() => { this.onPress() }}>
                    {card}
                </TouchableNativeFeedback>
            </View>
        );
    }
}