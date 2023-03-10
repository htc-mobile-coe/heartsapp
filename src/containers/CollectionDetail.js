import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import CollectionDetailView from '../components/detailview/CollectionDetailView';
import DocumentDetailView from '../components/detailview/DocumentDetailView';
import TableOfContentsRow from '../components/listitem/TableOfContentsRow';
import WhisperListItem from '../components/listitem/WhisperListItem';
import DisplayObjectListItem from '../components/listitem/DisplayobjectListItem';
import Images from '../config/Images';

import {
    load,
    loadMore,
    loadDocumentDetail,
    loadCollectionDetail,
    goBack,
    setDocumentDetailNavbar,
} from '../actions/CollectionDetailActions';
import { setNavbar } from '../actions/NavBarActions';
import { NavBarType } from '../config/NavbarConstants';

import {
    LOAD_COLLECTION_DETAIL,
    LOAD_MORE_COLLECTION_DETAIL,
    COLLECTION_DETAIL_LOADING_FAILED,
    SET_COLLECTION_DETAIL_LOADING,
    SET_COLLECTION_DETAIL_LOADING_MORE,
    GO_BACK,
} from '../actions/types';
import NavBar from './NavBar';
import BreadcrumbBar from '../components/breadcrumbbar/BreadcrumbBar';

class CollectionDetail extends React.Component {
    constructor(props) {
        super(props);

        this.loadActions = {
            setListLoadingAction: SET_COLLECTION_DETAIL_LOADING,
            loadAction: LOAD_COLLECTION_DETAIL,
            loadingFailed: COLLECTION_DETAIL_LOADING_FAILED,
        };

        this.loadMoreActions = {
            setListLoadingAction: SET_COLLECTION_DETAIL_LOADING_MORE,
            loadAction: LOAD_MORE_COLLECTION_DETAIL,
            loadingFailed: COLLECTION_DETAIL_LOADING_FAILED,
        };

        this.renderDetailView = this.renderDetailView.bind(this);
        this.load = this.load.bind(this);
        this.hasMore = this.hasMore.bind(this);
        this.loadMore = this.loadMore.bind(this);

        this.renderBookTableOfContentRow = this.renderBookTableOfContentRow.bind(
            this,
        );
        this.renderWhisperListItem = this.renderWhisperListItem.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.isPaginated = this.isPaginated.bind(this);
        this.onListItemPress = this.onListItemPress.bind(this);
        this.renderBreadcrumbBar = this.renderBreadcrumbBar.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    load() {
        if (this.props.load && this.props.collectionId) {
            this.props.load(
                {
                    collectionId: this.props.collectionId,
                    pageSize: 10,
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
                collectionId: this.props.collectionId,
                pageIndex: this.props.pageIndex,
                pageSize: 10,
            },
            this.loadMoreActions,
        );
    }

    renderBookTableOfContentRow(item, index) {
        const itemNo = index + 1;
        const itemRefAttributeIndex = 0;
        const resourceId =
            item && item.attributes && item.attributes.length > 0
                ? item.attributes[itemRefAttributeIndex].value
                : '';

        return (
            <TableOfContentsRow
                itemNo={itemNo}
                title={item.content}
                resourceId={resourceId}
                requiresSubscriptionToViewDetail={false}
                onPress={this.onListItemPress}
            />
        );
    }

    loadChapterDetail(resourceId, requiresSubscriptionToViewDetail) {
        this.props.setNavbar(NavBarType.DOCUMENT_DETAIL_NAVBAR);
        this.props.loadCollectionDetail(
            resourceId,
            requiresSubscriptionToViewDetail,
        );
    }

    onListItemPress(resourceId, requiresSubscriptionToViewDetail, index) {
        switch (this.props.documentType) {
            case 'BookDocument':
                this.loadChapterDetail(
                    resourceId,
                    requiresSubscriptionToViewDetail,
                );
                break;

            case 'BookCollectionDocument':
            case 'ChapterDocument':
                this.props.loadCollectionDetail(
                    resourceId,
                    requiresSubscriptionToViewDetail,
                );
                break;

            case 'WhisperCollectionDocument':
                this.props.loadDocumentDetail(
                    resourceId,
                    requiresSubscriptionToViewDetail,
                    this.props.collectionId,
                    index,
                );
                break;
        }
    }

    renderDisplayObjectItem(item, index) {
        return <DisplayObjectListItem model={item} index={index} />;
    }

    renderWhisperListItem(item, index) {
        return (
            <WhisperListItem
                model={item}
                onPress={this.onListItemPress}
                index={index}
            />
        );
    }

    renderListItem(item, index) {
        switch (this.props.documentType) {
            case 'BookDocument':
            case 'BookCollectionDocument':
                return this.renderBookTableOfContentRow(item, index);

            case 'WhisperCollectionDocument':
                return this.renderWhisperListItem(item, index);

            case 'ChapterDocument':
                return this.renderDisplayObjectItem(item, index);
        }
    }

    isPaginated() {
        switch (this.props.documentType) {
            case 'WhisperCollectionDocument':
                return true;

            case 'ChapterDocument':
                return true;
        }

        return false;
    }

    renderNavBar() {
        return <NavBar />;
    }

    renderBreadcrumbBar() {
        if (this.props.breadCrumbs && this.props.breadCrumbs.length > 0) {
            return (
                <BreadcrumbBar
                    items={this.props.breadCrumbs}
                    onBreadcrumbPress={breadCrumb => {
                        this.onListItemPress(breadCrumb.resourceId, false);
                    }}
                />
            );
        }

        return null;
    }

    renderChapterDetailView = () => {
        const {
            avatarLink,
            isLoading,
            isLoadingMore,
            goBack,
            title,
            displayObjects,
        } = this.props;

        return (
            <DocumentDetailView
                avatarLink={avatarLink}
                displayObjects={displayObjects}
                isLoading={isLoading}
                onBackButtonPress={goBack}
                title={title}
                renderListItem={this.renderListItem}
                infiniteScroll
                hasMore={this.hasMore}
                loadMore={this.loadMore}
                isLoadingMore={isLoadingMore}
                defaultAvatar={Images.defaultBabujiImage}
                navBar={this.renderNavBar}
                breadcrumbBar={this.renderBreadcrumbBar}
            />
        );
    };

    renderCollectionDetailView = () => {
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
            <CollectionDetailView
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
            />
        );
    };

    renderDetailView = () => {
        const { documentType } = this.props;

        if (documentType == 'ChapterDocument') {
            return this.renderChapterDetailView();
        }

        return this.renderCollectionDetailView();
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

const mapStateToProps = state => {
    return state.collectionDetail;
};

const mapDispatchToProps = {
    load,
    loadMore,
    loadDocumentDetail,
    loadCollectionDetail,
    goBack,
    setDocumentDetailNavbar,
    setNavbar,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CollectionDetail);
