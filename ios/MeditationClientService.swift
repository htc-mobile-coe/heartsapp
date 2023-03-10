//
//  MeditationClientService.swift
//  heartsapp
//
//  Created by havarma on 09/12/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import SwiftyJSON


@objc(MeditationService)
class MeditationClientService: RCTEventEmitter, GRPCProtoResponseHandler {
  
  let seekerSingleDispatcher = DispatchQueue(label: "SeekerProcessor")
  var dispatchQueue: DispatchQueue {
    return seekerSingleDispatcher
  }
  var seekerStreamingRpc : GRPCStreamingProtoCall!
  var preceptorStreamingRpc : GRPCStreamingProtoCall!
  @objc override static func requiresMainQueueSetup() -> Bool {
      return false
    }
  override func supportedEvents() -> [String]! {
    return ["SeekerSessionStreamingOnNext", "SeekerSessionStreamingOnError", "SeekerSessionStreamingOnCompleted", "PreceptorSessionStreamingOnNext", "PreceptorSessionStreamingOnError", "PreceptorSessionStreamingOnCompleted"]
  }
  
  @objc func isAnyPendingSeekerSessionRequest(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("isAnyPendingSeekerSessionRequest $$$$$$ : \(input)")
    
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      let gpbString = GPBStringValue.init()
      gpbString.value = requestDictionary[ServiceUtil.FIREBASE_ID]
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToIsAnyPendingSeekerSessionRequest(withRequest: gpbString, handler: {success, error in
          if error != nil {
            reject("error during isAnyPendingSeekerSessionRequest","", error)
          } else {
            resolve(success?.value)
          }
          
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in isAnyPendingSeekerSessionRequest: \(error)")
        reject("error during isAnyPendingSeekerSessionRequest","", error)
      }
    }
  }
  
  
  @objc func getMeditationSession(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("getMeditationSession $$$$$$ : \(input)")
    
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      let gpbString = GPBStringValue.init()
      gpbString.value = requestDictionary["sessionId"]
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToGetMeditationSession(withRequest: gpbString, handler: {session, error in
          if error != nil {
            reject("error during getMeditationSession","", error)
          } else {
            resolve(self.buildMeditationSession(session: session!))
          }
          
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        
      }
    }
  }
  
  @objc func startSeekerSessionStreaming(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("startSeekerSessionStreaming String $$$$$$ : \(input)")
    startSeekerSession()
    sendSeekerRequest(input: input)//send INIT
    MeditationSessionStreamManager.shared.seekerStreamingInProgress = true
    resolve(true)
  }
  
  @objc func sendSeekerSessionStreamingCommand(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("sendSeekerSessionStreamingCommand  $$$$$$ : \(input)")
    if MeditationSessionStreamManager.shared.seekerStreamingInProgress {
      sendSeekerRequest(input: input)
    }
    resolve(MeditationSessionStreamManager.shared.seekerStreamingInProgress)
  }
  
  func didReceiveProtoMessage(_ message: GPBMessage?) {
    print("incoming Response: \(message)")
    if let incomingMessage = message as? Platform_Meditation_SeekerResponse {
      let responseJson = buildSeekerResponseJson(message: incomingMessage)
      var responseDictionary = [String: Any]()
      responseDictionary["message"] = responseJson
      print("outgoingresponse: ### \(responseDictionary)")
      sendEvent(withName: "SeekerSessionStreamingOnNext", body: responseDictionary)
    }
    else {
      let incomingMessage = message as! Platform_Meditation_PreceptorResponse
      let responseJson = buildPreceptorResponseJson(message: incomingMessage)
      var responseDictionary = [String: Any]()
      responseDictionary["message"] = responseJson
      
      sendEvent(withName: "PreceptorSessionStreamingOnNext", body: responseDictionary)
    }
    
    
    
  }
  
  func didClose(withTrailingMetadata trailingMetadata: [AnyHashable : Any]?, error: Error?) {
    print("🛑🛑🛑 error: \(String(describing: error))")
  }
  
  @objc func closeSeekerSessionStreaming(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("closeSeekerSessionStreaming String $$$$$$ : \(input)")
    MeditationSessionStreamManager.shared.seekerStreamingInProgress = false
    if seekerStreamingRpc != nil {
      seekerStreamingRpc.finish()
    }
    resolve(true)
  }
  
