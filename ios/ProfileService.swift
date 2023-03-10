
import Foundation
import SwiftyJSON

@objc(ProfileService)
class ProfileService: NSObject {
  
  

  var bridge: RCTBridge!
  
  

  @objc func registerFCMTokenAndDeviceDetails(
    _ input: NSDictionary,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject:RCTPromiseRejectBlock)  {
    print("Input String $$$$$$ : \(input)")
    //ProfileService.sendFCMToken(token: "")
    resolve("Hello From native")

  }

  @objc func saveFederatedIdentity(
    _ input: NSDictionary,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject:RCTPromiseRejectBlock)  {
    print("Input String $$$$$$ : \(input)")
    let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
    let jsonString = String(data: jsonData!, encoding: .utf8)
//    print("json String $$$$$$ : \(jsonString)")
//    //let jsonData = jsonString.data(encoding: .utf8)!
//    let decoder = JSONDecoder()
//    let regData = try! decoder.decode(RegistrationData.self, from: jsonData!)
   
    do {
       let json = try JSON(data: jsonData!)
      let msgString = json["message"].stringValue
      let data = msgString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let json2 = try JSON(data: data!)
      let uId = json2["profile"]["uId"].stringValue
      let firebaseIdToken = json["firebaseIdToken"].stringValue
      ProfileService.sendFCMToken(token: firebaseIdToken, uId: uId)
    } catch {
      
    }
    
     
      resolve("Hello From native")
  }
  
  // MARK: - Methods


      /// Get the signed in user's profile details.
      ///
      /// - Parameters:
      ///   - completion: A closure executed with the following response parameters:
      ///   - profile: An `Profile` instance on success.
      ///   - result: A `CallResult` instance, containing the response details.
      static func getProfile(completion: @escaping (_ profile: profileProfile?, _ error: Error?) -> Void) {
          getAuthenticatedClient { client in
              do {
                _ = try client.getProfileWith(profileGetAuthenticatedProfileRequest.init()) { profile, result in
                      log.debug("🦊 Profile Call Result: \(result)")
                      guard let profile = profile else {
                          completion(nil, result)
                          return
                      }
                      DispatchQueue.main.async {
                          completion(profile, result)
                      }
                  }
              } catch {
                  completion(nil, error)
              }
          }
      }

     

      /// Save the federated identity information for the specified user. This should be called
      /// immediately after the user signs in.
      ///
      /// - Parameters:
      ///   - user: The currently signed in user.
      ///   - loginType: The `LoginType` that the user employed when signing in.
      ///   - completion: A closure executed with the following response parameters:
      ///   - profile: An optional `Profile` instance upon success.
      ///   - result: A `CallResult` instance, containing the response details.
//      static func saveFederatedIdentity(for user: profileUser, loginType: profileLoginType, completion: @escaping (_ profile: profile?,  _ error: Error?) -> Void) {
//          getAuthenticatedClient { client in
//              do {
//                  let request = FederatedIdentity(for: user, loginType: loginType)
//                  _ = try client.saveFederatedIdentity(request, completion: { profile, result in
//                      guard var profile = profile else {
//                          completion(nil, result, ServiceError.nilResponse)
//                          return
//                      }
//                      DispatchQueue.main.async {
//                         completion(profile, result, nil)
//                      }
//                  })
//              } catch {
//                  completion(nil, nil, error)
//              }
//          }
//      }

   /// Save user's profile information.
      ///
      /// - Parameters:
      ///   - profile: A user `Profile` to save.
      ///   - completion: A closure executed with the following response parameters:
      ///   - profile: An optional `Profile` instance upon success.
      ///   - result: A `CallResult` instance, containing the response details.
      ///   - error: An optional `Error`, when a request fails.
//      static func saveProfile(for profile: profileProfile, completion: @escaping (_ profile: profileProfile?, _ error: Error?) -> Void) {
//          getAuthenticatedClient { client in
//              do {
//                  let request = SaveProfileRequest(for: profile)
//                  _ = try client.saveProfile(request, completion: { profile, result in
//                      guard let profile = profile else {
//                          completion(nil, result, ServiceError.nilResponse)
//                          return
//                      }
//                      DispatchQueue.main.async {
//                          completion(profile, result, nil)
//                      }
//                  })
//              } catch {
//                  completion(nil, nil, error)
//              }
//          }
//      }

