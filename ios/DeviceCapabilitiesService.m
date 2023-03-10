//
//  DeviceCapabilitiesService.m
//  heartsapp
//
//  Created by havarma on 28/03/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DeviceCapabilitiesService, NSObject)


RCT_EXTERN_METHOD(hasDoNotDisturbPermission:(nonnull NSDictionary *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(requestDoNotDisturbPermission:(nonnull NSDictionary *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(enableDoNotDisturbMode:(nonnull NSDictionary *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )


RCT_EXTERN_METHOD(disableDoNotDisturbMode:(nonnull NSDictionary *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

@end
