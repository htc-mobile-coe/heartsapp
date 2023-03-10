//
//  SubscriptionBridge.m
//  heartsapp
//
//  Created by Yogesh Pandey on 22/01/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SubscriptionService, NSObject)

RCT_EXTERN_METHOD(submitFeedbackToHelpDesk:(nonnull NSDictionary *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

@end
