//
//  HelloGRPC.m
//  heartsapp
//
//  Created by Ashima Sharma on 11/22/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(HelloGRPC, NSObject)

RCT_EXTERN_METHOD(callGRPC:(nonnull NSDictionary *)input
resolver:(RCTPromiseResolveBlock)resolve
rejecter:(RCTPromiseRejectBlock)reject
)
@end
