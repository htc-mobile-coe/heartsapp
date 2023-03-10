//
//  DonationDonationItemModel.swift
//  heartsapp
//
//  Created by Alex Appadurai on 22/09/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

struct DonationDonationItemResponse:Encodable {
  
  let userId:String?
  
  let citizenshipCountry:String?
  
  let donationItemsArray_Count:UInt?
  
  var donationItems = [DonationDonationItemModel]()
  
}

struct DonationDonationItemModel :Encodable {
  
  let id:String?
  
  let name:String?
  
  let description:String?
  
  let region:String?
  
  let currency:String?
  
  let billingAccountName:String?
}