      /// Save user's profile information.
      ///
      /// - Parameters:
      ///   - profile: A user `Profile` to save.
      ///   - completion: A closure executed with the following response parameters:
      ///   - profile: An optional `Profile` instance upon success.
      ///   - result: A `CallResult` instance, containing the response details.
      ///   - error: An optional `Error`, when a request fails.
//      static func saveProfileImage(for updateProfilePicture:profileUpdateProfilePictureRequest, completion: @escaping (_ profile: String?, _ error: Error?) -> Void) {
//          getAuthenticatedClient { client in
//              do {
//                  //let request = SaveProfileRequest(for: profile)
//                  _ = try client.updateProfilePicture(updateProfilePicture, completion: { (profile, result) in
//                      completion(profile?.value,result,nil)
//
//                  })
//  //                    guard let profile = profile else {
//  //                        completion(nil, result, ServiceError.nilResponse)
//  //                        return
//  //                    }
//  //                    DispatchQueue.main.async {
//  //                        completion(profile, result, nil)
//  //                    }
//
//              } catch {
//                  completion(nil, nil, error)
//              }
//          }
//      }

      
//      static func deactivteProfile(for request: profileDeactivateProfileRequest, completion: @escaping (_ done: Bool?) -> Void) {
//          getAuthenticatedClient { client in
//              do {
//                  _ = try client.deactivateProfile(request, completion: { done, result in
//                      guard let done = done else {
//                          return
//                          //  fatalError("💣 saveFederatedIdentity failed.")
//                      }
//                      DispatchQueue.main.async {
//                          completion(done.value, result)
//                      }
//                  })
//              } catch {
//                  log.error("💣 \(error.localizedDescription)")
//              }
//          }
//      }
      
      

      
      static func updateFCMToken(for request: profileDeviceDetailRequest, completion: @escaping (_ done: Bool?) -> Void) {
          getAuthenticatedClient { client in
              do {
                  print("\(request)")
                print("\(client)")
                _ = try client.registerFCMTokenAndDeviceDetails(with: request, handler: { done, result in
                  print("\(result)")
                      guard let done = done else {
                          return
                          //  fatalError("� saveFederatedIdentity failed.")
                      }
                      DispatchQueue.main.async {
                          completion(done.value)
                      }
                  })
              } catch {
                  fatalError("� \(error.localizedDescription)")
              }
          }
      }
      
  static func sendFCMToken(token: String, uId: String) {
          
          var tokenReq = profileDeviceDetailRequest()
          tokenReq.fcmToken = token
        tokenReq.uId = uId
          //GRPCTool.userID ?? ""
          if(tokenReq.uId == "") {
              //return
          }
          tokenReq.idToken = GRPCTool.accessToken ?? ""
          tokenReq.platform = "iOS"
           // swiftlint:disable force_cast
          let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as! String
          let versionCode = Bundle.main.infoDictionary?["CFBundleVersion"] as! String
           // swiftlint:enable force_cast
          let deviceId = UIDevice.current.identifierForVendor?.uuidString
          tokenReq.buildCodeVersion = versionCode
          tokenReq.osVersion = UIDevice.current.systemVersion
          tokenReq.appVersion = version
          tokenReq.deviceId = deviceId ?? ""
          tokenReq.deviceModel = UIDevice.current.model
          tokenReq.deviceName = UIDevice.current.name
          tokenReq.deviceMake = "Apple"
          
          ProfileService.updateFCMToken(for: tokenReq, completion: { result in
              log.debug("Received data message: \(result)")
          })
      }
      
      static func deregisterFCMToken(uid: String) -> Void {
          let request = createDeviceDetailRequest(token: "", uid: uid)
          getAuthenticatedClient { client in
                  do {
                      print("delink request: \(request)")
                    _ = try client.deRegisterFCMToken(with: request, handler: { done, result in
                          guard done != nil else {
                              return
                          }
                      })
                  } catch {
                      log.error("� \(error.localizedDescription)")
                  }
          }
      }


//      private static let channel = Channel( address: Environment.current.profileService,
//                                            secure:true , arguments: [Channel.Argument.http2EnableTrueBinary(true),
//  Channel.Argument.maxConcurrentStreams(100)])

      // MARK: - Private Methods

      /// Get a fresh authenticated client for a new request. Each new client uses the shared channel
      /// that is initially opened by the `baseClient`.
      ///
      ///   - completion: A closure executed with the following response parameters:
      ///   - profileServiceClient: A fresh authenticated client.
      private static func getAuthenticatedClient(completion: @escaping (_ profileServiceClient: profileProfileService) -> Void) {

//          let profileServiceClient = ProfileServiceClient(channel: self.channel)
//          GRPCTool.auth(profileServiceClient) { client, error in
//              log.debug("🦊 After GRPCtool AUTH auth Client: \(String(describing: client)) Error: \(String(describing: error))")
//              guard let client = client else {
//                  log.error("🦊 ERROR putting Auth header in Client Error: \(String(describing: error))")
//                  return
//                 // fatalError("💣 \(error?.localizedDescription ?? "Unknown error")")
//              }
        let profileClient = profileProfileService.init(host: "profile-service-grpc.qa.heartfulnessinstitute.in:443")
              completion(profileClient)
          
      }
      
      private static func createDeviceDetailRequest(token: String, uid: String) -> profileDeviceDetailRequest {
          var tokenReq = profileDeviceDetailRequest()
          tokenReq.fcmToken = token
          tokenReq.uId = uid
          tokenReq.idToken = GRPCTool.accessToken ?? ""
          tokenReq.platform = "iOS"
          // swiftlint:disable force_cast
          let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as! String
          let versionCode = Bundle.main.infoDictionary?["CFBundleVersion"] as! String
          // swiftlint:disable force_cast
          let deviceId = UIDevice.current.identifierForVendor?.uuidString
          tokenReq.buildCodeVersion = versionCode
          tokenReq.osVersion = UIDevice.current.systemVersion
          tokenReq.appVersion = version
          tokenReq.deviceId = deviceId ?? ""
          tokenReq.deviceModel = UIDevice.current.model
          tokenReq.deviceName = UIDevice.current.name
          tokenReq.deviceMake = "Apple"
          return tokenReq
      }
}
