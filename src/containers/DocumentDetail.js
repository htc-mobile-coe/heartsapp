import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import DocumentDetailView from '../components/detailview/DocumentDetailView';
import DisplayObjectListItem from '../components/listitem/DisplayobjectListItem';
import Images from '../config/Images';
import SiblingNavbar from '../components/navbar/SiblingNavbar';
import BreadcrumbBar from '../components/breadcrumbbar/BreadcrumbBar';

import * as listActions from '../actions/DocumentDetailActions';

import {
    LOAD_DOCUMENT_DETAIL,
    LOAD_MORE_DOCUMENT_DETAIL,
    DOCUMENT_DETAIL_LOADING_FAILED,
    SET_DOCUMENT_DETAIL_LOADING,
    SET_DOCUMENT_DETAIL_LOADING_MORE,
} from '../actions/types';

class DocumentDetail extends React.Component {
    constructor(props) {
        super(props);

        this.loadActions = {
            setListLoadingAction: SET_DOCUMENT_DETAIL_LOADING,
            loadAction: LOAD_DOCUMENT_DETAIL,
            loadingFailed: DOCUMENT_DETAIL_LOADING_FAILED,
        };

        this.loadMoreActions = {
            setListLoadingAction: SET_DOCUMENT_DETAIL_LOADING_MORE,
            loadAction: LOAD_MORE_DOCUMENT_DETAIL,
            loadingFailed: DOCUMENT_DETAIL_LOADING_FAILED,
        };

        this.renderDetailView = this.renderDetailView.bind(this);
        this.load = this.load.bind(this);
        this.hasMore = this.hasMore.bind(this);
        this.loadMore = this.loadMore.bind(this);

        this.renderListItem = this.renderListItem.bind(this);
        this.isPaginated = this.isPaginated.bind(this);
        this.navigateToSibling = this.navigateToSibling.bind(this);
        this.renderSiblingNavbar = this.renderSiblingNavbar.bind(this);
        this.renderBreadcrumbBar = this.renderBreadcrumbBar.bind(this);
        this.navigateToNextSibling = this.navigateToNextSibling.bind(this);
        this.navigateToPreviousSibling = this.navigateToPreviousSibling.bind(
            this,
        );
        this.navigateToCollection = this.navigateToCollection.bind(this);
    }

    componentDidMount() {
        this.props.setDocumentDetailNavbar();
        this.load();
    }

    load() {
        if (this.props.load && this.props.documentId) {
            this.props.load(
                {
                    documentId: this.props.documentId,
                    pageSize: 10,
                    parentCollectionId: this.props.parentCollectionId,
                    indexInParentCollection: this.props.indexInParentCollection,
                },
                this.loadActions,
            );
        }
    }

    hasMore() {
        return (
            this.props.totalNoOfDisplayObjects >
            this.props.displayObjects.length
        );
    }

    loadMore() {
        this.props.loadMore(
            {
                documentId: this.props.documentId,
                pageIndex: this.props.pageIndex,
                pageSize: 10,
                parentCollectionId: this.props.parentCollectionId,
                indexInParentCollection: this.props.indexInParentCollection,
            },
            this.loadMoreActions,
        );
    }

    renderListItem(item, index) {
        return <DisplayObjectListItem model={item} index={index} />;
    }

    isPaginated() {
        switch (this.props.documentType) {
            case 'WhisperCollectionDocument':
                return true;
        }

        return false;
    }

    navigateToSibling(sibling, indexInParentCollection) {
        this.props.setDocumentDetail(
            sibling.resourceId,
            this.props.parentCollectionId,
            indexInParentCollection,
        );
    }

    navigateToCollection(breadCrumb) {
        this.props.loadCollectionDetail(breadCrumb.resourceId);
    }

    navigateToNextSibling(sibling) {
        this.navigateToSibling(sibling, this.props.indexInParentCollection + 1);
    }

    navigateToPreviousSibling(sibling) {
        this.navigateToSibling(sibling, this.props.indexInParentCollection - 1);
    }

    renderSiblingNavbar() {
        return (
            <SiblingNavbar
                nextSibling={this.props.nextSibling}
                previousSibling={this.props.previousSibling}
                navigateToNextSibling={this.navigateToNextSibling}
                navigateToPreviousSibling={this.navigateToPreviousSibling}
            />
        );
    }

    renderBreadcrumbBar() {
        if (this.props.breadCrumbs && this.props.breadCrumbs.length > 0) {
            return (
                <BreadcrumbBar
                    items={this.props.breadCrumbs}
                    onBreadcrumbPress={this.navigateToCollection}
                />
            );
        }

        return null;
    }

    renderDetailView = () => {
        const {
            avatarLink,
            isLoading,
            isLoadingMore,
            goBack,
            title,
            displayObjects,
        } = this.props;

        const isInfiniteScroll = this.isPaginated();

        return (
            <DocumentDetailView
                avatarLink={avatarLink}
                displayObjects={displayObjects}
                isLoading={isLoading}
                onBackButtonPress={goBack}
                title={title}
                renderListItem={this.renderListItem}
                infiniteScroll={isInfiniteScroll}
                hasMore={this.hasMore}
                loadMore={this.loadMore}
                isLoadingMore={isLoadingMore}
                defaultAvatar={Images.defaultBabujiImage}
                siblingNavbar={this.renderSiblingNavbar}
                breadcrumbBar={this.renderBreadcrumbBar}
            />
        );
    };

    render() {
        const detailView = this.renderDetailView();

        return (
            <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
                {detailView}
            </View>
        );
    }
}

const mapStateToProps = state => state.documentDetail;

const mapDispatchToProps = {
    ...listActions,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DocumentDetail);
