//
//  DonationResponse.swift
//  heartsapp
//
//  Created by Alex Appadurai on 22/09/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

struct DonationResponse: Encodable {
  let paymentGatewayUrl:String?
  let paymentGatewayRequestMethod:String?
  let paymentGatewayRequestParamMap:String?
  let userId:String?
  
  let donation:DonationModel?
}

struct DonationModel: Encodable{
  let id:String?
  let status:String?
  let currency:String?
  let amount:Double?
  let payment:PaymentModel?

}

struct PaymentModel: Encodable{
  let id:String?
  let paymentStatus:String?
  let currency:String?
  let amount:Double?
  let trackingId:String?
}
