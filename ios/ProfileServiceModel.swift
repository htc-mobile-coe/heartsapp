//
//  ProfileServiceModel.swift
//  heartsapp
//
//  Created by Ashima Sharma on 11/28/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

struct RegistrationData {
  
  let firebaseIdToken: String
  let profile: ProfileData
  
}

struct ProfileData  {
  
  let uId: String
  let identityType: String
  let anonymous: Bool
  
}

struct ProfileResponse: Codable {
  
  var profileId: String? = nil
  var email: String? = nil
  var firstName: String? = nil
  var lastName: String? = nil
  var profession: String? = nil
  var gender: Int? = 0
  var stage: Int? = 0
  var uId: String? = nil
  var isTrainer: Bool? = false
  var phone: String? = nil
  var addressLine1: String? = nil
  var addressLine2: String? = nil
  var addressLine3: String? = nil
  var city: String? = nil
  var stateCode: String? = nil
  var postalCode: String? = nil
  var countryCode: String? = nil
  var photoURL: String? = nil
  var zone: String? = nil
  var emergencyContact: String? = nil
  var printName: String? = nil
  var aimsId: String? = nil
  var nodalCenter: Int? = nil
  var firstSittingDate: String? = nil
  var secondSittingDate: String? = nil
  var thirdSittingDate: String? = nil
  var introducedBy: String? = nil
  var citizenship: String? = nil
  var prefect: String? = nil
  var dob: String? = nil
  var doj: String? = nil
  var volunteer: String? = nil
  var skills: String? = nil
  var currentPreceptor: String? = nil
  var landline: String? = nil
  var countryName: String? = nil
  var stateName: String? = nil
  var cityPlaceId: String? = nil
  var abhyasiId: String? = nil
  var anonymous: Bool? = false;
  var latitude: Double? =  0.0
  var longitude: Double? =  0.0
  var isLocationVisibleToPublic: ProfileNullableBoolResponse?
  var isNameVisibleToPublic: ProfileNullableBoolResponse? 
  var isPhotoVisibleToPublic: ProfileNullableBoolResponse?
  
  init() {
    
  }
  
}

enum CodingKeys: String, CodingKey {
  case message = "message"

}

struct UserPreferencesResponse: Codable {
  let uId: String?
  var isSubscribedToWeeklyInspiration: ProfileNullableBoolResponse?
  var shouldPlayRelaxationAudioBeforeMeditation: ProfileNullableBoolResponse?
  var language: String?
  var timeOfConsent: HFTimestamp? = nil
  var isMorningMeditationReminderEnabled: Bool?
  var morningMeditationTime: HFTimestamp? = nil
  var isEveningMeditationReminderEnabled: Bool?
  var eveningCleaningTime: HFTimestamp? = nil
  
  var isReminderForNextSittingEnabled: Bool?
  var nextSittingReminderIntervalInDays: Int32?
}
  
struct ProfileNullableBoolResponse: Codable {
  let kindCase: Int?
  let kind: Bool?
  init(from kindCase: Int?,kind: Bool?) {
    self.kindCase = kindCase;
    self.kind = kind;
  }
}

