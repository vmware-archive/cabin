//
//  SKPNetwork.h
//  skippbox
//
//  Created by Remi Santos on 28/09/2016.
//  Copyright © 2016 Skippbox. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@interface SKPNetwork : NSObject <RCTBridgeModule, NSURLSessionDelegate>

@property (nonatomic, strong) NSMutableDictionary* certificatePaths;

OSStatus extractIdentityAndTrust(CFStringRef password, CFDataRef inP12data, SecIdentityRef *identity, SecTrustRef *trust);

@end
