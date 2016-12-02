//
//  RCTSRWebSocket+SSL.m
//  skippbox
//
//  Created by Remi Santos on 02/12/2016.
//  Copyright © 2016 Azendoo. All rights reserved.
//

#import "RCTSRWebSocket+SSL.h"
//#import "RCTSRWebSocket.m"
#import <objc/runtime.h>

@implementation RCTSRWebSocket (SSL)

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    Class class = [self class];
    
    SEL originalSelector = @selector(_initializeStreams);
    SEL swizzledSelector = @selector(swizzled_initializeStreams);
    
    Method originalMethod = class_getInstanceMethod(class, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
    
    BOOL didAddMethod =
    class_addMethod(class,
                    originalSelector,
                    method_getImplementation(swizzledMethod),
                    method_getTypeEncoding(swizzledMethod));
    
    if (didAddMethod) {
      class_replaceMethod(class,
                          swizzledSelector,
                          method_getImplementation(originalMethod),
                          method_getTypeEncoding(originalMethod));
    } else {
      method_exchangeImplementations(originalMethod, swizzledMethod);
    }
  });
}

#pragma mark - Method Swizzling

- (void)swizzled_initializeStreams {
  [self swizzled_initializeStreams];
  BOOL _secure = [[self valueForKey:@"_secure"] boolValue];
  if (_secure) {
    NSOutputStream *_outputStream = [self valueForKey:@"_outputStream"];
    NSMutableDictionary<NSString *, id> *SSLOptions = [NSMutableDictionary new];

    [_outputStream setProperty:(__bridge id)kCFStreamSocketSecurityLevelNegotiatedSSL forKey:(__bridge id)kCFStreamPropertySocketSecurityLevel];
    
    [SSLOptions setValue:@NO forKey:(__bridge id)kCFStreamSSLValidatesCertificateChain];
    
    [_outputStream setProperty:SSLOptions
                        forKey:(__bridge id)kCFStreamPropertySSLSettings];
  }
}

@end
