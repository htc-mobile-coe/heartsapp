//
//  ApplicationConstantsService.swift
//  heartsapp
//
//  Created by havarma on 21/03/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import SwiftyJSON

@objc(ApplicationConstants)
class ApplicationConstantsService: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
    }
  
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
      return [
        "GOOGLE_APP_ID": Environment.current.googleAppId,
        "PUSH_NOTIFICATION_SENDER_ID": Environment.current.pushNotificationSenderId,
        "DONATION_URL" :  Environment.current.donationURL,
        "STATES_IN_COUNTRY_URL" :  Environment.current.stateInCounryURL,
        "GOOGLE_PLACE_API_KEY" :  Environment.current.googlePlaceAPIKey,
        "GOOGLE_GEOCODE_URL" :  Environment.current.googleGeocodeURL,
        "GOOGLE_PLACE_DETAILS_URL" :  Environment.current.googlePlaceDetailsURL,
        "RECURRING_DONATION_URL" :  Environment.current.recurringDonationURL,
        "MY_SRCM_CITIES_URL" : Environment.current.mySRCMCitiesURL,
        "SEARCH_SEEKER_URL" : Environment.current.searchSeekerURL,
        "MYSRCM_CLIENT_ID" : Environment.current.mySRCMClientId,
      ];
  }
}

