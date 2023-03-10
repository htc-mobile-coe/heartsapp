//
//  ServiceUtil.swift
//  heartsapp
//
//  Created by Ashima Sharma on 12/15/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import SwiftyJSON

class ServiceUtil {
  
  private static var authToken: String!
  private static var callOptions: GRPCMutableCallOptions!
  public static let FIREBASE_ID_TOKEN = "firebaseIdToken"
  public static let FIREBASE_ID = "firebaseId"
  
  public static func setAuthOptions(authToken: String) {
    let token = "Bearer " + authToken
    ServiceUtil.authToken = token
    
    ServiceUtil.callOptions = GRPCMutableCallOptions()
    callOptions.initialMetadata = ["authorization": ServiceUtil.authToken as Any]
  }
  
  public static func addAuthHeader(authToken: String, rpc: GRPCCall) {
    let token = "Bearer " + authToken
    ServiceUtil.authToken = token
    ServiceUtil.callOptions = GRPCMutableCallOptions()
    callOptions.initialMetadata = ["authorization": ServiceUtil.authToken as Any]
    rpc.requestHeaders["authorization"] = token
  }
  
  public static func getAuthOptions() -> GRPCMutableCallOptions {
    return callOptions
  }
  
  public static func buildErrorResponse() -> Dictionary<String, String> {
    return [String: String]()
  }
  
  public static func getFirebaseToken(requestDictionary: NSDictionary) -> String {
    
    return requestDictionary.value(forKey: FIREBASE_ID_TOKEN) as! String
  }
  
  public static func decodeJsonInput(input: NSDictionary) -> Dictionary<String, String> {
    
    do {
      var requestDictionary = [String: String]()
      let jsonData = try JSONSerialization.data(withJSONObject: input, options: [])
      
      let json = try JSON(data: jsonData)
      
      let messageString = json["message"].stringValue
      if messageString != "" && messageString != nil {
        let messageData = messageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
        let messageJson = try JSON(data: messageData!)
        
        
        for (key, object) in messageJson {
          requestDictionary[key] = object.stringValue
        }
      }
      requestDictionary[FIREBASE_ID_TOKEN] = json["firebaseIdToken"].stringValue
      requestDictionary[FIREBASE_ID] = json["firebaseId"].stringValue
      return requestDictionary
      
    } catch  {
      print("Error in decodeJsonInput: \(error)")
    }
    return [String: String]()
  }
  
}
