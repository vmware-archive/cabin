//
//  GRPCManager.m
//  skippbox
//
//  Created by Remi Santos on 27/07/16.
//  Copyright © 2016 Azendoo. All rights reserved.
//

#import "GRPCManager.h"
#import "RCTLog.h"
#import <GRPCClient/GRPCCall+Tests.h>
#import "hapi/services/Tiller.pbrpc.h"

@implementation GRPCManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(listReleases:(NSString*)host
                      resolver:(RCTPromiseResolveBlock)resolve
                      rejecter:(RCTPromiseRejectBlock)reject)
{
  [GRPCCall useInsecureConnectionsForHost:host];
  
  NSMutableArray *releases = [NSMutableArray new];
  ReleaseService *service = [[ReleaseService alloc] initWithHost:host];
  ListReleasesRequest *request = [[ListReleasesRequest alloc] init];
  [service listReleasesWithRequest:request eventHandler:^(BOOL done, ListReleasesResponse * _Nullable response, NSError * _Nullable error) {
    if (response) {
      for (Release *release in response.releasesArray) {
        [releases addObject:release.name];
      }
    }
    if (done) {
      resolve(releases);
    }
  }];
}
@end