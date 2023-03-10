import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableNativeFeedback, ScrollView } from 'react-native';

import { BackgroundColor, FontColor } from '../../config/ColorContants';
import { FontFamily } from '../../config/FontConstants';
import FontIcon, { Icons } from '../icons/FontIcon';

export default class SearchResultListItem extends React.Component {
    constructor(props) {
        super(props);

        this.styles = this.styles.bind(this);
        this.renderPreviewImage = this.renderPreviewImage.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
        this.renderMetadata = this.renderMetadata.bind(this);
        this.renderMetadataItem = this.renderMetadataItem.bind(this);
        this.renderMediaIcon = this.renderMediaIcon.bind(this);
        this.renderPremiumContentIndicator = this.renderPremiumContentIndicator.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    styles() {
        const containerPaddingTop = this.props.index === 0 ? 15 : 0;
        const contentPadding = 14;

        return StyleSheet.create({
            container: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 12,
                paddingRight: 12,
                paddingBottom: 3,
                paddingTop: containerPaddingTop
            },

            card: {
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: BackgroundColor.collectionListItemCard,
                borderRadius: 2,
                paddingTop: contentPadding,
                paddingBottom: contentPadding,
                paddingRight: contentPadding
            },

            bodyRow: {
                flexDirection: 'row',
            },

            metadataRow: {
                flexDirection: 'row',
                paddingLeft: contentPadding
            },

            previewImageSlot: {
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                elevation: 10,
                paddingRight: 7,
                paddingLeft: contentPadding
            },

            contentSlot: {
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingLeft: contentPadding
            },

            titleSlot: {
                marginBottom: 5
            },

            premiumContentIndicatorSlot: {
                flexDirection: 'row',
                paddingLeft: contentPadding
            },

            imageContainer: {
                elevation: 3,
                borderWidth: 1,
                borderColor: '#FAFAFA',
            },

            previewImage: {
                width: 90,
                height: 120
            },

            title: {
                fontFamily: FontFamily.searchResultTitle,
                fontSize: 15,
                color: FontColor.collectionListItemTitle
            },

            snippetTextSlot: {
                marginBottom: 5
            },

            snippetText: {
                fontFamily: FontFamily.searchResultSnippetText,
                lineHeight: 18,
                fontSize: 15,
            },

            snippetTextNormal: {
                color: FontColor.searchResultSnippetText
            },

            snippetTextHighlighted: {
                color: FontColor.searchResultHighlightedSnippetText
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

            metadataItemContainer:{
                flexDirection: 'row',
                paddingTop: 7
            },

            metadataItemWrapper: {
                flexDirection: 'column'
            },

            metadataItemTitleWrapper: {
                flexDirection: 'row'
            },

            metadataItemValueWrapper: {
                flexDirection: 'row',
                justifyContent: 'center'
            },

            metadataItemSeprator: {
                flexDirection: 'column',
                borderLeftWidth: 1,
                borderColor: FontColor.collectionListItemMetadataValue,
                marginHorizontal: 12,
            },

            premiumContentIndicator: {
                fontSize: 20,
                color: FontColor.collectionListItemMetadataValue
            },

            mediaIconContainer: {
                width: '100%',
                marginTop: -25,
                marginRight: -12,
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
            },

            mediaIconWrapper: {
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 5,
                elevation: 8,
                borderRadius: 14,
                padding: 5,
            },

            mediaIconStyle: {
                color: FontColor.searchResultHighlightedSnippetText,
                fontSize: 9,
            }
        });
    }

    renderMediaIcon() {
        const { documentType } = this.props;

        let render = false;
        let icon = Icons.music;
        
        if(documentType === 'VideoDocument' || documentType === 'VideoCollectionDocument') {
            icon = Icons.play;
            render = true;
        } else if(documentType === 'AudioDocument' || documentType === 'AudioCollectionDocument'){
            render = true;
        }
        
        if(render){
            return (
                <View style={this.styles().mediaIconContainer}>
                    <View style={this.styles().mediaIconWrapper}>
                        <FontIcon style={this.styles().mediaIconStyle} icon={icon}/>
                    </View>
                </View>
            );
        }

        return null;
    }

    renderPreviewImage(){
        const source = {
            uri: this.props.previewImageUrl
        };

        return (
            <View style={this.styles().imageContainer}>
                <Image style={this.styles().previewImage} source={source} />
            </View>     
        );
    }

    renderPreviewImageSlot() {
        if(this.props.previewImageUrl){
            const mediaIcon = this.renderMediaIcon();
            const previewImage = this.renderPreviewImage();

            return (
                <View style={this.styles().previewImageSlot}>
                    {previewImage}
                    {mediaIcon}
                </View>                
            );    
        }

        return null;
    }

    onPress() {
        const { resourceId, requiresSubscriptionToViewDetail, documentType } = this.props;
        this.props.onPress(resourceId, requiresSubscriptionToViewDetail, documentType);
    }

    renderTitle() {
        const { title } = this.props;

        return (
            <Text style={this.styles().title} numberOfLines={2}>{title}</Text>
        );
    }

    renderMetdataItemSeperator(shouldAddLeftBorder){
        if(shouldAddLeftBorder){
            return (
                <View style={this.styles().metadataItemSeprator}>
                </View>
            );
        }

        return null;
    }

    renderMetadataItem(metadataItem, key, shouldAddSeperator) {
        const { title, value } = metadataItem;
        const seperator = this.renderMetdataItemSeperator(shouldAddSeperator)

        return (
            <View key={key} style={this.styles().metadataItemContainer}>
                {seperator}
                <View style={this.styles().metadataItemWrapper}>
                    <View style={this.styles().metadataItemTitleWrapper}>
                        <Text style={this.styles().metadataTitle}>
                            {title}
                        </Text>
                    </View>
                    <View style={this.styles().metadataItemValueWrapper}>   
                        <Text style={this.styles().metadataValue}>
                            {value}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    renderMetadata() {
        const { metadata } = this.props;

        if(metadata){
            const allMetada = [];

            for(i = 0; i < metadata.length; i++){
                allMetada.push({
                    title: metadata[i].keyDisplay,
                    value: metadata[i].valueDisplay
                });
            }

            if (allMetada.length > 0) {
                return allMetada.map((metadataItem, i) => {
                    return this.renderMetadataItem(metadataItem, i + 1, i > 0);
                });
            }
        }

        return null;
    }

    renderSnippetTextPart(text, i){
        const parts = text.split('<b>');

        const { snippetText, snippetTextNormal:normal, snippetTextHighlighted:highlight } = this.styles();

        if(parts.length > 1){
            return(
                <Text style={[snippetText, normal]} key={i}>
                    {parts[0]}
                    <Text style={[snippetText, highlight]}>{parts[1]}</Text>
                </Text>
            );
        } else {
            return (
                <Text style={[snippetText, normal]} key={i}> 
                    {parts[0]}
                </Text>
            );
        }
    }

    renderSnippetText() {
        const { snippetText } = this.props;

        if(snippetText){
            const allParts = snippetText.split('</b>');

            const highlightedText = allParts.map((t, i) => {
                return this.renderSnippetTextPart(t, i);
            });

            return <Text numberOfLines={4}>{highlightedText}</Text>;
        }

        return null;
    }

    renderPremiumContentIndicator() {
        const { requiresSubscriptionToViewDetail } = this.props;

        if (requiresSubscriptionToViewDetail) {
            return <FontIcon style={this.styles().premiumContentIndicator} icon={Icons.lock} />;
        }

        return null;
    }

    renderCard = () => {
        const previewImageSlot = this.renderPreviewImageSlot();
        const title = this.renderTitle();
        const snippet = this.renderSnippetText();
        const metadata = this.renderMetadata();
        const premiumContentIndicator = this.renderPremiumContentIndicator();

        return (
            <View style={this.styles().card}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    onPress={() => { this.onPress() }}>
                    <View style={this.styles().bodyRow}>
                        {previewImageSlot}
                        <View style={this.styles().contentSlot}>
                            <View style={this.styles().titleSlot}>
                                {title}
                            </View>
                            <View style={this.styles().titleSlot}>
                                {snippet}
                            </View>
                        </View>
                        <View style={this.styles().premiumContentIndicatorSlot}>
                            {premiumContentIndicator}
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <ScrollView horizontal={true}>
                    <View style={this.styles().metadataRow}>
                        {metadata}
                    </View>
                </ScrollView>
            </View>
        );
    }

    render() {
        const card = this.renderCard();

        return (
            <View style={this.styles().container}>
                {card}
            </View>
        );
    }
}