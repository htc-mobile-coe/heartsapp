
import Foundation
import SwiftyJSON

@objc(DonationService)
class DonationClientService: NSObject {
  
  var bridge: RCTBridge!
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
    }
  
  //TODO: see if a private pool can be implemented
  private static var donationClient = Platform_Donation_DonationService.init(host: Environment.current.donationService)
  
  @objc func fetchDonationItems(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    
    print("fetchDonationItems $$$$$$ : \(input)")
    
    do {
      let request = try donationFetchItemsRequest(input: input as! [String : Any])
      var rpc : GRPCProtoCall!
      DonationClientService.getAuthenticatedClient { (client) in
        rpc = client.rpcToFetchDonationItems(with: request) { (response:Platform_Donation_FetchDonationItemsResponse?, error:Error?) in
          guard let donation = response else {
            reject("", "", error)
            return
          }
          log.debug("🦊 fetchDonationItems Call response: \(donation)")
          DispatchQueue.main.async {
            resolve(self.mapDonationItem(item: donation))
          }
        }
      }
      
      ServiceUtil.addAuthHeader(authToken: request.idToken, rpc: rpc)
      rpc.start()
    } catch {
      reject("error during fetchDonationItems","", error)
    }
  }
  
  
  @objc func fetchDonations(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    
    print("fetchDonationItems $$$$$$ : \(input)")
    
    do {
      let request = try fetchDonationRequest(input: input as! [String : Any])
      var rpc : GRPCProtoCall!
      DonationClientService.getAuthenticatedClient { (client) in
        rpc = client.rpcToFetchDonations(with: request) { (response :Platform_Donation_FetchDonationsResponse?, error) in
          guard let donation = response else {
            reject("", "", error)
            return
          }
          log.debug("🦊 fetchDonations Call response: \(donation)")
          DispatchQueue.main.async {
            resolve(donation)
          }
        }
      }
      ServiceUtil.addAuthHeader(authToken: request.idToken, rpc: rpc)
      rpc.start()
    } catch {
      reject("error during fetchDonations","", error)
    }
  }
  
  @objc func donate(
    _ input: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock)  {
    
    print("donate $$$$$$ : \(input)")
    
    do {
      let request = try donationRequest(input: input as! [String : Any])
      var rpc : GRPCProtoCall!
      DonationClientService.getAuthenticatedClient { (client) in
       rpc = client.rpcToDonate(with: request) { (response:Platform_Donation_DonateResponse?, error) in
          guard let donation = response else {
            reject("\(error?._code ?? 3)",
            "error:\(error?.localizedDescription ?? "unkown error")" ,
                 NSError.init(domain: "com.donation.service", code: 3, userInfo: [NSLocalizedDescriptionKey: error?.localizedDescription ?? "unkown error"]))
            return
          }
          log.debug("🦊 donation Call response: \(donation)")
          DispatchQueue.main.async {
            resolve(self.mapDonationUserProfile(item: donation))
          }
        }
      }
      ServiceUtil.addAuthHeader(authToken: request.idToken, rpc: rpc)
      rpc.start()
    } catch {
      reject("error during post donation","", error)
    }
  }
  
  // MARK: - Private Methods
  
  /// Execute all calls on the same client
  ///
  ///   - completion: A closure executed with the following response parameters:
  ///   - profileServiceClient: single instance client.
  private static func getAuthenticatedClient(completion: @escaping (_ client: Platform_Donation_DonationService) -> Void) {
    //TODO: what check to perform for validity of profile client
    completion(donationClient)
    
  }
}



//MARK:- Request
extension DonationClientService{
  
  func donationFetchItemsRequest(input:[String:Any])throws ->Platform_Donation_FetchDonationItemsRequest{
    
    guard let message = input["message"] as? String else {
      throw NSError.init(domain: "", code: 100, userInfo: [NSLocalizedDescriptionKey : "invalid message"])
    }
    let json =  JSON(parseJSON: message)
    
    let request = Platform_Donation_FetchDonationItemsRequest.init();
    request.idToken = json["idToken"].stringValue
    request.userId = json["uId"].stringValue
    request.citizenshipCountry = json["citizenshipCountry"].stringValue
    
    return request
  }
  
  func fetchDonationRequest(input:[String:Any])throws ->Platform_Donation_FetchDonationsRequest{
    
    guard let message = input["message"] as? String else {
      throw NSError.init(domain: "", code: 100, userInfo: [NSLocalizedDescriptionKey : "invalid message"])
    }
    let json =  JSON(parseJSON: message)
    
    let request = Platform_Donation_FetchDonationsRequest.init();
    request.idToken = json["idToken"].stringValue
    request.userId = json["uId"].stringValue
    
    return request
  }
  
