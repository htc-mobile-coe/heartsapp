
import Foundation
import SwiftyJSON

@objc(ProfileService)
class ProfileClientService: NSObject {

  var bridge: RCTBridge!
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
    }
  
  @objc func getProfile(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("getProfile $$$$$$ : \(input)")
    do {
      let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
      let json = try JSON(data: jsonData!)
      let deviceMessageString = json["message"].stringValue
      let deviceData = deviceMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let deviceJson = try JSON(data: deviceData!)
      ProfileClientService.getProfile(json: deviceJson, completion: {profile, error in
        guard profile != nil else {
          reject("error during updateFCMToken","", error)
          return
        }
        //      var responseDictionary = [String: Any]()
        //      responseDictionary["message"] = self.buildProfileResponse(profile: profile ?? Platform_Profile_Profile())
        //      print("Profile response: \(responseDictionary)")
        resolve(self.buildProfileResponse(profile: profile ?? Platform_Profile_Profile()))
      })
    }catch {
      reject("error during updateFCMToken","", error)
    }
  }
  //MARK:- UserPreferences
  @objc func getUserPreferences(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("getUserPreferences $$$$$$ : \(input)")
    do {
      let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
      let json = try JSON(data: jsonData!)
      let userPreferenceMessageString = json["message"].stringValue
      let userPreferenceData = userPreferenceMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let userPreferenceJson = try JSON(data: userPreferenceData!)
      let idToken = userPreferenceJson["idToken"].stringValue;

      ProfileClientService.getUserPreferences(json: userPreferenceJson,authToken: idToken, completion: {userPreferences, error in
        guard let preferences = userPreferences else {
          reject("error during getUserPreferences","", error)
          return
        }
        resolve(self.buildProfilePreferences(userPreferences: preferences))
      })
    }catch {
      reject("error during getUserPreferences","", error)
    }
  }

  @objc func saveUserPreferences(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("saveUserPreferences $$$$$$ : \(input)")
    ProfileClientService.getAuthenticatedClient { client in
      do {
        let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
        let json = try JSON(data: jsonData!)
        let requestString = json["message"].stringValue
        let requestData = requestString.data(using: String.Encoding.utf8, allowLossyConversion: false)
        let requestJson = try JSON(data: requestData!)
        let firebaseIdToken = json["firebaseIdToken"].stringValue;
        print("saveUserPreferences Json String $$$$$$ : \(requestJson)")
        let request = ProfileClientService.createSaveUserPreferencesRequest( requestJson);
        ProfileClientService.saveUserPreferences(for: request, authToken: firebaseIdToken) { (sucess, error) in
          if error != nil {
            reject("error during saveUserPreferences","", error)
          } else {
            resolve(sucess)
          }
        }
      }catch {
        reject("error during saveUserPreferences","", error)
      }
    }

  }
 //MARK:- AddSupport
  @objc func addSupportRequest(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("addSupportRequest $$$$$$ : \(input)")
    ProfileClientService.getAuthenticatedClient { client in
      do {
        let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
        let json = try JSON(data: jsonData!)
        let supportRequestString = json["message"].stringValue
        let supportRequestData = supportRequestString.data(using: String.Encoding.utf8, allowLossyConversion: false)
        let requestJson = try JSON(data: supportRequestData!)
        print("supportRequestJson Json String $$$$$$ : \(requestJson)")
        let supportRequest = ProfileClientService.createSupportRequest(idToken: json["firebaseIdToken"].stringValue, supportRequestJson: requestJson)
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToAddSupportRequest(with: supportRequest, handler: {response, error in
          if error != nil {
            reject("error during addSupportRequest","", error)
          } else {
            resolve(response?.value ?? false)
          }
        })

        ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
        rpc.start()
      }catch {
        reject("error during addSupportRequest","", error)
      }
    }

  }
  
  @objc func logOnServer(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("logOnServer $$$$$$ : \(input)")
    ProfileClientService.getAuthenticatedClient { client in
      do {
        let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
        let json = try JSON(data: jsonData!)
        let logRequestString = json["message"].stringValue
        let logRequestData = logRequestString.data(using: String.Encoding.utf8, allowLossyConversion: false)
        let requestJson = try JSON(data: logRequestData!)
        print("logRequestJson Json String $$$$$$ : \(requestJson)")
        let logRequest = ProfileClientService.createLogRequest(idToken: json["firebaseIdToken"].stringValue, logRequestJson: requestJson)
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToLogOnServer(with: logRequest, handler: {response, error in
          if error != nil || response?.value == false {
            reject("error during logOnServer","", error)
          } else {
            resolve(true)
          }
        })

        ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
        rpc.start()
      }catch {
        reject("error during logOnServer","", error)
      }
    }

  }
  
  @objc func updateMeditationSittingDates(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("updateMeditationSittingDatesRequest $$$$$$ : \(input)")
    ProfileClientService.getAuthenticatedClient { client in
      do {
        let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
        let json = try JSON(data: jsonData!)
        let requestString = json["message"].stringValue
        let requestData = requestString.data(using: String.Encoding.utf8, allowLossyConversion: false)
        let requestJson = try JSON(data: requestData!)
        print("updateMeditationSittingDatesRequestJson Json String $$$$$$ : \(requestJson)")
        let request = ProfileClientService.createSittingDatesRequest(idToken: json["firebaseIdToken"].stringValue, requestJson: requestJson)
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToUpdateMeditationSittingDates(with: request, handler: {response, error in
          if error != nil || response?.value == false {
            reject("error during UpdateMeditationSittingDatesRequest","", error)
          } else {
            resolve(true)
          }
        })

        ServiceUtil.addAuthHeader(authToken: json["firebaseIdToken"].stringValue, rpc: rpc)
        rpc.start()
      }catch {
        reject("error during addSupportRequest","", error)
      }
    }

  }


  @objc func saveProfile(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {

    print("saveProfile Input String $$$$$$ : \(input)")
    let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
    //let jsonString = String(data: jsonData!, encoding: .utf8)
    do {
      let json = try JSON(data: jsonData!)
      let profileMessageString = json["message"].stringValue
      let profileData = profileMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let requestJson = try JSON(data: profileData!)
      print("profileJson String $$$$$$ : \(requestJson)")
      let saveProfileRequest = ProfileClientService.createSaveProfileRequest(inputJson: requestJson)
      ProfileClientService.saveProfile(for: saveProfileRequest, completion: { profile, error in
        print("saveProfile succeeded: \(profile)")
        if error != nil {

              reject("\(error?._code ?? 2)",
                         "error:\(error?.localizedDescription ?? "unkown error")" ,
                              NSError.init(domain: "com.profile.service", code: 2, userInfo: [NSLocalizedDescriptionKey: error?.localizedDescription ?? "unkown error"]))
        } else {
          resolve(self.buildProfileResponse(profile: profile ?? Platform_Profile_Profile()))
        }
      })
    } catch  {
      reject("error during saveProfile","", error)
    }
  }

  @objc func updateProfilePicture(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("updateProfilePicture $$$$$$ : \(input)")
    let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
    //    let jsonString = String(data: jsonData!, encoding: .utf8)
    do {
      let json = try JSON(data: jsonData!)
      let firebaseIdToken = json["firebaseIdToken"].stringValue
      let profileMessageString = json["message"].stringValue
      let profileData = profileMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let profileJson = try JSON(data: profileData!)
      print("profileJson String $$$$$$ : \(profileJson)")
      let updateProfilePictureRequest = ProfileClientService.createUpdateProfilePictureRequest( requestJson: profileJson)

      ProfileClientService.updateProfilePicture(for: updateProfilePictureRequest, idToken: firebaseIdToken, completion: { responseString, error in
        print("updateProfilePicture succeeded: \(String(describing: responseString))")
        if error != nil {
          reject("error during saveFederatedIdentity","", error)
        } else {
          resolve(responseString)
        }
      })
    } catch {
      reject("error during updateProfilePicture","", error)
    }
  }

  @objc func deleteProfilePicture(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("updateProfilePicture $$$$$$ : \(input)")
    let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
    //    let jsonString = String(data: jsonData!, encoding: .utf8)
    do {
      let json = try JSON(data: jsonData!)
      let firebaseIdToken = json["firebaseIdToken"].stringValue
      let deleteProfilePictureMessageString = json["message"].stringValue
      let deleteProfilePictureData = deleteProfilePictureMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let deleteProfilePictureJson = try JSON(data: deleteProfilePictureData!)
      print("deleteProfilePictureJson String $$$$$$ : \(deleteProfilePictureJson)")
      ProfileClientService.deleteProfilePicture(json:deleteProfilePictureJson, idToken: firebaseIdToken, completion: { success, error in
        if error != nil {
          reject("error during deleteProfilePicture","", error)
        } else {
          resolve(success)
        }
      })
    } catch {
      reject("error during deleteProfilePicture","", error)
    }
  }

  @objc func deRegisterFCMToken(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("deRegisterFCMToken Input String $$$$$$ : \(input)")
    let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
    //    let jsonString = String(data: jsonData!, encoding: .utf8)
    do {
      let json = try JSON(data: jsonData!)
      let deviceMessageString = json["message"].stringValue
      let deviceData = deviceMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let deviceJson = try JSON(data: deviceData!)
      print("deviceJson String $$$$$$ : \(deviceJson)")
      let deviceRequest = ProfileClientService.createDeviceDetailRequest(deviceJson: deviceJson)
      ProfileClientService.deleteFCMToken(for: deviceRequest, completion: { success, error in
        print("deleteFCMToken succeeded: \(success)")
        if error != nil {
          reject("error during deletingFCMToken","", error)
        } else {
          resolve(success)
        }
      })
    } catch {
      reject("error during deRegisterFCMToken","", error)
    }


  }

  @objc func deactivateProfile(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("deactivateProfile Input String $$$$$$ : \(input)")
    let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
    //    let jsonString = String(data: jsonData!, encoding: .utf8)
    do {
      let json = try JSON(data: jsonData!)
      let deviceMessageString = json["message"].stringValue
      let deviceData = deviceMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let deviceJson = try JSON(data: deviceData!)
      print("deviceJson String $$$$$$ : \(deviceJson)")
      let deviceRequest = ProfileClientService.createDeactivateProfileRequest(deviceJson: deviceJson)
      ProfileClientService.deactivateProfile(for: deviceRequest, idToken: json["firebaseIdToken"].stringValue, completion: { success, error in
        print("deactivateProfile succeeded: \(success)")
        if error != nil {
          reject("error during deletingFCMToken","", error)
        } else {
          resolve(success)
        }
      })
    } catch {
      reject("error during deRegisterFCMToken","", error)
    }


  }

  @objc func registerFCMTokenAndDeviceDetails(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("registerFCMTokenAndDeviceDetails Input String $$$$$$ : \(input)")
    let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
    //    let jsonString = String(data: jsonData!, encoding: .utf8)
    do {
      let json = try JSON(data: jsonData!)
      let deviceMessageString = json["message"].stringValue
      let deviceData = deviceMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let deviceJson = try JSON(data: deviceData!)
      print("deviceJson String $$$$$$ : \(deviceJson)")
      let deviceRequest = ProfileClientService.createDeviceDetailRequest(deviceJson: deviceJson)
      ProfileClientService.updateFCMToken(for: deviceRequest, completion: { success, error in
        print("updateFCMToken succeeded: \(success)")
        if error != nil {
          reject("error during updateFCMToken","", error)
        } else {
          resolve(success)
        }
      })
    } catch {
      reject("error during registerFCMTokenAndDeviceDetails","", error)
    }


  }

  @objc func saveFederatedIdentity(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("saveFederatedIdentity $$$$$$ : \(input)")
    let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
    //    let jsonString = String(data: jsonData!, encoding: .utf8)
    do {
      let json = try JSON(data: jsonData!)
      let profileMessageString = json["message"].stringValue
      let profileData = profileMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let profileJson = try JSON(data: profileData!)
      print("profileJson String $$$$$$ : \(profileJson)")
      let federatedIdentity = ProfileClientService.createFederatedItentity(idToken: json["firebaseIdToken"].stringValue, profileJson: profileJson)

      ProfileClientService.saveFederatedIdentity(for: federatedIdentity, completion: { profile, error in
        print("saveFederatedIdentity succeeded: \(profile)")
        if error != nil {
          reject("error during saveFederatedIdentity","", error)
        } else {
          //                  var responseDictionary = [String: Any]()
          //                  responseDictionary["message"] = self.buildProfileResponse(profile: profile ?? Platform_Profile_Profile())
          //                  print("saveFederatedIdentity response: \(responseDictionary)")
          resolve(self.buildProfileResponse(profile: profile ?? Platform_Profile_Profile()))
        }
      })
    } catch {
      reject("error during saveFederatedIdentity","", error)
    }
  }


  @objc func selfAttestForIntroSitting(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    print("selfAttestForIntroSitting $$$$$$ : \(input)")
    let jsonData = try? JSONSerialization.data(withJSONObject: input, options: [])
    do {
      let json = try JSON(data: jsonData!)
      let selfAttestMessageString = json["message"].stringValue
      let selfAttestData = selfAttestMessageString.data(using: String.Encoding.utf8, allowLossyConversion: false)
      let selfAttestJson = try JSON(data: selfAttestData!)
      print("selfAttestJson String $$$$$$ : \(selfAttestJson)")
      let selfAttestInfoRequest = ProfileClientService.createSelfAttestIntroSittingRequest(idToken: json["firebaseIdToken"].stringValue, selfAttestIntroSittingJson: selfAttestJson)

      ProfileClientService.selfAttestForIntroSitting(for: selfAttestInfoRequest, completion: { profile, error in
        print("selfAttestForIntroSitting succeeded: \(profile)")
        if error != nil {
          print("selfAttestJson error $$$$$$ : \(selfAttestJson)")
          reject("error during selfAttestForIntroSitting","", error)
        } else {
          resolve(true)
        }
      })
    } catch {
      reject("error during selfAttestForIntroSitting","", error)
    }
  }

  private func buildProfileResponse(profile: Platform_Profile_Profile) -> String {

    var profileResponse = ProfileResponse()
    profileResponse.abhyasiId = profile.abhyasiId
    profileResponse.email = profile.email
    profileResponse.firstName = profile.firstName
    profileResponse.lastName = profile.lastName
    profileResponse.profession = profile.profession
    profileResponse.gender = Int(profile.gender.rawValue)
    profileResponse.stage = Int(profile.stage.rawValue)
    profileResponse.uId = profile.uId
    profileResponse.isTrainer = profile.isTrainer
    profileResponse.phone = profile.phone
    profileResponse.addressLine1 = profile.addressLine1
    profileResponse.addressLine2 = profile.addressLine2
    profileResponse.addressLine3 = profile.addressLine3
    profileResponse.city = profile.city
    profileResponse.stateCode = profile.stateCode
    profileResponse.postalCode = profile.postalCode
    profileResponse.countryCode = profile.countryCode
    profileResponse.photoURL = profile.photoURL
    profileResponse.emergencyContact = profile.emergencyContact
    profileResponse.printName = profile.printName
    profileResponse.aimsId = profile.aimsId
    profileResponse.firstSittingDate = profile.firstSittingDate
    profileResponse.secondSittingDate = profile.secondSittingDate
    profileResponse.thirdSittingDate = profile.thirdSittingDate
    profileResponse.introducedBy = profile.introducedBy
    profileResponse.citizenship = profile.citizenship
    profileResponse.prefect = profile.prefect
    profileResponse.dob = profile.dob
    profileResponse.doj = profile.doj
    profileResponse.volunteer = profile.volunteer
    profileResponse.skills = profile.skills
    profileResponse.abhyasiId = profile.abhyasiId
    profileResponse.currentPreceptor = profile.currentPreceptor
    profileResponse.landline = profile.landline
    profileResponse.anonymous = profile.anonymous
    profileResponse.countryName = profile.countryName
    profileResponse.stateName = profile.stateName
    profileResponse.cityPlaceId = profile.cityPlaceId
    profileResponse.latitude = profile.latitude
    profileResponse.longitude = profile.longitude
    if profile.hasIsLocationVisibleToPublic {
      let isLocationVisibleToPublic = profile.isLocationVisibleToPublic
      profileResponse.isLocationVisibleToPublic = ProfileNullableBoolResponse.init(from: Int(isLocationVisibleToPublic!.kindOneOfCase.rawValue), kind: isLocationVisibleToPublic?.data_p)
    }
    if profile.hasIsNameVisibleToPublic{
      let isNameVisibleToPublic = profile.isNameVisibleToPublic
      profileResponse.isNameVisibleToPublic = ProfileNullableBoolResponse.init(from: Int(isNameVisibleToPublic!.kindOneOfCase.rawValue), kind: isNameVisibleToPublic?.data_p)
    }
    
    if profile.hasIsPhotoVisibleToPublic {
      let isPhotoVisibleToPublic = profile.isPhotoVisibleToPublic
      profileResponse.isPhotoVisibleToPublic = ProfileNullableBoolResponse.init(from: Int(isPhotoVisibleToPublic!.kindOneOfCase.rawValue), kind: isPhotoVisibleToPublic?.data_p)
    }
    


    let jsonData = try! JSONEncoder().encode(profileResponse)
    let profileJson = String(data: jsonData, encoding: .utf8)!
    print("profilejson: \(profileJson)")
    return profileJson
  }
  private func buildProfilePreferences(userPreferences: Platform_Profile_UserPreferences) -> String {
    var preferenceResponse = UserPreferencesResponse.init(uId: userPreferences.uId)
    if userPreferences.hasIsSubscribedToWeeklyInspiration, let isSubscribedToWeeklyInspiration = userPreferences.isSubscribedToWeeklyInspiration{
      preferenceResponse.isSubscribedToWeeklyInspiration = ProfileNullableBoolResponse.init(from: Int(isSubscribedToWeeklyInspiration.kindOneOfCase.rawValue), kind: isSubscribedToWeeklyInspiration.data_p)
    }
    
    if userPreferences.hasShouldPlayRelaxationAudioBeforeMeditation, let shouldPlayRelaxationAudioBeforeMeditation = userPreferences.shouldPlayRelaxationAudioBeforeMeditation{
      preferenceResponse.shouldPlayRelaxationAudioBeforeMeditation = ProfileNullableBoolResponse.init(from: Int(shouldPlayRelaxationAudioBeforeMeditation.kindOneOfCase.rawValue), kind: shouldPlayRelaxationAudioBeforeMeditation.data_p)
    }
    preferenceResponse.timeOfConsent = userPreferences.timeOfConsent == nil ? nil: HFTimestamp(seconds: userPreferences.timeOfConsent.seconds)
    preferenceResponse.isMorningMeditationReminderEnabled = userPreferences.isMorningMeditationReminderEnabled
    preferenceResponse.morningMeditationTime = userPreferences.morningMeditationTime == nil ? nil: HFTimestamp(seconds: userPreferences.morningMeditationTime.seconds)
    preferenceResponse.isEveningMeditationReminderEnabled = userPreferences.isEveningMeditationReminderEnabled
    preferenceResponse.eveningCleaningTime = userPreferences.eveningCleaningTime == nil ? nil: HFTimestamp(seconds: userPreferences.eveningCleaningTime.seconds)
    preferenceResponse.isReminderForNextSittingEnabled = userPreferences.isReminderForNextSittingEnabled
    preferenceResponse.nextSittingReminderIntervalInDays = userPreferences.nextSittingReminderIntervalInDays
    
    let jsonData = try! JSONEncoder().encode(preferenceResponse)
    let userPreferencesJson = String(data: jsonData, encoding: .utf8)!
    print("getUserPreferences: \(userPreferencesJson)")
    return userPreferencesJson
  }


  // MARK: - Methods


  /// Get the signed in user's profile details.
  ///
  /// - Parameters:
  ///   - completion: A closure executed with the following response parameters:
  ///   - profile: An `Profile` instance on success.
  static func getProfile(json: JSON, completion: @escaping (_ profile: Platform_Profile_Profile?, _ error: Error?) -> Void) {
    getAuthenticatedClient { client in
      do {
        var request = Platform_Profile_GetAuthenticatedProfileRequest()
        request.idToken = json["idToken"].stringValue
        request.uId = json["uId"].stringValue
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToGetProfile(with: request, handler:  { profile, result in
          log.debug("🦊 Profile Call Result: \(result)")
          guard let profile = profile else {
            completion(nil, result)
            return
          }
          DispatchQueue.main.async {
            completion(profile, result)
          }
        })
        ServiceUtil.addAuthHeader(authToken: request.idToken, rpc: rpc)
        rpc.start()
      } catch {
        completion(nil, error)
      }
    }
  }



  /// Save the federated identity information
  /// - Parameters:
  ///   - federatedIdentity: The currently signed in user.
  ///   - completion: A closure executed with the following response parameters:
  ///   - profile: An optional `Profile` instance upon success.
  static func saveFederatedIdentity(for federatedIdentity: federatedIdentityFederatedIdentity, completion: @escaping (_ profile: Platform_Profile_Profile?,  _ error: Error?) -> Void) {
    getAuthenticatedClient { client in
      do {
        print(federatedIdentity)
        var rpc : GRPCProtoCall!
        rpc = try client.rpcToSaveFederatedIdentity(withRequest: federatedIdentity, handler: { profile, error in
          guard let profile = profile else {
            completion(nil, error)
            return
          }
          DispatchQueue.main.async {
            completion(profile, error)
          }
        })

        ServiceUtil.addAuthHeader(authToken: federatedIdentity.profile.authCredentials.idToken, rpc: rpc)
        rpc.start()
      } catch {
        print(error)
        completion(nil, error)
      }
    }
  }

  static func selfAttestForIntroSitting(for selfAttestInfoRequest: Platform_Profile_SelfAttestIntroSittingRequest, completion: @escaping (_ done: Bool?,_ error: Error?) -> Void) {
    getAuthenticatedClient { client in

      do {
        print("\(selfAttestInfoRequest)")
        var rpc : GRPCProtoCall!
        _ = try rpc = client.rpcToSelfAttestForIntroSitting(with: selfAttestInfoRequest, handler: { done, result in
          guard let done = done else {
            completion(false, result)
            return
          }
          DispatchQueue.main.async {
            completion(done.value, result)
          }
        })
        ServiceUtil.addAuthHeader(authToken: selfAttestInfoRequest.idToken, rpc: rpc)
        rpc.start()
      } catch {
        print("� \(error.localizedDescription)")
        completion(false, error)
      }
    }
  }

  static func deleteFCMToken(for request: Platform_Profile_DeviceDetailRequest, completion: @escaping (_ done: Bool?, _ error: Error?) -> Void) {
    getAuthenticatedClient { client in
      do {
        print("\(request)")
        var rpc : GRPCProtoCall!
        _ = try rpc = client.rpcToDeRegisterFCMToken(with: request, handler: { done, result in
          guard let done = done else {
            completion(false, result)
            return
          }
          DispatchQueue.main.async {
            completion(done.value, result)
          }
        })
        ServiceUtil.addAuthHeader(authToken: request.idToken, rpc: rpc)
        rpc.start()
      } catch {
        print("� \(error.localizedDescription)")
        completion(false, error)
      }
    }
  }

  static func deactivateProfile(for request: Platform_Profile_DeactivateProfileRequest, idToken: String, completion: @escaping (_ done: Bool?, _ error: Error?) -> Void) {
    getAuthenticatedClient { client in
      do {
        print("\(request)")
        var rpc : GRPCProtoCall!
        _ = try rpc = client.rpcToDeactivateProfile(with: request, handler: { done, result in
          guard let done = done else {
            completion(false, result)
            return
          }
          DispatchQueue.main.async {
            completion(done.value, result)
          }
        })
        ServiceUtil.addAuthHeader(authToken: idToken, rpc: rpc)
        rpc.start()
      } catch {
        print("� \(error.localizedDescription)")
        completion(false, error)
      }
    }
  }

  static func updateFCMToken(for request: Platform_Profile_DeviceDetailRequest, completion: @escaping (_ done: Bool?, _ error: Error?) -> Void) {
    getAuthenticatedClient { client in
      do {
        print("\(request)")
        var rpc : GRPCProtoCall!
        _ = try rpc = client.rpcToRegisterFCMTokenAndDeviceDetails(with: request, handler: { done, result in
          guard let done = done else {
            completion(false, result)
            return
          }
          DispatchQueue.main.async {
            completion(done.value, result)
          }
        })
        ServiceUtil.addAuthHeader(authToken: request.idToken, rpc: rpc)
        rpc.start()
      } catch {
        print("� \(error.localizedDescription)")
        completion(false, error)
      }
    }
  }


  static func saveProfile(for request: Platform_Profile_SaveAuthenticatedProfileRequest, completion: @escaping (_ profile: Platform_Profile_Profile?, _ error: Error?) -> Void) {
    getAuthenticatedClient { client in
      do {
        print("\(request)")
        var rpc : GRPCProtoCall!
        rpc = client.rpcToSaveProfile(with: request, handler: { profile, result in
          guard profile != nil else {
            completion(nil, result)
            return
          }
          DispatchQueue.main.async {
            completion(profile, result)
          }
        })
        ServiceUtil.addAuthHeader(authToken: request.idToken, rpc: rpc)
        rpc.start()
      } catch {
        print("� \(error.localizedDescription)")
        completion(nil, error)
      }
    }
  }

  
  static func saveUserPreferences(for request: Platform_Profile_SaveUserPreferencesRequest,authToken:String, completion: @escaping (_ response: Bool?, _ error: Error?) -> Void) {
    getAuthenticatedClient { client in
      print("\(request)")
      var rpc : GRPCProtoCall!
      rpc = client.rpcToSaveUserPreferences(with: request, handler: { updated, result in
        guard updated != nil else {
          completion(nil, result)
          return
        }
        DispatchQueue.main.async {
          completion(updated?.value ?? false, result)
        }
      })
       ServiceUtil.addAuthHeader(authToken: authToken, rpc: rpc)
      rpc.start()
      
    }
  }
  
  static func getUserPreferences(json: JSON,authToken:String, completion: @escaping (_ profile: Platform_Profile_UserPreferences?, _ error: Error?) -> Void) {
    getAuthenticatedClient { client in
      var rpc : GRPCProtoCall!
      let request = GPBStringValue.init()
      request.value = json["uId"].stringValue
      rpc = client.rpcToGetUserPreferences(withRequest: request, handler:  { preferences, result in
        log.debug("🦊 User Preference Call Result: \(result)")
        guard let userPreferences = preferences else {
          completion(nil, result)
          return
        }
        DispatchQueue.main.async {
          completion(userPreferences, result)
        }
      })
      ServiceUtil.addAuthHeader(authToken: authToken, rpc: rpc)
      rpc.start()
      
    }
  }

   static func updateProfilePicture(for request: Platform_Profile_UpdateProfilePictureRequest,idToken:String,  completion: @escaping (_ done: String?, _ error: Error?) -> Void) {
    getAuthenticatedClient { client in
      do {
        print("\(request)")
        var rpc : GRPCProtoCall!
        _ = try rpc = client.rpcToupdateProfilePicture(with: request, handler: { done, result in

          guard done != nil else {
          completion(nil, result)
          return
          }
          DispatchQueue.main.async {
            completion(done?.value, result)
          }
        })
        ServiceUtil.addAuthHeader(authToken: idToken, rpc: rpc)

        rpc.start()
      } catch {
        print("� \(error.localizedDescription)")
        completion(nil, error)
      }
    }
  }

  static func deleteProfilePicture(json: JSON,idToken:String,  completion: @escaping (_ done: Bool?, _ error: Error?) -> Void){
    getAuthenticatedClient { client in
      do {
        var rpc : GRPCProtoCall!
        let request = GPBStringValue.init()
        request.value = json["uId"].stringValue
        rpc = client.rpcTodeleteProfilePicture(withRequest: request, handler:  { done, result in

          guard done != nil else {
          completion(nil, result)
          return
          }
          DispatchQueue.main.async {
            completion(done?.value, result)
          }
        })
        ServiceUtil.addAuthHeader(authToken: idToken, rpc: rpc)

        rpc.start()
      } catch {
        print("� \(error.localizedDescription)")
        completion(nil, error)
      }
    }
  }

  //TODO: see if a private pool can be implemented
  private static var profileClient = Platform_Profile_ProfileService.init(host: Environment.current.profileService)

  // MARK: - Private Methods

  /// Execute all calls on the same client
  ///
  ///   - completion: A closure executed with the following response parameters:
  ///   - profileServiceClient: single instance client.
  private static func getAuthenticatedClient(completion: @escaping (_ profileServiceClient: Platform_Profile_ProfileService) -> Void) {
    //TODO: what check to perform for validity of profile client
    completion(profileClient)

  }

  private static func createDeviceDetailRequest(token: String, uid: String) -> Platform_Profile_DeviceDetailRequest {
    var tokenReq = Platform_Profile_DeviceDetailRequest()
    tokenReq.fcmToken = token
    tokenReq.uId = uid
    tokenReq.idToken = token
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

  private static func createSaveProfileRequest(inputJson: JSON) -> Platform_Profile_SaveAuthenticatedProfileRequest {
    let profileRequest = Platform_Profile_SaveAuthenticatedProfileRequest()
    profileRequest.idToken = inputJson["idToken"].stringValue
    profileRequest.uId = inputJson["uId"].stringValue
    let requestJson = inputJson["profile"]
    let profile = Platform_Profile_Profile()
    profile.uId = requestJson["uId"].exists() ? requestJson["uId"].stringValue:""
    profile.abhyasiId = requestJson["abhyasiId"].exists() ? requestJson["abhyasiId"].stringValue:""
    profile.email = requestJson["email"].exists() ? requestJson["email"].stringValue:""
    profile.firstName = requestJson["firstName"].exists() ? requestJson["firstName"].stringValue:""
    profile.lastName = requestJson["lastName"].exists() ? requestJson["lastName"].stringValue:""
    profile.profession = requestJson["profession"].exists() ? requestJson["profession"].stringValue:""
    profile.phone = requestJson["phone"].exists() ? requestJson["phone"].stringValue:""
    profile.addressLine1 = requestJson["addressLine1"].exists() ? requestJson["addressLine1"].stringValue:""
    profile.addressLine2 = requestJson["addressLine2"].exists() ? requestJson["addressLine2"].stringValue:""
    profile.addressLine3 = requestJson["addressLine3"].exists() ? requestJson["addressLine3"].stringValue:""
    profile.city = requestJson["city"].exists() ? requestJson["city"].stringValue:""
    profile.stateCode = requestJson["stateCode"].exists() ? requestJson["stateCode"].stringValue:""
    profile.postalCode = requestJson["postalCode"].exists() ? requestJson["postalCode"].stringValue:""
    profile.countryCode = requestJson["countryCode"].exists() ? requestJson["countryCode"].stringValue:""
    profile.dob = requestJson["dob"].exists() ? requestJson["dob"].stringValue:""
    profile.doj = requestJson["doj"].exists() ? requestJson["doj"].stringValue:""
    profile.countryName = requestJson["countryName"].exists() ? requestJson["countryName"].stringValue:""
    profile.stateName = requestJson["stateName"].exists() ? requestJson["stateName"].stringValue:""
    profile.cityPlaceId = requestJson["cityPlaceId"].exists() ? requestJson["cityPlaceId"].stringValue:""
    profile.volunteer = requestJson["volunteer"].exists() ? requestJson["volunteer"].stringValue:""
    profile.skills = requestJson["skills"].exists() ? requestJson["skills"].stringValue:""
    profile.currentPreceptor = requestJson["currentPreceptor"].exists() ? requestJson["currentPreceptor"].stringValue:""
    profile.landline = requestJson["landline"].exists() ? requestJson["landline"].stringValue:""
    profile.anonymous = requestJson["anonymous"].exists() ? requestJson["anonymous"].boolValue:false
    profile.photoURL = requestJson["photoURL"].exists() ? requestJson["photoURL"].stringValue:""
    profile.emergencyContact = requestJson["emergencyContact"].exists() ? requestJson["emergencyContact"].stringValue:""
    profile.printName = requestJson["printName"].exists() ? requestJson["printName"].stringValue:""
    profile.aimsId = requestJson["aimsId"].exists() ? requestJson["aimsId"].stringValue:""
    profile.firstSittingDate = requestJson["firstSittingDate"].exists() ? requestJson["firstSittingDate"].stringValue:""
    profile.secondSittingDate = requestJson["secondSittingDate"].exists() ? requestJson["secondSittingDate"].stringValue:""
    profile.thirdSittingDate = requestJson["thirdSittingDate"].exists() ? requestJson["thirdSittingDate"].stringValue:""
    profile.introducedBy = requestJson["introducedBy"].exists() ? requestJson["introducedBy"].stringValue:""
    profile.citizenship = requestJson["citizenship"].exists() ? requestJson["citizenship"].stringValue:""
    profile.prefect = requestJson["prefect"].exists() ? requestJson["prefect"].stringValue:""
    profile.gender = requestJson["gender"].exists() ? Platform_Profile_Gender.init(rawValue: requestJson["gender"].int32Value)! : Platform_Profile_Gender.unknown
    profile.stage = requestJson["stage"].exists() ? Platform_Profile_Stage.init(rawValue: requestJson["stage"].int32Value)! : Platform_Profile_Stage.newbie
    profile.latitude = requestJson["latitude"].exists() ? requestJson["latitude"].doubleValue: 0.0
    profile.longitude = requestJson["longitude"].exists() ? requestJson["longitude"].doubleValue: 0.0
    let isLocationVisibleToPublic = Platform_Profile_NullableBool();
    isLocationVisibleToPublic.data_p = requestJson["isLocationVisibleToPublic"].boolValue;
    profile.isLocationVisibleToPublic = isLocationVisibleToPublic;
   
    let isNameVisibleToPublic = Platform_Profile_NullableBool();
    isNameVisibleToPublic.data_p = requestJson["isNameVisibleToPublic"].boolValue;
    profile.isNameVisibleToPublic = isNameVisibleToPublic;
    
    let isPhotoVisibleToPublic = Platform_Profile_NullableBool();
    isPhotoVisibleToPublic.data_p = requestJson["isPhotoVisibleToPublic"].boolValue;
    profile.isPhotoVisibleToPublic = isPhotoVisibleToPublic
    
    profileRequest.profile = profile
    return profileRequest
  }

  private static func createDeviceDetailRequest(deviceJson: JSON) -> Platform_Profile_DeviceDetailRequest {
    var tokenReq = Platform_Profile_DeviceDetailRequest()
    tokenReq.uId = deviceJson["uId"].stringValue
    tokenReq.idToken = deviceJson["idToken"].stringValue
    tokenReq.platform = deviceJson["platform"].stringValue
    tokenReq.buildCodeVersion = deviceJson["buildCodeVersion"].stringValue
    tokenReq.osVersion = deviceJson["osVersion"].stringValue
    tokenReq.appVersion = deviceJson["appVersion"].stringValue
    tokenReq.deviceId = deviceJson["deviceId"].stringValue
    tokenReq.deviceModel = deviceJson["deviceModel"].stringValue
    tokenReq.deviceMake = deviceJson["deviceMake"].stringValue
    tokenReq.deviceName = deviceJson["deviceName"].stringValue
    tokenReq.fcmToken = deviceJson["fcmToken"].exists() ? deviceJson["fcmToken"].stringValue: ""
    return tokenReq
  }

  private static func createDeactivateProfileRequest(deviceJson: JSON) -> Platform_Profile_DeactivateProfileRequest {
    var tokenReq = Platform_Profile_DeactivateProfileRequest()
    tokenReq.uId = deviceJson["uId"].stringValue
    return tokenReq
  }

  private static func createFederatedItentity(idToken: String, profileJson: JSON) -> federatedIdentityFederatedIdentity {



    let profile = federatedIdentityAuthenticatedOnlineProfile()
    profile.identityType = getFederatedIdentityType(identityType: profileJson["profile"]["identityType"].stringValue)

    if profile.identityType == federatedIdentityIdentityType.anonymous {
      profile.anonymous = true
    }

    if profile.identityType == federatedIdentityIdentityType.firebaseEmail {
      let providerData = federatedIdentityFirebaseEmailProviderData()
      providerData.uid = profileJson["profile"]["firebaseEmailProviderData"]["uid"].stringValue
      providerData.displayName = profileJson["profile"]["firebaseEmailProviderData"]["displayName"].exists() ? profileJson["profile"]["firebaseEmailProviderData"]["displayName"].stringValue:""
      providerData.photoURL = profileJson["firebaseEmailProviderData"]["photoURL"].exists() ? profileJson["profile"]["firebaseEmailProviderData"]["photoURL"].stringValue:""
      providerData.providerId = profileJson["profile"]["firebaseEmailProviderData"]["providerId"].exists() ? profileJson["profile"]["firebaseEmailProviderData"]["providerId"].stringValue:""
      providerData.emailArray = []

      if profileJson["profile"]["firebaseEmailProviderData"]["email"].exists() {
        if let emails = profileJson["profile"]["firebaseEmailProviderData"]["email"].array {
          for emailItem in emails {
            providerData.emailArray.add(emailItem.stringValue)
          }
        }
      }

      providerData.phoneNumberArray = []

      if profileJson["profile"]["firebaseEmailProviderData"]["phoneNumber"].exists() {
        if let emails = profileJson["profile"]["firebaseEmailProviderData"]["phoneNumber"].array {
          for emailItem in emails {
            providerData.phoneNumberArray.add(emailItem.stringValue)
          }
        }
      }

      profile.firebaseEmailProviderData = providerData
    }

    if profile.identityType == federatedIdentityIdentityType.socialGoogle {
      let providerData = federatedIdentityGoogleProviderData()
      providerData.uid = profileJson["profile"]["googleProviderData"]["uid"].stringValue
      providerData.displayName = profileJson["profile"]["googleProviderData"]["displayName"].exists() ? profileJson["profile"]["googleProviderData"]["displayName"].stringValue:""
      providerData.photoURL = profileJson["profile"]["googleProviderData"]["photoURL"].exists() ? profileJson["profile"]["googleProviderData"]["photoURL"].stringValue:""
      providerData.providerId = profileJson["googleProviderData"]["providerId"].exists() ? profileJson["profile"]["googleProviderData"]["providerId"].stringValue:""
      providerData.emailArray = []

      if profileJson["profile"]["googleProviderData"]["email"].exists() {
        if let emails = profileJson["profile"]["googleProviderData"]["email"].array {
          for emailItem in emails {
            providerData.emailArray.add(emailItem.stringValue)
          }
        }
      }

      providerData.phoneNumberArray = []

      if profileJson["profile"]["googleProviderData"]["phoneNumber"].exists() {
        if let emails = profileJson["profile"]["googleProviderData"]["phoneNumber"].array {
          for emailItem in emails {
            providerData.phoneNumberArray.add(emailItem.stringValue)
          }
        }
      }

      profile.googleProviderData = providerData
    }

    if profile.identityType == federatedIdentityIdentityType.socialFacebook {
      let providerData = federatedIdentityFacebookProviderData()
      providerData.uid = profileJson["profile"]["facebookProviderData"]["uid"].stringValue
      providerData.displayName = profileJson["profile"]["facebookProviderData"]["displayName"].exists() ? profileJson["profile"]["facebookProviderData"]["displayName"].stringValue:""
      providerData.photoURL = profileJson["profile"]["facebookProviderData"]["photoURL"].exists() ? profileJson["profile"]["facebookProviderData"]["photoURL"].stringValue:""
      providerData.providerId = profileJson["profile"]["facebookProviderData"]["providerId"].exists() ? profileJson["profile"]["facebookProviderData"]["providerId"].stringValue:""
      providerData.emailArray = []

      if profileJson["profile"]["facebookProviderData"]["email"].exists() {
        if let emails = profileJson["profile"]["facebookProviderData"]["email"].array {
          for emailItem in emails {
            providerData.emailArray.add(emailItem.stringValue)
          }
        }
      }

      providerData.phoneNumberArray = []

      if profileJson["profile"]["facebookProviderData"]["phoneNumber"].exists() {
        if let emails = profileJson["profile"]["facebookProviderData"]["phoneNumber"].array {
          for emailItem in emails {
            providerData.phoneNumberArray.add(emailItem.stringValue)
          }
        }
      }

      profile.facebookProviderData = providerData
    }


    if profile.identityType == federatedIdentityIdentityType.socialApple {
      let providerData = federatedIdentityAppleProviderData()
      providerData.uid = profileJson["profile"]["appleProviderData"]["uid"].stringValue
      providerData.displayName = profileJson["profile"]["appleProviderData"]["displayName"].exists() ? profileJson["profile"]["appleProviderData"]["displayName"].stringValue:""
      providerData.photoURL = profileJson["profile"]["appleProviderData"]["photoURL"].exists() ? profileJson["profile"]["appleProviderData"]["photoURL"].stringValue:""
      providerData.providerId = profileJson["profile"]["appleProviderData"]["providerId"].exists() ? profileJson["profile"]["appleProviderData"]["providerId"].stringValue:""
      providerData.emailArray = []

      if profileJson["profile"]["appleProviderData"]["email"].exists() {
        if let emails = profileJson["profile"]["appleProviderData"]["email"].array {
          for emailItem in emails {
            providerData.emailArray.add(emailItem.stringValue)
          }
        }
      }

      providerData.phoneNumberArray = []

      if profileJson["profile"]["appleProviderData"]["phoneNumber"].exists() {
        if let emails = profileJson["profile"]["appleProviderData"]["phoneNumber"].array {
          for emailItem in emails {
            providerData.phoneNumberArray.add(emailItem.stringValue)
          }
        }
      }

      profile.appleProviderData = providerData
    }

    profile.uId = profileJson["profile"]["uId"].stringValue

    let authCredentials = federatedIdentityAuthCredentials()
    authCredentials.idToken = idToken
    profile.authCredentials = authCredentials

    let federatedIdentity = federatedIdentityFederatedIdentity()
    federatedIdentity.profile = profile

    return federatedIdentity
  }

  private static func createSelfAttestIntroSittingRequest(idToken: String, selfAttestIntroSittingJson: JSON) -> Platform_Profile_SelfAttestIntroSittingRequest {

    let request = Platform_Profile_SelfAttestIntroSittingRequest()

    request.idToken = idToken
    request.uId = selfAttestIntroSittingJson["uId"].stringValue
    request.notes = selfAttestIntroSittingJson["notes"].stringValue
    switch(selfAttestIntroSittingJson["channel"].stringValue){
    case "MASTER_SITTING":
      request.channel = Platform_Profile_IntroSittingChannel.masterSitting
      break;
    case "MASTER_CLASSES":
      request.channel = Platform_Profile_IntroSittingChannel.masterClasses
      break;
    case "PRECEPTOR_SITTING":
      request.channel = Platform_Profile_IntroSittingChannel.preceptorSitting
      break;
    case "EVENT":
      request.channel = Platform_Profile_IntroSittingChannel.event
      break;
    case "WEBSITE_OR_YOUTUBE":
      request.channel = Platform_Profile_IntroSittingChannel.websiteOrYoutube
      break;
    case "HEARTSAPP":
      request.channel = Platform_Profile_IntroSittingChannel.heartsapp
      break;
    default:
      request.channel = Platform_Profile_IntroSittingChannel.none
    }
    return request
  }

  private static func getFederatedIdentityType(identityType: String) -> federatedIdentityIdentityType {
    switch identityType {
      case "ANONYMOUS":
        return federatedIdentityIdentityType.anonymous
      case "SOCIAL_GOOGLE":
        return federatedIdentityIdentityType.socialGoogle
      case "SOCIAL_FACEBOOK":
      return federatedIdentityIdentityType.socialFacebook
      case "SOCIAL_APPLE":
      return federatedIdentityIdentityType.socialApple
      case "FIREBASE_EMAIL":
      return federatedIdentityIdentityType.firebaseEmail
      default:
        return federatedIdentityIdentityType.anonymous
    }

  }

  private static func createSupportRequest(idToken: String, supportRequestJson: JSON) -> Platform_Profile_SupportRequest {

    let request = Platform_Profile_SupportRequest()

    request.uId = supportRequestJson["uId"].stringValue
    request.comment = supportRequestJson["comment"].stringValue
    request.userEmail = supportRequestJson["userEmail"].stringValue
    request.userName = supportRequestJson["userName"].stringValue
    request.userPhone = supportRequestJson["userPhone"].exists() ? supportRequestJson["userPhone"].stringValue:""
    request.extras = NSMutableDictionary()
    request.extras.addEntries(from: supportRequestJson["extras"].dictionary!)
    return request
  }

  private static func createLogRequest(idToken: String, logRequestJson: JSON) -> Platform_Profile_LogRequest {
     let request = Platform_Profile_LogRequest()
     request.uId = logRequestJson["uId"].stringValue
     request.logsArray = []

     if let logLines = logRequestJson["logs"].array {

       for logLine in logLines {
         let logLineObj = Platform_Profile_Log()

         logLineObj.time = GPBTimestamp()
         logLineObj.time.seconds = logLine["time"]["seconds"].int64Value

        logLineObj.message = logLine["message"].stringValue
        logLineObj.payload = NSMutableDictionary()
        if let payload = logLine["payload"].dictionary {
          for (_,(key, value)) in payload.enumerated() {
            logLineObj.payload.setValue(value.rawString(), forKey: key)
          }
        }
        request.logsArray.add(logLineObj)
       }
     }

     return request
   }

  private static func createSittingDatesRequest(idToken: String, requestJson: JSON) -> Platform_Profile_SittingDateRequest {

    let request = Platform_Profile_SittingDateRequest()

    request.uId = requestJson["uId"].stringValue
    request.sittingDate = requestJson["sittingDate"].stringValue
    request.sittingNumber = requestJson["sittingNumber"].int32Value
    return request
  }
  
   private static func createSaveUserPreferencesRequest(_ messageJson: JSON) -> Platform_Profile_SaveUserPreferencesRequest {
    let requestJson = messageJson["userPreferences"]

    let userPreferenceReq = Platform_Profile_SaveUserPreferencesRequest()
    userPreferenceReq.uId = messageJson["uId"].stringValue
    userPreferenceReq.shouldPlayRelaxationAudioBeforeMeditation = requestJson["shouldPlayRelaxationAudioBeforeMeditation"].boolValue
    userPreferenceReq.isSubscribedToWeeklyInspiration = requestJson["isSubscribedToWeeklyInspiration"].boolValue
    userPreferenceReq.language = requestJson["language"].stringValue
    userPreferenceReq.timeOfConsent.seconds = requestJson["timeOfConsent"].int64Value
    
    userPreferenceReq.timeOfConsent = GPBTimestamp()
    userPreferenceReq.isMorningMeditationReminderEnabled = requestJson["isMorningMeditationReminderEnabled"].boolValue
    userPreferenceReq.morningMeditationTime.seconds = requestJson["morningMeditationTime"].int64Value
    userPreferenceReq.isEveningMeditationReminderEnabled = requestJson["isEveningMeditationReminderEnabled"].boolValue
    userPreferenceReq.eveningCleaningTime.seconds = requestJson["eveningCleaningTime"].int64Value
    userPreferenceReq.isReminderForNextSittingEnabled = requestJson["isReminderForNextSittingEnabled"].boolValue
    userPreferenceReq.nextSittingReminderIntervalInDays = requestJson["nextSittingReminderIntervalInDays"].int32Value

    return userPreferenceReq
  }

   private static func createUpdateProfilePictureRequest( requestJson: JSON) -> Platform_Profile_UpdateProfilePictureRequest {

    let request = Platform_Profile_UpdateProfilePictureRequest()

    request.uId = requestJson["uId"].stringValue
    if let pictureData = Data(base64Encoded: requestJson["pictureData"].stringValue){
      request.pictureData = pictureData
    }
    let path = URL.init(fileURLWithPath: requestJson["pictureName"].stringValue)
    request.pictureName = path.lastPathComponent
    return request
  }
}
