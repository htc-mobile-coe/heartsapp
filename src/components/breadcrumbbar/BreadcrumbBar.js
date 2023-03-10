import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableNativeFeedback,
} from 'react-native';
import FontIcon, { Icons } from '../icons/FontIcon';
import { BackgroundColor, FontColor } from '../../config/ColorContants';

export default class BreadcrumbBar extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        return StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: 'row',
                backgroundColor: BackgroundColor.navBar,
                alignItems: 'flex-start',
                height: 30,
                paddingRight: 20,
                paddingLeft: 10,
            },

            breadcrumbItemContainer: {
                flexDirection: 'row',
            },

            seperatorItem: {
                marginLeft: 15,
                marginRight: 15,
                alignItems: 'center',
                justifyContent: 'center',
            },

            iconStyle: {
                color: FontColor.navBarItem,
                fontSize: 22,
            },

            breadcrumbItemText: {
                color: FontColor.navBarItem,
                fontSize: 15,
            },
        });
    }

    renderSeperatorItem() {
        return (
            <View style={this.styles().seperatorItem}>
                <FontIcon
                    style={this.styles().iconStyle}
                    icon={Icons.angleRight}
                />
            </View>
        );
    }

    onBreadcrumbPress(breadcrumb) {
        this.props.onBreadcrumbPress(breadcrumb);
    }

    renderBreadcrumbItem(breadcrumb, index) {
        let seperator = null;

        if (index > 0) {
            seperator = this.renderSeperatorItem();
        }

        return (
            <View style={this.styles().breadcrumbItemContainer}>
                {seperator}
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    onPress={() => {
                        this.onBreadcrumbPress(breadcrumb);
                    }}>
                    <Text style={this.styles().breadcrumbItemText}>
                        {breadcrumb.displayString}
                    </Text>
                </TouchableNativeFeedback>
            </View>
        );
    }

    renderBreadcrumbItems() {
        if (this.props.items && this.props.items.length > 0) {
            return this.props.items.map((child, i) => {
                return this.renderBreadcrumbItem(child, i);
            });
        }

        return null;
    }

    render() {
        const breadcrumbItems = this.renderBreadcrumbItems();

        return (
            <View style={this.styles().container}>
                <ScrollView horizontal={true}>{breadcrumbItems}</ScrollView>
            </View>
        );
    }
}
