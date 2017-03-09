//
//  RCTSRWebSocket+SSL.m
//  skippbox
//
//  Created by Remi Santos on 02/12/2016.
//  Copyright © 2016 Skippbox. All rights reserved.
//

#import "RCTSRWebSocket+SSL.h"
#import "SKPNetwork.h"
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
  
  NSOutputStream *_outputStream = [self valueForKey:@"_outputStream"];
  NSMutableDictionary<NSString *, id> *SSLOptions = [NSMutableDictionary new];

  
  BOOL _secure = [[self valueForKey:@"_secure"] boolValue];
  if (_secure) {
    NSMutableURLRequest *request = [self valueForKey:@"_urlRequest"];
    NSDictionary *headers = request.allHTTPHeaderFields;
    if (headers[@"auth-certificate"]) {
      NSString *certificatePath = headers[@"auth-certificate"];
      CFStringRef password = headers[@"auth-password"] ? (__bridge CFStringRef)headers[@"auth-password"] : CFSTR("");
      NSString *documentPath = [[NSFileManager defaultManager] URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil].path;
      NSString *path = [documentPath stringByAppendingPathComponent: certificatePath];
      NSData *certData = [[NSFileManager defaultManager] contentsAtPath:path];
      
      if (certData && certData.length > 0) {
        CFDataRef inCertdata = (__bridge CFDataRef)certData;
        SecIdentityRef myIdentity;
        SecTrustRef myTrust;
        OSStatus error = extractIdentityAndTrust(password, inCertdata, &myIdentity, &myTrust);
        if (error == 0) {
          SecCertificateRef myCertificate;
          SecIdentityCopyCertificate(myIdentity, &myCertificate);
          if (myCertificate) {
            NSArray *certs = [[NSArray alloc] initWithObjects:(__bridge id)myIdentity, (__bridge id)myCertificate, nil];
            [SSLOptions setObject:certs forKey:(NSString *)kCFStreamSSLCertificates];
          }
        }
      }
    }
    [_outputStream setProperty:(__bridge id)kCFStreamSocketSecurityLevelNegotiatedSSL forKey:(__bridge id)kCFStreamPropertySocketSecurityLevel];
    
    [SSLOptions setValue:@NO forKey:(__bridge id)kCFStreamSSLValidatesCertificateChain];
    
    [_outputStream setProperty:SSLOptions forKey:(__bridge id)kCFStreamPropertySSLSettings];
  }
}

@end
