//
//  HelloGRPC.swift
//  heartsapp
//
//  Created by Ashima Sharma on 11/22/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation


@objc(HelloGRPC)
class HelloGRPC: NSObject {
  
  var bridge: RCTBridge!
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
    }
  
  @objc func callGRPC(_ input: NSDictionary, resolver resolve: RCTPromiseResolveBlock,
  rejecter reject:RCTPromiseRejectBlock)  {
    print("Input String $$$$$$ : \(input)")
    resolve("Hello From native")
  }
}
