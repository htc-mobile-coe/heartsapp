//
//  MeditationServiceModel.swift
//  heartsapp
//
//  Created by Ashima Sharma on 12/15/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

struct SeekerResponse: Codable {
  
  var seekerId: String? = nil
  var status: Int? = nil
  var session: MeditationSession? = nil
  var hasSession: Bool? = false
  var stateTransitionTime: Int? = 0
  var sequenceNumber: Int? = 0
  
  init() {
    
  }
}

struct PreceptorResponse: Codable {
  
  var preceptorId: String? = nil
  var status: Int? = nil
  var session: MeditationSession? = nil
  var hasSession: Bool? = false
  var stateTransitionTime: Int? = 0
  var sequenceNumber: Int? = 0
  
  init() {
    
  }
}

struct HFTimestamp : Codable {
  var seconds: Int64? = 0
  init(seconds: Int64){
    self.seconds = seconds
  }
}

struct MeditationSession: Codable {
  var sessionId: String? = nil
  var preceptorName: String? = nil
  var preceptorPhotoURL: String? = nil
  var preceptorDetails: String? = nil
  var seekerName: String? = nil
  var seekerDetails: String? = nil
  var state: Int? = 0
  var hasEndTime: Bool? = false
  var totalSeekers: Int? = 0
  var batchSitting: Bool? = false
  var preceptorId: String? = nil
  var seekerId: String? = nil
  var startTime: HFTimestamp? = nil
  var endTime: HFTimestamp? = nil
  var scheduledStartTime: HFTimestamp? = nil
  var seekerNames: String?=nil
  var comments:String?=nil
  var meansThroughWhichSittingGiven:Int32? = 0
  
  init() {
    
  }

}

struct AvailabilityStatusChangeResponse: Codable {
  
  var success: Bool? = false
  var ongoingSession: Bool? = false
  
}


struct PreceptorMetrics: Codable {
  
  var noOfPreceptorsOnline: Int? = 0

  var noOfPreceptorsFree: Int? = 0

  var noOfSittingsInProgress: Int? = 0

  var noOfPendingSeekerRequests: Int? = 0

  var noOfSeekersTakingSitting: Int? = 0

  var noOfSeekersWaitingForSitting: Int? = 0

  var noOfSittingsCompleted: Int? = 0
  
  var noOfSittingsCompletedLastUpdatedTimestamp: HFTimestamp? = nil
}

struct DiaryEntryList: Codable {
  var nextPageToken: Int32? = nil
  var previousPageToken: Int32? = nil
  var diaryEntryList: [DiaryEntry]? = nil
  init() {
    diaryEntryList = [DiaryEntry]()
  }

}

struct DiaryEntry: Codable {
  var id: String? = nil
  var userId: String? = nil
  var entryTime: HFTimestamp? = nil
  var text: String? = nil
  var meditationSessionId: String? = nil
  var moodRating: Int? = 0
  init() {
    
  }
}

struct GetUserSessionsRequest: Codable {
  
  var userId: String? = nil
  var pageToken: Int32? = nil
  var from: HFTimestamp? = nil
  var to: HFTimestamp? = nil 
  var pageSize: Int32? = nil
  var sittingType: Int32? = nil
  var sittingAppType: Int32? = 0

  init() {

  }
}
struct PreceptorReportRequest: Codable {
  var preceptorId: String? = nil
  var from: HFTimestamp? = nil
  var to: HFTimestamp? = nil
  var email: String? = nil
  var timeZoneId: String? = nil
  var sittingAppType: Int32? = 0
  init() {
    
  }
}

struct MeditationSessionList: Codable {
  
  var meditationSessions: [MeditationSession]? = nil
  var previousPageToken: Int32? = nil
  var nextPageToken: Int32? = nil
  var totalSessions: Int32? = nil
  var totalSeekers: Int32? = nil


  init() {
        meditationSessions = [MeditationSession]()

  }
}

struct GetDiaryEntryBySessionIdRequest: Codable {
  
  var userId: String? = nil
  var meditationSessionId: String? = nil
  init() {

  }
}
struct SaveSittingsGivenWithoutUsingAppRequest: Codable {
  
  var preceptorId: String? = nil
  var date: String? = nil 
  var time: String? = nil 
  var noOfPeople: Int32? = nil
  var seekerInfo: [SeekerInfo]? = nil
  var comments: String? = nil
  var sittingAppType: Int? = 0
  var timeZoneId: String? = nil

  init() {

  }
}

struct SittingGivenCountResponse: Codable {

var heartsapp: Int? = 0
var withoutUsingApp: Int? = 0

init() {}
}


struct SeekerInfoResponse: Codable {
  
  var seekerInfo: [SeekerInfo]?
  var previousPageToken: Int32?
  var nextPageToken: Int32?
  init() {}
}

struct SeekerInfo: Codable {
  
  var seekerId: String?
  var seekerName: String?
  var email:String?
  
  init() {}
}
