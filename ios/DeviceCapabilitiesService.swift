//
//  DeviceCapabilities.swift
//  heartsapp
//
//  Created by havarma on 28/03/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

@objc(DeviceCapabilitiesService)
class DeviceCapabilities: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
    }
  
  @objc func hasDoNotDisturbPermission(
  _ input: NSDictionary,
  resolver resolve: @escaping RCTPromiseResolveBlock,
  rejecter reject: @escaping RCTPromiseRejectBlock)  {
    resolve(true)
  }
  
  @objc func requestDoNotDisturbPermission(
  _ input: NSDictionary,
  resolver resolve: @escaping RCTPromiseResolveBlock,
  rejecter reject: @escaping RCTPromiseRejectBlock)  {
    resolve(true)
  }
  
  @objc func enableDoNotDisturbMode(
  _ input: NSDictionary,
  resolver resolve: @escaping RCTPromiseResolveBlock,
  rejecter reject: @escaping RCTPromiseRejectBlock)  {
    resolve(true)
  }
  
  @objc func disableDoNotDisturbMode(
  _ input: NSDictionary,
  resolver resolve: @escaping RCTPromiseResolveBlock,
  rejecter reject: @escaping RCTPromiseRejectBlock)  {
    resolve(true)
  }
}
