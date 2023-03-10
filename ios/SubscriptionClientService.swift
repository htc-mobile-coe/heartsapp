//
//  SubscriptionClientService.swift
//  heartsapp
//
//  Created by Yogesh Pandey on 22/01/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

import SwiftyJSON

@objc(SubscriptionService)
class SubscriptionClientService: NSObject {
  
  var bridge: RCTBridge!
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
    }
  
  @objc func submitFeedbackToHelpDesk(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("submitFeedbackToHelpDesk $$$$$$ : \(input)")
    do {
      let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
      let json = try JSON(data: jsonData!)
      let feedbackMessageString = json["message"].stringValue
      let feedbackData = feedbackMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let feedbackJson = try JSON(data: feedbackData!)
      
      let feedbackRequest = SubscriptionClientService.createSubmitFeedbackRequest(idToken: feedbackJson["firebaseIdToken"].stringValue, feedbackJson: feedbackJson)
      
      SubscriptionClientService.submitFeedbackToHelpDesk(for: feedbackRequest , completion: {
        success, error in
        print("submitFeedbackToHelpDesk succeeded: \(success)")
        if error != nil {
          reject("error during submitFeedbackToHelpDesk","", error)
        } else {
          resolve(true)
        }
      })
    }catch {
      reject("error during submitFeedbackToHelpDesk","", error)
    }
    
  }
  
  
  //TODO: see if a private pool can be implemented
  private static var subscriptionClient = Platform_Subscription_SubscriptionService.init(host: Environment.current.subscriptionService)
  
  private static func getAuthenticatedClient(completion: @escaping (_ profileServiceClient: Platform_Subscription_SubscriptionService) -> Void) {
    //TODO: what check to perform for validity of profile client
    completion(subscriptionClient)
    
  }
  
  static func submitFeedbackToHelpDesk(for request: Platform_Subscription_SubmitFeedbackRequest, completion: @escaping (_ done: Bool?,  _ error: Error?) -> Void) {
    getAuthenticatedClient { client in
      do {
        print(request)
        var rpc : GRPCProtoCall!
        _ = rpc = try client.rpcToSubmitFeedback(with: request, handler: { response, error in
          guard  response != nil else {
            completion(false, error)
            return
          }
          completion(true, nil)
          
        })
        
        rpc.start()
      } catch {
        print(error)
        completion(false, error)
      }
    }
  }
  
  
  
  static func createSubmitFeedbackRequest(idToken: String, feedbackJson: JSON) -> Platform_Subscription_SubmitFeedbackRequest {
    
    let request = Platform_Subscription_SubmitFeedbackRequest()
    
    request.userId = feedbackJson["uId"].stringValue
    request.comments = feedbackJson["comments"].stringValue
    request.priorityOptionId = "4"
    request.problemTypeOptionId = "9"
    return request
  }
  
}