  @objc func seekerSeekNow(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("seekerSeekNow $$$$$$ : \(input)")
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToSeekerSeekNow(with: self.buildSeekerRequest(input: requestDictionary), handler: { response, error in
          if error != nil {
            reject("error during seekerSeekNow","", error)
          } else {
            resolve(self.buildSeekerResponseJson(message: response!))
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in seekerSeekNow: \(error)")
      }
      
    }
  }
  
  @objc func seekerClose(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("seekerClose $$$$$$ : \(input)")
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToSeekerClose(with: self.buildSeekerRequest(input: requestDictionary), handler: { response, error in
          if error != nil {
            reject("error during seekerClose","", error)
          } else {
            resolve(self.buildSeekerResponseJson(message: response!))
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in seekerClose: \(error)")
      }
    }
  }

  @objc func seekerExitSession(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("seekerExitSession $$$$$$ : \(input)")
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToSeekerExitSession(with: self.buildSeekerRequest(input: requestDictionary), handler: { response, error in
          if error != nil {
            reject("error during seekerExitSession","", error)
          } else {
            resolve(response?.value)
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in seekerExitSession: \(error)")
      }
    }
  }
  
  @objc func getPreceptorSittingCount(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock) {
    print("Input is : ", input);
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      let gpbString = GPBStringValue.init()
      gpbString.value = requestDictionary[ServiceUtil.FIREBASE_ID]
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToGetPreceptorSittingCount(withRequest: gpbString, handler: { response, error in
          if error != nil {
            reject("error during getPreceptorSittingCount","", error)
          } else {
            resolve(response?.value)
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in getPreceptorSittingCount: \(error)")
      }
    }
  }

  @objc func getSittingsGivenCount(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock) {
    print("Input is : ", input);
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      let gpbString = GPBStringValue.init()
      gpbString.value = requestDictionary[ServiceUtil.FIREBASE_ID]
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToGetSittingsGivenCount(withRequest: gpbString, handler: { response, error in
          if error != nil {
            reject("error during getSittingsGivenCount","", error)
          } else {
            resolve(self.buildSittingGivenCountResponse(response:response!))
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in getSittingsGivenCount: \(error)")
      }
    }
  }
  
  @objc func getSeekerSittingCount(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock) {
    print("Input is : ", input);
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      let gpbString = GPBStringValue.init()
      gpbString.value = requestDictionary[ServiceUtil.FIREBASE_ID]
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToGetSeekerSittingCount(withRequest: gpbString, handler: { response, error in
          if error != nil {
            reject("error during getSeekerSittingCount","", error)
          } else {
            resolve(response?.value)
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in getSeekerSittingCount: \(error)")
      }
    }
  }
  
  private func startSeekerSession() {
    
    MeditationClientService.getAuthenticatedClient { client in
      
      self.seekerStreamingRpc = client.seekerSession(with: self, callOptions: ServiceUtil.getAuthOptions())
      self.seekerStreamingRpc.start()
    }
  }
  
  private func startPreceptorSession() {
    
    MeditationClientService.getAuthenticatedClient { client in
      
      self.preceptorStreamingRpc = client.preceptorSession(with: self, callOptions: ServiceUtil.getAuthOptions())
      self.preceptorStreamingRpc.start()
    }
  }
  
  private func sendSeekerRequest(input: NSDictionary) -> Void {
    let requestInput = ServiceUtil.decodeJsonInput(input: input)
    seekerStreamingRpc.write(buildSeekerRequest(input: requestInput))
  }
  
  private func sendPreceptorRequest(input: NSDictionary) -> Void {
    let requestInput = ServiceUtil.decodeJsonInput(input: input)
    preceptorStreamingRpc.write(buildPreceptorRequest(input: requestInput))
  }
  
  private func buildSeekerRequest(input: Dictionary<String, String>) -> Platform_Meditation_SeekerRequest {
    let seekerRequest = Platform_Meditation_SeekerRequest()
    seekerRequest.command = resolveRequestCommand(command: input["command"] ?? "INIT")
    seekerRequest.deviceId = input["deviceId"]
    seekerRequest.meditationSessionId = input["meditationSessionId"]
    if let addlSeekers = input["noOfAdditionalSeekers"] {
      seekerRequest.noOfAdditionalSeekers = Int32(addlSeekers) ?? 0
    }
    seekerRequest.seekerId = input["seekerId"]
    seekerRequest.version = input["version"]
    print("Seeker request : \(seekerRequest)")
    return seekerRequest
  }
  
  
  private func resolveRequestCommand(command: String) -> Platform_Meditation_SittingCommand {
    switch command {
    case "INIT":
      return Platform_Meditation_SittingCommand.`init`
    case "READY":
      return Platform_Meditation_SittingCommand.ready
    case "HEARTBEAT":
      return Platform_Meditation_SittingCommand.heartBeat
    case "SEEKERSTART":
      return Platform_Meditation_SittingCommand.seekerStart
    case "SEEKERCOMPLETE":
      return Platform_Meditation_SittingCommand.seekerComplete
    case "HEART_BEAT":
      return Platform_Meditation_SittingCommand.heartBeat
    case "COMPLETE":
      return Platform_Meditation_SittingCommand.complete
    case "PRECEPTOR_START":
      return Platform_Meditation_SittingCommand.preceptorStart
    case "PRECEPTOR_CANCEL":
      return Platform_Meditation_SittingCommand.preceptorCancel
    case "PRECEPTOR_START_MEDITATION":
      return Platform_Meditation_SittingCommand.preceptorStartMeditation
    case "PRECEPTOR_COMPLETE_MEDITATION":
      return Platform_Meditation_SittingCommand.preceptorCompleteMeditation
    case "PRECEPTOR_COMPLETE":
      return Platform_Meditation_SittingCommand.preceptorComplete
    default:
      return Platform_Meditation_SittingCommand.heartBeat
    }
  }
  
  private func buildSeekerResponseJson(message: Platform_Meditation_SeekerResponse) -> String {
    let keyValues = message.dictionaryWithValues(forKeys: ["stateTransitionTime", "session", "status", "seekerId"])
    var response = SeekerResponse()
    response.stateTransitionTime = keyValues["stateTransitionTime"] as? Int
    response.seekerId = (keyValues["seekerId"] as! String)
    response.status = (keyValues["status"] as! Int)
    let meditationSession = keyValues["session"] as! Platform_Meditation_MeditationSession
    var sessionStruct = MeditationSession()
    sessionStruct.batchSitting = meditationSession.batchSitting
    sessionStruct.sessionId = meditationSession.sessionId
    sessionStruct.preceptorId = meditationSession.preceptorId
    sessionStruct.seekerId = meditationSession.seekerId
    sessionStruct.state = Int(meditationSession.state.rawValue)
    sessionStruct.preceptorName = meditationSession.preceptorName
    sessionStruct.totalSeekers = Int(meditationSession.totalSeekers)
    sessionStruct.state = Int(meditationSession.state.rawValue)
    
    sessionStruct.startTime = meditationSession.startTime == nil ? nil: HFTimestamp(seconds: meditationSession.startTime.seconds)
    sessionStruct.endTime = meditationSession.endTime == nil ? nil: HFTimestamp(seconds: meditationSession.endTime.seconds)
    sessionStruct.scheduledStartTime = meditationSession.scheduledStartTime == nil ? nil: HFTimestamp(seconds: meditationSession.scheduledStartTime.seconds)
    
    response.session = sessionStruct
    
    
    let jsonData = try! JSONEncoder().encode(response)
    let jsonString = String(data: jsonData, encoding: .utf8)!
    print(jsonString)
    return jsonString
  }
  
  private func buildSittingGivenCountResponse(response: Platform_Meditation_SittingGivenCountResponse) -> String {
    var sittingGivenCountResponse = SittingGivenCountResponse()
    sittingGivenCountResponse.heartsapp = Int(response.heartsapp)
    sittingGivenCountResponse.withoutUsingApp = Int(response.withoutUsingApp)
    
    let jsonData = try! JSONEncoder().encode(sittingGivenCountResponse)
    let sittingGivenCountResponseJson = String(data: jsonData, encoding: .utf8)!
    print("preceptorSittingCountResponsejson: \(sittingGivenCountResponseJson)")
    return sittingGivenCountResponseJson
  }
  
  private func buildPreceptorResponseJson(message: Platform_Meditation_PreceptorResponse) -> String {
    let keyValues = message.dictionaryWithValues(forKeys: ["stateTransitionTime", "session", "status", "preceptorId"])
    var response = PreceptorResponse()
    response.stateTransitionTime = keyValues["stateTransitionTime"] as? Int
    response.preceptorId = (keyValues["preceptorId"] as? String)
    response.status = (keyValues["status"] as? Int)
    let meditationSession = keyValues["session"] as! Platform_Meditation_MeditationSession
    var sessionStruct = MeditationSession()
    sessionStruct.batchSitting = meditationSession.batchSitting
    sessionStruct.sessionId = meditationSession.sessionId
    sessionStruct.state = Int(meditationSession.state.rawValue)
    sessionStruct.preceptorName = meditationSession.preceptorName
    sessionStruct.totalSeekers = Int(meditationSession.totalSeekers)
    
    sessionStruct.startTime = meditationSession.startTime == nil ? nil: HFTimestamp(seconds: meditationSession.startTime.seconds)
      sessionStruct.endTime = meditationSession.endTime == nil ? nil: HFTimestamp(seconds: meditationSession.endTime.seconds)
      sessionStruct.scheduledStartTime = meditationSession.scheduledStartTime == nil ? nil: HFTimestamp(seconds: meditationSession.scheduledStartTime.seconds)
      response.session = sessionStruct

    let jsonData = try! JSONEncoder().encode(response)
    let jsonString = String(data: jsonData, encoding: .utf8)!
    print(jsonString)
    return jsonString
  }
  
  
  
  private func buildPreceptorRequest(input: Dictionary<String, String>) -> Platform_Meditation_PreceptorRequest {
    
    let preceptorRequest = Platform_Meditation_PreceptorRequest()
    preceptorRequest.command = resolveRequestCommand(command: input["command"] ?? "INIT")
    preceptorRequest.deviceId = input["deviceId"]
    preceptorRequest.meditationSessionId = input["meditationSessionId"]
    
    preceptorRequest.preceptorId = input["preceptorId"]
    preceptorRequest.version = input["version"]
    print("Preceptor request : \(preceptorRequest)")
    return preceptorRequest
  }
  
  private static var meditationClient = Platform_Meditation_MeditationService.init(host: Environment.current.meditationService)
  
  private static func getAuthenticatedClient(completion: @escaping (_ meditationClient: Platform_Meditation_MeditationService) -> Void) {
    //TODO: what check to perform for validity of meditation client
    completion(meditationClient)
  }
  
  @objc func getExistingSessionByUser(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("getExistingSessionByUser $$$$$$ : \(input)")
    
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      let gpbString = GPBStringValue.init()
      gpbString.value = requestDictionary[ServiceUtil.FIREBASE_ID]
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToGetExistingSessionByUser(withRequest: gpbString, handler: {session, error in
          if error != nil {
            reject("error during getExistingSessionByUser","", error)
          } else {
            resolve(self.buildMeditationSession(session: session!))
          }
          
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in getExistingSessionByUser: \(error)")
      }
    }
  }
  
  private func buildMeditationSession(session: Platform_Meditation_MeditationSession) -> String {
    var meditationSession = MeditationSession()
    meditationSession.batchSitting = session.batchSitting
    meditationSession.sessionId = session.sessionId
    meditationSession.preceptorId = session.preceptorId
    meditationSession.seekerId = session.seekerId
    meditationSession.totalSeekers = Int(session.totalSeekers)
    meditationSession.state = Int(session.state.rawValue)
    meditationSession.startTime = session.startTime == nil ? nil: HFTimestamp(seconds: session.startTime.seconds)
    meditationSession.endTime = session.endTime == nil ? nil: HFTimestamp(seconds: session.endTime.seconds)
    meditationSession.scheduledStartTime = session.scheduledStartTime == nil ? nil: HFTimestamp(seconds: session.scheduledStartTime.seconds)
    
    let jsonData = try! JSONEncoder().encode(meditationSession)
    let jsonString = String(data: jsonData, encoding: .utf8)!
    print("getExistingSessionByUser $$$$: \(jsonString)")
    return jsonString
  }
  
  @objc func getOnlineMetrics(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("getOnlineMetrics $$$$$$ : \(input)")
    
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      let onlineMetrics = Platform_Meditation_OnlineMetrics.init()
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToGetOnlineMetrics(withRequest: onlineMetrics, handler: {metrics, error in
          if error != nil {
            reject("error during getOnlineMetrics","", error)
          } else {
            resolve(self.buildMetrics(metrics: metrics!))
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in getOnlineMetrics: \(error)")
      }
    }
  }
  
  private func buildMetrics(metrics: Platform_Meditation_OnlineMetrics) -> String {
    var preceptorMetrics = PreceptorMetrics()
    preceptorMetrics.noOfPendingSeekerRequests = Int(metrics.noOfPendingSeekerRequests)
    preceptorMetrics.noOfPreceptorsFree = Int(metrics.noOfPreceptorsFree)
    preceptorMetrics.noOfPreceptorsOnline = Int(metrics.noOfPreceptorsOnline)
    preceptorMetrics.noOfSittingsInProgress = Int(metrics.noOfSittingsInProgress)
    preceptorMetrics.noOfSeekersTakingSitting = Int(metrics.noOfSeekersTakingSitting)
    preceptorMetrics.noOfSeekersWaitingForSitting = Int(metrics.noOfSeekersWaitingForSitting)
    preceptorMetrics.noOfSittingsCompleted = Int(metrics.noOfSittingsCompleted)
    preceptorMetrics.noOfSittingsCompletedLastUpdatedTimestamp = HFTimestamp(seconds: metrics.noOfSittingsCompletedLastUpdatedTimestamp.seconds)
    
    let jsonData = try! JSONEncoder().encode(preceptorMetrics)
    let jsonString = String(data: jsonData, encoding: .utf8)!
    print(jsonString)
    return jsonString
  }
  
  @objc func getPreceptorAvailabilityStatus(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("getPreceptorAvailabilityStatus $$$$$$ : \(input)")
    
    
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      do {
        let gpbString = GPBStringValue.init()
        gpbString.value = requestDictionary[ServiceUtil.FIREBASE_ID]
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToGetPreceptorAvailabilityStatus(withRequest: gpbString, handler: {available, error in
          if error != nil {
            reject("error during getPreceptorAvailabilityStatus","", error)
          } else {
            resolve(available?.value)
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in getPreceptorAvailabilityStatus: \(error)")
      }
    }
    
  }
  
  @objc func updatePreceptorAvailabilityStatus(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("updatePreceptorAvailabilityStatus $$$$$$ : \(input)")
    
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      
      let availabilityStatusRequest = Platform_Meditation_AvailabilityStatusChangeRequest.init()
      availabilityStatusRequest.preceptorId = requestDictionary["preceptorId"]
      let status = NSString(string: requestDictionary["status"] ?? "false")
      availabilityStatusRequest.status = status.boolValue
      
      availabilityStatusRequest.timeZoneId = TimeZone.current.identifier
      do {
        
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToUpdatePreceptorAvailabilityStatus(with: availabilityStatusRequest, handler: {response, error in
          if error != nil {
            reject("error during updatePreceptorAvailabilityStatus","", error)
          } else {
            //          var responseDictionary = [String: Any]()
            //          responseDictionary["message"] = response
            resolve(self.buildAvailableStatusChangeResponse(response: response!))
          }
          
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in updatePreceptorAvailabilityStatus: \(error)")
      }
      
    }
  }
  
  private func buildAvailableStatusChangeResponse(response: Platform_Meditation_AvailabilityStatusChangeResponse) -> String {
    
    var preceptorAvailabilityStatusResponse = AvailabilityStatusChangeResponse()
    preceptorAvailabilityStatusResponse.success = response.success
    preceptorAvailabilityStatusResponse.ongoingSession = response.ongoingSession
    
    let jsonData = try! JSONEncoder().encode(preceptorAvailabilityStatusResponse)
    let jsonString = String(data: jsonData, encoding: .utf8)!
    print(jsonString)
    return jsonString
  }
  
  @objc func preceptorAccept(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("preceptorAccept $$$$$$ : \(input)")
    
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToPreceptorAccept(with: self.buildPreceptorRequest(input: requestDictionary), handler: {response, error in
          if error != nil {
            reject("error during preceptorAccept","", error)
          } else {
            //            var responseDictionary = [String: Any]()
            //            responseDictionary["message"] = response
            resolve(self.buildPreceptorResponseJson(message: response!))
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in preceptorAccept: \(error)")
      }
      
    }
  }
  
  @objc func preceptorCancel(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("preceptorCancel $$$$$$ : \(input)")
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToPreceptorCancel(with: self.buildPreceptorRequest(input: requestDictionary), handler: {response, error in
          if error != nil {
            reject("error during preceptorCancel","", error)
          } else {
            //            var responseDictionary = [String: Any]()
            //            responseDictionary["message"] = response
            resolve(self.buildPreceptorResponseJson(message: response!))
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in preceptorCancel: \(error)")
      }
    }
  }
  
  @objc func preceptorStartMeditation(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("preceptorStartMeditation $$$$$$ : \(input)")
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToPreceptorStartMeditation(with: self.buildPreceptorRequest(input: requestDictionary), handler: {response, error in
          if error != nil {
            reject("error during preceptorStartMeditation","", error)
          } else {
            //               var responseDictionary = [String: Any]()
            //               responseDictionary["message"] = response
            resolve(self.buildPreceptorResponseJson(message: response!))
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in preceptorStartMeditation: \(error)")
      }
      
    }
  }
  
  @objc func preceptorEndMeditation(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("preceptorEndMeditation $$$$$$ : \(input)")
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToPreceptorEndMeditation(with: self.buildPreceptorRequest(input: requestDictionary), handler: {response, error in
          if error != nil {
            reject("error during preceptorEndMeditation","", error)
          } else {
            //            var responseDictionary = [String: Any]()
            //            responseDictionary["message"] = response
            resolve(self.buildPreceptorResponseJson(message: response!))
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in preceptorEndMeditation: \(error)")
      }
    }
  }
  
  @objc func updatePreceptorDNDStatus(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("updatePreceptorDNDStatus $$$$$$ : \(input)")
    
    MeditationClientService.getAuthenticatedClient { client in
      do {
        let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
        let json = try JSON(data: jsonData!)
        let dndRequestString = json["message"].stringValue
        let dndRequestData = dndRequestString.data(using: String.Encoding.utf8, allowLossyConversion: false)
        let requestJson = try JSON(data: dndRequestData!)
        print("dndRequestData Json String $$$$$$ : \(requestJson)")
        let dndRequest = MeditationClientService.createDNDRequest(idToken: json["firebaseIdToken"].stringValue, dndRequestJson: requestJson)
        
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToUpdatePreceptorDNDStatus(with: dndRequest, handler: {response, error in
          if error != nil || response?.value == false {
            reject("error during updatePreceptorDNDStatus","", error)
          } else {
            resolve(true)
          }
        })
        
        ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
        rpc.start()
      } catch {
        reject("error during updatePreceptorDNDStatus","", error)
      }
    }
  }
  
  
  @objc func createUpdateDiaryEntry(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("createUpdateDiaryEntry $$$$$$ : \(input)")
    
    MeditationClientService.getAuthenticatedClient { client in
      do {
        let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
        let json = try JSON(data: jsonData!)
        let diaryEntryString = json["message"].stringValue
        let diaryEntryData = diaryEntryString.data(using: String.Encoding.utf8, allowLossyConversion: false)
        let requestJson = try JSON(data: diaryEntryData!)
        print("diaryEntryData Json String $$$$$$ : \(requestJson)")
        let diaryEntryRequest = MeditationClientService.createDiaryEntry(idToken: json["firebaseIdToken"].stringValue, diaryEntryJson: requestJson)
        
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToSaveDiaryEntry(withRequest: diaryEntryRequest, handler: {response, error in
          if error != nil || response?.value == "" {
            reject("error during createUpdateDiaryEntry","", error)
          } else {
            resolve(response?.value)
          }
        })
        
        ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
        rpc.start()
      } catch {
        reject("error during createUpdateDiaryEntry","", error)
      }
    }
  }
  
  @objc func deleteDiaryEntry(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("deleteDiaryEntry $$$$$$ : \(input)")
    
    MeditationClientService.getAuthenticatedClient { client in
      do {
        let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
        let json = try JSON(data: jsonData!)
        let diaryEntryString = json["message"].stringValue
        let diaryEntryData = diaryEntryString.data(using: String.Encoding.utf8, allowLossyConversion: false)
        let requestJson = try JSON(data: diaryEntryData!)
        print("diaryEntryData Json String $$$$$$ : \(requestJson)")
        let diaryEntryRequest = MeditationClientService.createDiaryEntry(idToken: json["firebaseIdToken"].stringValue, diaryEntryJson: requestJson)
        
        var rpc : GRPCProtoCall!
        let gpbString = GPBStringValue.init()
        gpbString.value = diaryEntryRequest.id_p
        rpc = try client.rpcToDeleteDiaryEntry(withRequest: gpbString, handler: {response, error in
          if error != nil || response?.value == false {
            reject("error during deleteDiaryEntry","", error)
          } else {
            resolve(response?.value)
          }
        })
        
        ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
        rpc.start()
      } catch {
        reject("error during deleteDiaryEntry","", error)
      }
    }
  }
  
  
  @objc func getNextDiaryEntries(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("getNextDiaryEntries $$$$$$ : \(input)")
    
    MeditationClientService.getAuthenticatedClient { client in
      do {
        let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
        let json = try JSON(data: jsonData!)
        let getDiaryRequestString = json["message"].stringValue
        let getDiaryRequestData = getDiaryRequestString.data(using: String.Encoding.utf8, allowLossyConversion: false)
        let requestJson = try JSON(data: getDiaryRequestData!)
        print("diaryEntryData Json String $$$$$$ : \(requestJson)")
        let getDiaryRequestRequest = MeditationClientService.createGetDiaryEntriesRequest(idToken: json["firebaseIdToken"].stringValue, getDiaryRequestJson: requestJson)
        
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToGetNextDiaryEntries(with: getDiaryRequestRequest, handler: {response, error in
          if error != nil {
            reject("error during getNextDiaryEntries","", error)
          } else {
            resolve(self.buildDairyEntryList(list: response!))
          }
        })
        
        ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
        rpc.start()
      } catch {
        reject("error during getNextDiaryEntries","", error)
      }
    }
  }
  
  @objc func getPreviousDiaryEntries(
     _ input: NSDictionary,
     resolver resolve: @escaping RCTPromiseResolveBlock,
     rejecter reject: @escaping RCTPromiseRejectBlock)  {
     print("getPreviousDiaryEntries $$$$$$ : \(input)")
     
     MeditationClientService.getAuthenticatedClient { client in
       do {
         let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
         let json = try JSON(data: jsonData!)
         let getDiaryRequestString = json["message"].stringValue
         let getDiaryRequestData = getDiaryRequestString.data(using: String.Encoding.utf8, allowLossyConversion: false)
         let requestJson = try JSON(data: getDiaryRequestData!)
         print("diaryEntryData Json String $$$$$$ : \(requestJson)")
         let getDiaryRequestRequest = MeditationClientService.createGetDiaryEntriesRequest(idToken: json["firebaseIdToken"].stringValue, getDiaryRequestJson: requestJson)
         
         var rpc : GRPCProtoCall!
         rpc = try client.rpcToGetPreviousDiaryEntries(with: getDiaryRequestRequest, handler: {response, error in
           if error != nil {
             reject("error during getPreviousDiaryEntries","", error)
           } else {
             resolve(self.buildDairyEntryList(list: response!))
           }
         })
         
         ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
         rpc.start()
       } catch {
         reject("error during getPreviousDiaryEntries","", error)
       }
     }
   }
  
  @objc func preceptorClose(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("preceptorClose $$$$$$ : \(input)")
    let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
    MeditationClientService.getAuthenticatedClient { client in
      
      do {
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToPreceptorClose(with: self.buildPreceptorRequest(input: requestDictionary), handler: {response, error in
          if error != nil {
            reject("error during preceptorClose","", error)
          } else {
            //            var responseDictionary = [String: Any]()
            //            responseDictionary["message"] = response
            resolve(self.buildPreceptorResponseJson(message: response!))
          }
        })
        ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
        rpc.start()
      } catch {
        print("Error in preceptorClose: \(error)")
      }
    }
  }
  
  @objc func startPreceptorSessionStreaming(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("startPreceptorSessionStreaming $$$$$$ : \(input)")
    startPreceptorSession()
    sendPreceptorRequest(input: input)//send INIT
    resolve(true)
  }
  
  @objc func sendPreceptoSessionStreamingCommand(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("sendPreceptoSessionStreamingCommand $$$$$$ : \(input)")
    sendPreceptorRequest(input: input)
    resolve(true)
  }
  
  @objc func closePreceptorSessionStreaming(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("closePreceptorSessionStreaming command received $$$$$$ : \(input)")
    if preceptorStreamingRpc != nil {
      print("closing PreceptorSessionStreaming")
      preceptorStreamingRpc.finish()
    }
    resolve(true)
  }
  @objc func preceptorReport(
      _ input: NSDictionary,
      resolver resolve: @escaping RCTPromiseResolveBlock,
      rejecter reject: @escaping RCTPromiseRejectBlock)  {
      print("preceptorHistory $$$$$$ : \(input)")
      let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
      MeditationClientService.getAuthenticatedClient { client in
        
        do {
          let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
          let json = try JSON(data: jsonData!)
          let preceptorReportString = json["message"].stringValue
          let preceptorReportData = preceptorReportString.data(using: String.Encoding.utf8, allowLossyConversion: false)
          let requestJson = try JSON(data: preceptorReportData!)
          let preceptorReportRequest = MeditationClientService.buildPreceptorHistory( preceptorReportRequestJson: requestJson)
          var rpc : GRPCProtoCall!
          rpc = try client.rpcToPreceptorReport(with: preceptorReportRequest, handler: {response, error in
            if error != nil {
              reject("error during preceptorHistory","", error)
            } else {
              resolve(response?.value)
            }
          })
          ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
          rpc.start()
        } catch {
          print("Error in preceptorEndMeditation: \(error)")
        }
      }
    }

  @objc func saveSittingsGivenWithoutUsingApp(
     _ input: NSDictionary,
      resolver resolve: @escaping RCTPromiseResolveBlock,
      rejecter reject: @escaping RCTPromiseRejectBlock)  {
      print("saveSittingsGivenWithoutUsingApp $$$$$$ : \(input)")
      let requestDictionary = ServiceUtil.decodeJsonInput(input: input)
      MeditationClientService.getAuthenticatedClient { client in
        
        do {
          let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
          let json = try JSON(data: jsonData!)
          let saveSittingsGivenWithoutUsingAppString = json["message"].stringValue
          let saveSittingsGivenWithoutUsingAppData = saveSittingsGivenWithoutUsingAppString.data(using: String.Encoding.utf8, allowLossyConversion: false)
          let requestJson = try JSON(data: saveSittingsGivenWithoutUsingAppData!)
          let saveSittingsGivenWithoutUsingAppRequest = MeditationClientService.buildSaveSittingsGivenWithoutUsingApp( requestJSON: requestJson)
          print("reqqqqqq",saveSittingsGivenWithoutUsingAppRequest);
          var rpc : GRPCProtoCall!
          rpc = try client.rpcToSaveSittingsGivenWithoutUsingApp(with: saveSittingsGivenWithoutUsingAppRequest, handler: {response, error in
            if error != nil {
              reject("error during saveSittingsGivenWithoutUsingApp","", error)
            } else {
              resolve(response?.value)
            }
          })
          ServiceUtil.addAuthHeader(authToken: requestDictionary[ServiceUtil.FIREBASE_ID_TOKEN] ?? "", rpc: rpc)
          rpc.start()
        } catch {
          print("Error in saveSittingsGivenWithoutUsingApp: \(error)")
        }
      }
    }
  
  private static func createDNDRequest(idToken: String, dndRequestJson: JSON) -> Platform_Meditation_PreceptorDNDRequest {
    
    let request = Platform_Meditation_PreceptorDNDRequest()
    
    request.preceptorId = dndRequestJson["preceptorId"].stringValue
    request.dndDurationInSeconds = dndRequestJson["dndDurationInSeconds"].int32Value
    request.deviceId = UIDevice.current.identifierForVendor?.uuidString
    
    return request
  }
  
  private static func createDiaryEntry(idToken: String, diaryEntryJson: JSON) -> Platform_Meditation_DiaryEntry {
    
    let request = Platform_Meditation_DiaryEntry()
    
    request.userId = diaryEntryJson["userId"].stringValue
    request.id_p = diaryEntryJson["id"].stringValue
    request.text = diaryEntryJson["text"].stringValue
    request.entryTime = GPBTimestamp()
    request.entryTime.seconds = diaryEntryJson["entryTime"]["seconds"].int64Value
    request.meditationSessionId = diaryEntryJson["meditationSessionId"].stringValue
    request.moodRating = Platform_Meditation_Rating.init(rawValue: diaryEntryJson["moodRating"].int32Value) ?? Platform_Meditation_Rating.nothing
  
    return request
  }
  
  
  private static func createGetDiaryEntriesRequest(idToken: String, getDiaryRequestJson: JSON) -> Platform_Meditation_GetDiaryEntriesRequest {
    
    let request = Platform_Meditation_GetDiaryEntriesRequest()
    
    request.userId = getDiaryRequestJson["userId"].stringValue
    request.pageSize = getDiaryRequestJson["pageSize"].int32Value
    request.pageToken = getDiaryRequestJson["pageToken"].int32Value
    request.fromTime = GPBTimestamp()
    request.fromTime.seconds = getDiaryRequestJson["fromTime"].int64Value
  
    return request
  }
  
  private func buildDairyEntryList(list: Platform_Meditation_DiaryEntryList) -> String {
     var dairyEntryList = DiaryEntryList()
    dairyEntryList.nextPageToken = list.nextPageToken
    dairyEntryList.previousPageToken = list.previousPageToken
    dairyEntryList.diaryEntryList = [DiaryEntry]()
    for diaryEntryItem in list.diaryEntryArray{
      var diaryEntry = DiaryEntry()
      let entry = diaryEntryItem as? Platform_Meditation_DiaryEntry
      diaryEntry.entryTime = HFTimestamp(seconds: (entry?.entryTime.seconds)!)
      diaryEntry.id = entry?.id_p
      diaryEntry.text = entry?.text
      diaryEntry.userId = entry?.userId
      diaryEntry.meditationSessionId = entry?.meditationSessionId
      diaryEntry.moodRating = Int(entry?.moodRating.rawValue ?? 7)
      dairyEntryList.diaryEntryList?.append(diaryEntry)
    }
    
    let jsonData = try! JSONEncoder().encode(dairyEntryList)
     let jsonString = String(data: jsonData, encoding: .utf8)!
     print("getExistingSessionByUser $$$$: \(jsonString)")
     return jsonString
   }

   private static func createGetUserSessionHistoryRequest(idToken: String, getUserSessionsRequestJson: JSON) -> Platform_Meditation_GetUserSessionsRequest {
    
    let request = Platform_Meditation_GetUserSessionsRequest()
    
    request.userId = getUserSessionsRequestJson["userId"].stringValue
    request.pageToken = getUserSessionsRequestJson["pageToken"].int32Value
    request.from = GPBTimestamp()
    request.from.seconds = getUserSessionsRequestJson["from"]["seconds"].int64Value
    request.to = GPBTimestamp()
    request.to.seconds = getUserSessionsRequestJson["to"]["seconds"].int64Value
    request.pageSize = getUserSessionsRequestJson["pageSize"].int32Value
    request.sittingType = Platform_Meditation_SittingType.init(rawValue: getUserSessionsRequestJson["sittingType"].int32Value) ?? Platform_Meditation_SittingType.other
     
     let meansThroughWhichSittingGivenArray = GPBEnumArray.init()
     getUserSessionsRequestJson["meansThroughWhichSittingGiven"].arrayValue.forEach { item in
       meansThroughWhichSittingGivenArray.addValue(item.int32Value)
     }
     request.meansThroughWhichSittingGivenArray = meansThroughWhichSittingGivenArray;
  
    return request
  }
  private static func createGeSeekrToWhomSittingGivenRequest(requestJson: JSON) -> Platform_Meditation_GetSeekersToWhomSittingIsGivenWithoutUsingAppRequest {
    let request = Platform_Meditation_GetSeekersToWhomSittingIsGivenWithoutUsingAppRequest();
    request.pageToken = requestJson["pageToken"].int32Value;
    request.pageSize = requestJson["pageSize"].int32Value;
    return request;
  }
 private func buildMeditationSessionList(list: Platform_Meditation_MeditationSessionList) -> String {
    var meditationSessionList = MeditationSessionList()
    meditationSessionList.nextPageToken = list.nextPageToken
    meditationSessionList.previousPageToken = list.previousPageToken
    meditationSessionList.totalSessions = list.totalSessions
    meditationSessionList.totalSeekers = list.totalSeekers
    meditationSessionList.meditationSessions = [MeditationSession]()
    
  for meditationSessionItem in list.meditationSessionsArray{
      var meditationSession = MeditationSession()
      let session = meditationSessionItem as! Platform_Meditation_MeditationSession
      meditationSession.batchSitting = session.batchSitting
      meditationSession.sessionId = session.sessionId
      meditationSession.preceptorId = session.preceptorId
      meditationSession.seekerId = session.seekerId
      meditationSession.totalSeekers = Int(session.totalSeekers)
      meditationSession.state = Int(session.state.rawValue)
      meditationSession.startTime = session.startTime == nil ? nil: HFTimestamp(seconds: session.startTime.seconds)
      meditationSession.endTime = session.endTime == nil ? nil: HFTimestamp(seconds: session.endTime.seconds)
      meditationSession.scheduledStartTime = session.scheduledStartTime == nil ? nil: HFTimestamp(seconds: session.scheduledStartTime.seconds)
    meditationSession.seekerNames=session.seekerNames
    meditationSession.comments=session.comments
    meditationSession.meansThroughWhichSittingGiven=session.meansThroughWhichSittingGiven.rawValue
      meditationSessionList.meditationSessions?.append(meditationSession)
    }
    
    let jsonData = try! JSONEncoder().encode(meditationSessionList)
     let jsonString = String(data: jsonData, encoding: .utf8)!
     print("getMeditatonSession $$$$: \(jsonString)")
     return jsonString
   }
  
  private func buildGetSeekersWithoutGivenList(response: Platform_Meditation_SeekerInfoResponse) -> String {
    var seekerInfoResponse = SeekerInfoResponse()
    seekerInfoResponse.nextPageToken = response.nextPageToken
    seekerInfoResponse.previousPageToken = response.previousPageToken
    seekerInfoResponse.seekerInfo = [];
    
    for item in response.seekerInfoArray{
      let seeker = (item as? Platform_Meditation_SeekerInfo)
      var seekerInfo = SeekerInfo()
      seekerInfo.seekerName = seeker?.seekerName
      seekerInfo.seekerId = seeker?.seekerId
      seekerInfo.email = seeker?.email
      seekerInfoResponse.seekerInfo?.append(seekerInfo)
    }
    
    let jsonData = try! JSONEncoder().encode(seekerInfoResponse)
    let jsonString = String(data: jsonData, encoding: .utf8)!
    print("getSeekerInfoResponse $$$$: \(jsonString)")
    return jsonString
  }
  
   @objc func getUserSessionHistory(
      _ input: NSDictionary,
      resolver resolve: @escaping RCTPromiseResolveBlock,
      rejecter reject: @escaping RCTPromiseRejectBlock)  {
      print("getUserSessionHistory $$$$$$ : \(input)")
      MeditationClientService.getAuthenticatedClient { client in

        do {
          let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
          let json = try JSON(data: jsonData!)
          let getUserSessionHistoryString = json["message"].stringValue
          let getUserSessionHistoryData = getUserSessionHistoryString.data(using: String.Encoding.utf8, allowLossyConversion: false)
          let requestJson = try JSON(data: getUserSessionHistoryData!)
          let getUserSessionsRequest = MeditationClientService.createGetUserSessionHistoryRequest( idToken: json["firebaseIdToken"].stringValue, getUserSessionsRequestJson: requestJson)
          var rpc : GRPCProtoCall!
          rpc = try client.rpcToGetUserSessionHistory(with: getUserSessionsRequest, handler: {response, error in
            if error != nil {
              reject("error during getUserSessionHistory","", error)
            } else {
              resolve(self.buildMeditationSessionList(list: response!))
              print("Session history:  getDiaryEntryBySessionId $$$$$$ : \(response)")

            }
          })
          ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
          rpc.start()
        } catch {
          print("Error in getUserSessionHistory: \(error)")
        }
      }
    }
  @objc func getSeekersToWhomSittingIsGivenWithoutUsingApp(
     _ input: NSDictionary,
     resolver resolve: @escaping RCTPromiseResolveBlock,
     rejecter reject: @escaping RCTPromiseRejectBlock)  {
     print("getSeekersToWhomSittingIsGivenWithoutUsingApp $$$$$$ : \(input)")
     MeditationClientService.getAuthenticatedClient { client in

       do {
         let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
         let json = try JSON(data: jsonData!)
         let getUserSessionHistoryString = json["message"].stringValue
         let getUserSessionHistoryData = getUserSessionHistoryString.data(using: String.Encoding.utf8, allowLossyConversion: false)
         let requestJson = try JSON(data: getUserSessionHistoryData!)
         let request = MeditationClientService.createGeSeekrToWhomSittingGivenRequest(requestJson: requestJson);
         var rpc : GRPCProtoCall!
         rpc = try client.rpcToGetSeekersToWhomSittingIsGivenWithoutUsingApp(with: request, handler: {response, error in
           if error != nil {
             reject("error during getSeekersToWhomSittingIsGivenWithoutUsingApp","", error)
           } else {
             resolve(self.buildGetSeekersWithoutGivenList(response: response!))
             print("Session history:  getSeekersToWhomSittingIsGivenWithoutUsingApp $$$$$$ : \(response)")

           }
         })
         ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
         rpc.start()
       } catch {
         print("Error in getSeekersToWhomSittingIsGivenWithoutUsingApp: \(error)")
       }
     }
   }
  private static func createGetDiaryEntryBySessionIdRequest(idToken: String, getDiaryEntryBySessionRequestJson: JSON) -> Platform_Meditation_GetDiaryEntryBySessionIdRequest {
      
      let request = Platform_Meditation_GetDiaryEntryBySessionIdRequest()
      
      request.userId = getDiaryEntryBySessionRequestJson["userId"].stringValue
      request.meditationSessionId = getDiaryEntryBySessionRequestJson["meditationSessionId"].stringValue

      return request
    }

  private static func buildDiaryEntry(message: Platform_Meditation_DiaryEntry) -> String {
    
      var diaryEntry = DiaryEntry()
      
      diaryEntry.userId = message.userId
      diaryEntry.id = message.id_p
      diaryEntry.text = message.text
      diaryEntry.entryTime = HFTimestamp(seconds: (message.entryTime.seconds))
      diaryEntry.meditationSessionId = message.meditationSessionId
      diaryEntry.moodRating = Int(message.moodRating.rawValue)
    
      let jsonData = try! JSONEncoder().encode(diaryEntry)
      let jsonString = String(data: jsonData, encoding: .utf8)!
      print("diaryEntry $$$$: \(jsonString)")

      return jsonString
  }
  
   @objc func getDiaryEntryBySessionId(
      _ input: NSDictionary,
      resolver resolve: @escaping RCTPromiseResolveBlock,
      rejecter reject: @escaping RCTPromiseRejectBlock)  {
      print("getDiaryEntryBySessionId $$$$$$ : \(input)")
      MeditationClientService.getAuthenticatedClient { client in

        do {
          let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
          let json = try JSON(data: jsonData!)
          let getDiaryEntryBySessionIdString = json["message"].stringValue
          let getDiaryEntryBySessionIdData = getDiaryEntryBySessionIdString.data(using: String.Encoding.utf8, allowLossyConversion: false)
          let requestJson = try JSON(data: getDiaryEntryBySessionIdData!)
          let getDiaryEntryBySessionRequest = MeditationClientService.createGetDiaryEntryBySessionIdRequest( idToken: json["firebaseIdToken"].stringValue, getDiaryEntryBySessionRequestJson: requestJson)
          var rpc : GRPCProtoCall!
          rpc = try client.rpcToGetDiaryEntryBySessionId(with: getDiaryEntryBySessionRequest, handler: {response, error in
            if error != nil {
              reject("error during getDiaryEntryBySessionIdRequest","", error)
            } else {
              resolve(MeditationClientService.buildDiaryEntry(message:response!))
              print("RESPONSE getDiaryEntryBySessionId $$$$$$ : \(response)")

            }
          })
          ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
          rpc.start()
        } catch {
          print("Error in getDiaryEntryBySessionIdRequest: \(error)")
        }
      }
    }


  

  private static func buildPreceptorHistory( preceptorReportRequestJson: JSON) -> Platform_Meditation_PreceptorReportRequest {

    let request = Platform_Meditation_PreceptorReportRequest()

    request.preceptorId = preceptorReportRequestJson["preceptorId"].stringValue
    request.from = GPBTimestamp()
    request.from.seconds = preceptorReportRequestJson["from"]["seconds"].int64Value
    request.to = GPBTimestamp()
    request.to.seconds = preceptorReportRequestJson["to"]["seconds"].int64Value
    request.email = preceptorReportRequestJson["email"].stringValue
    request.timeZoneId = preceptorReportRequestJson["timeZoneId"].stringValue
    
    let meansThroughWhichSittingGivenArray = GPBEnumArray.init()
    preceptorReportRequestJson["meansThroughWhichSittingGiven"].arrayValue.forEach { item in
      meansThroughWhichSittingGivenArray.addValue(item.int32Value)
    }
    request.meansThroughWhichSittingGivenArray = meansThroughWhichSittingGivenArray;
 
    return request
  }

    private static func buildSaveSittingsGivenWithoutUsingApp( requestJSON: JSON) -> Platform_Meditation_SaveSittingsGivenWithoutUsingAppRequest {

      let request = Platform_Meditation_SaveSittingsGivenWithoutUsingAppRequest()
      
      request.startTime.seconds = requestJSON["startTime"]["seconds"].int64Value
      request.endTime.seconds = requestJSON["endTime"]["seconds"].int64Value

      request.noOfPeople = requestJSON["noOfPeople"].int32Value
      let seekerInfo = requestJSON["seekerInfo"].arrayValue

      for item in seekerInfo{
        let seeker = Platform_Meditation_SeekerInfo()
        seeker.seekerId = item["seekerId"].stringValue
        seeker.seekerName = item["seekerName"].stringValue
        request.seekerInfoArray.add(seeker)
      }
      
      request.comments = requestJSON["comments"].stringValue

      return request
  }



}
