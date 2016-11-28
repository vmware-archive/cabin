//
//  SKPNetwork.m
//  skippbox
//
//  Created by Remi Santos on 28/09/2016.
//  Copyright © 2016 Azendoo. All rights reserved.
//

#import "SKPNetwork.h"

@implementation SKPNetwork

+ (SKPNetwork*)shared{
  static SKPNetwork *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}

- (id)init {
  if (self = [super init]) {
    _certificatePaths = [NSMutableDictionary new];
  }
  return self;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(fetch:(NSString*)url
                  params:(NSDictionary*)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
  NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate:self delegateQueue:[NSOperationQueue mainQueue]];
  
  NSURL *URL = [NSURL URLWithString:url];
  NSMutableURLRequest * urlRequest = [NSMutableURLRequest requestWithURL:URL];
  NSDictionary *headers = params[@"headers"];
  if (headers) {
    for (NSString* key in headers) {
      [urlRequest addValue:headers[key] forHTTPHeaderField:key];
    }
  }
  [urlRequest setHTTPMethod:[(NSString*)params[@"method"] uppercaseString]];
  if (params[@"body"]) {
    [urlRequest setHTTPBody:[params[@"body"] dataUsingEncoding:NSUTF8StringEncoding]];
  }
  if (params[@"certificate"]) {
    [SKPNetwork shared].certificatePaths[URL.host] = params[@"certificate"];
  }
  
  NSURLSessionDataTask * dataTask =[defaultSession dataTaskWithRequest:urlRequest
                                                     completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
    if (error != nil)
    {
      reject([@(error.code) stringValue], [error localizedDescription], nil);
    } else {
      NSString *text = [[NSString alloc] initWithData: data encoding: NSUTF8StringEncoding];
      resolve(@{@"text":text, @"ok":@(true)});
    }
  }];
  [dataTask resume];
}

-(void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential * _Nullable))completionHandler
{
  void (^defaultCompletionBlock)() = ^{
    completionHandler(NSURLSessionAuthChallengeUseCredential, [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust]);
  };
  NSString* host = challenge.protectionSpace.host;
  NSDictionary* certificate = [SKPNetwork shared].certificatePaths[host];
  if (certificate == nil) {
    return defaultCompletionBlock();
  }
  CFStringRef password = certificate[@"password"] ? (__bridge CFStringRef)certificate[@"password"] : CFSTR("");
  NSString *path = [[[NSBundle mainBundle] bundlePath] stringByAppendingString:[NSString stringWithFormat:@"/%@", certificate[@"path"]]];
  NSData *certData = [[NSFileManager defaultManager] contentsAtPath:path];
  if (!certData) {
    return defaultCompletionBlock();
  }
  CFDataRef inCertdata = (__bridge CFDataRef)certData;
  
  SecIdentityRef myIdentity;
  SecTrustRef myTrust;
  extractIdentityAndTrust(password, inCertdata, &myIdentity, &myTrust);
  
  SecCertificateRef myCertificate;
  SecIdentityCopyCertificate(myIdentity, &myCertificate);
  const void *certs[] = { myCertificate };
  CFArrayRef certsArray = CFArrayCreate(NULL, certs, 1, NULL);
  
  NSURLCredential *credential = [NSURLCredential credentialWithIdentity:myIdentity certificates:(__bridge NSArray*)certsArray persistence:NSURLCredentialPersistencePermanent];
  completionHandler(NSURLSessionAuthChallengeUseCredential, credential);
}

OSStatus extractIdentityAndTrust(CFStringRef password, CFDataRef inP12data, SecIdentityRef *identity, SecTrustRef *trust)
{
  OSStatus securityError = errSecSuccess;
  
  const void *keys[] = { kSecImportExportPassphrase };
  const void *values[] = { password };
  
  CFDictionaryRef options = CFDictionaryCreate(NULL, keys, values, 1, NULL, NULL);
  
  CFArrayRef items = CFArrayCreate(NULL, 0, 0, NULL);
  securityError = SecPKCS12Import(inP12data, options, &items);
  
  if (securityError == 0) {
    CFDictionaryRef myIdentityAndTrust = CFArrayGetValueAtIndex(items, 0);
    const void *tempIdentity = NULL;
    tempIdentity = CFDictionaryGetValue(myIdentityAndTrust, kSecImportItemIdentity);
    *identity = (SecIdentityRef)tempIdentity;
    const void *tempTrust = NULL;
    tempTrust = CFDictionaryGetValue(myIdentityAndTrust, kSecImportItemTrust);
    *trust = (SecTrustRef)tempTrust;
  }
  
  if (options) {
    CFRelease(options);
  }
  
  return securityError;
}
@end
