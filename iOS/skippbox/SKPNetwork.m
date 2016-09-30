//
//  SKPNetwork.m
//  skippbox
//
//  Created by Remi Santos on 28/09/2016.
//  Copyright © 2016 Azendoo. All rights reserved.
//

#import "SKPNetwork.h"

@implementation SKPNetwork


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
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:params[@"body"] options:0 error:nil]];
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
  completionHandler(NSURLSessionAuthChallengeUseCredential, [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust]);
}
@end
