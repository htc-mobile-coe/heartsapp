import { NativeModules } from "react-native";

export const ContentServiceClient = {
  getSearchResultDetail: (request) => {
    return NativeModules.ContentServiceClient.getSearchResultDetail(request);
  },

  getCollectionDetail: (request) => {
    return NativeModules.ContentServiceClient.getCollectionDetail(request);
  },

  getResourcesList: (request) => {
    return NativeModules.ContentServiceClient.getResourcesList(request);
  },

  launchVideoPlayer: (request) => {
    return NativeModules.ContentServiceClient.launchVideoPlayer(request);
  },

  launchAudioPlayer: (request) => {
    return NativeModules.ContentServiceClient.launchAudioPlayer(request);
  },

  launchAudioCollectionDetail: (request) => {
    return NativeModules.ContentServiceClient.launchAudioCollectionDetail(request);
  },

  launchVideoCollectionDetail: (request) => {
    return NativeModules.ContentServiceClient.launchVideoCollectionDetail(request);
  },

  doSearch: (request) => {
    return NativeModules.ContentServiceClient.doSearch(request);
  },

  getSuggestions: (request) => {
    return NativeModules.ContentServiceClient.getSuggestions(request);
  },

  launchSubscriptionList: (request) => {
    return NativeModules.ContentServiceClient.launchSubscriptionList(request);
  },

  getWhispersOfTheDay: (request) => {
    return NativeModules.ContentServiceClient.getWhispersOfTheDay(request);
  },
};