  func donationRequest(input:[String:Any])throws ->Platform_Donation_DonateRequest{
    
    guard let message = input["message"] as? String else {
      throw NSError.init(domain: "", code: 100, userInfo: [NSLocalizedDescriptionKey : "invalid message"])
    }
    let json =  JSON(parseJSON: message)
    let requestObj = json["request"].dictionary;

    let userProfileObj = requestObj!["userProfile"]!.dictionary!;
    let lineItems = requestObj!["lineItems"]!.array!.first!;
    let donationItemObj = lineItems["donationItem"].dictionary!

    let profile = Platform_Donation_UserProfile()
    profile.userId = userProfileObj["userId"]?.stringValue
    profile.citizenshipCountry = userProfileObj["citizenshipCountry"]?.stringValue
    profile.firstName = userProfileObj["firstName"]?.stringValue
    profile.lastName = userProfileObj["lastName"]?.stringValue
    profile.addressLine1 = userProfileObj["addressLine1"]?.stringValue
    profile.addressLine2 = userProfileObj["addressLine2"]?.stringValue
    profile.postalCode = userProfileObj["postalCode"]?.stringValue
    profile.city = userProfileObj["city"]?.stringValue
    profile.state = userProfileObj["state"]?.stringValue
    profile.country = userProfileObj["country"]?.stringValue
    profile.emailAddress = userProfileObj["emailAddress"]?.stringValue
    profile.phoneNumber = userProfileObj["phoneNumber"]?.stringValue
    profile.taxId = userProfileObj["taxId"]?.stringValue
    profile.memberId = userProfileObj["memberId"]?.stringValue

    let donationLineItem = Platform_Donation_DonationLineItem()
    donationLineItem.donationId = lineItems["id"].stringValue
    donationLineItem.amount = lineItems["amount"].doubleValue
    donationLineItem.currency = lineItems["currency"].stringValue
    donationLineItem.isRecurring = lineItems["isRecurring"].boolValue
    donationLineItem.recurringStartDate = lineItems["recurringStartDate"].stringValue
    donationLineItem.recurringFrequency = lineItems["recurringFrequency"].stringValue

    let donationItem = Platform_Donation_DonationItem()
    donationItem.billingAccountName = donationItemObj["billingAccountName"]?.stringValue
    donationItem.currency = donationItemObj["currency"]?.stringValue
    donationItem.region = donationItemObj["region"]?.stringValue
    donationItem.name = donationItemObj["name"]?.stringValue
    donationItem.id_p = donationItemObj["id"]?.stringValue
    donationItem.description_p = donationItemObj["description"]?.stringValue
    donationItem.isActive = donationItemObj["isActive"]?.boolValue ?? false

    donationLineItem.donationItem = donationItem;
    
    
    let request = Platform_Donation_DonateRequest.init();
    request.idToken = json["idToken"].stringValue
    request.userId = json["uId"].stringValue
    
    request.donationLineItemsArray = [donationLineItem];
    request.userProfile = profile;
    
    return request
  }
  
}

//MARK:- Mapper
extension DonationClientService{
  
  func mapDonationItem(item: Platform_Donation_FetchDonationItemsResponse)->Any?{
    
    var response = DonationDonationItemResponse.init(userId: item.userId,
                                                     citizenshipCountry: item.citizenshipCountry,
                                                     donationItemsArray_Count: item.donationItemsArray_Count)
    
    for  model in item.donationItemsArray {
      let donationItem = model as! Platform_Donation_DonationItem
      let mapItem = DonationDonationItemModel(id: donationItem.id_p, name: donationItem.name,
                                              description: donationItem.description_p, region: donationItem.region,
                                              currency: donationItem.currency, billingAccountName: donationItem.billingAccountName)
      response.donationItems.append(mapItem)
    }
    
    return response.jsonString
  }
  
  func mapDonationUserProfile(item :Platform_Donation_DonateResponse)->Any?{
    
    let payment = PaymentModel(id: item.donation.payment.id_p, paymentStatus: item.donation.payment.paymentStatus, currency: item.donation.payment.currency, amount: item.donation.payment.amount, trackingId: item.donation.payment.trackingId)

    let donation = DonationModel(id: item.donation.id_p, status: item.donation.status, currency: item.donation.currency, amount: item.donation.amount, payment: payment)

    let response = DonationResponse.init(paymentGatewayUrl: item.paymentGatewayURL, paymentGatewayRequestMethod: item.paymentGatewayRequestMethod, paymentGatewayRequestParamMap: item.paymentGatewayRequestParamMap, userId: item.userId, donation: donation);
    
    return response.jsonString
  }
  
}
