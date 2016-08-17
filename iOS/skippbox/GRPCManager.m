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
#import <AFNetworking/AFNetworking.h>
#import "hapi/services/Tiller.pbrpc.h"
#import "hapi/chart/Metadata.pbobjc.h"
#import "hapi/chart/Template.pbobjc.h"
//#import <tarkit/DCTar.h>
#import <NVHTarGzip/NVHTarGzip.h>
#import <YAMLThatWorks/YATWSerialization.h>

@implementation GRPCManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(listReleases:(NSString*)host
                      resolver:(RCTPromiseResolveBlock)resolve
                      rejecter:(RCTPromiseRejectBlock)reject)
{
  [GRPCCall useInsecureConnectionsForHost:host];
  
  NSMutableArray *releases = [NSMutableArray new];
  ReleaseService *service = [[ReleaseService alloc] initWithHost:host];

//  ListReleasesRequest *request = [[ListReleasesRequest alloc] init];
//  [service listReleasesWithRequest:request eventHandler:^(BOOL done, ListReleasesResponse * _Nullable response, NSError * _Nullable error) {
//    if (response) {
//      for (Release *release in response.releasesArray) {
//        [releases addObject:release.name];
//      }
//    }
//    if (done) {
//      resolve(releases);
//    }
//  }];
  
  [self downloadFileAtUrl:@"http://storage.googleapis.com/kubernetes-charts-testing/jenkins-0.2.0.tgz" completion:^(NSURL *filePath) {
    NSURL *documentsDirectoryURL = [[NSFileManager defaultManager] URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil];
    NSURL *toPath = [documentsDirectoryURL URLByAppendingPathComponent:@"chart"];
    NSError *error;
    NSLog(@"Decrompressing file...");
    BOOL untared = [[NVHTarGzip sharedInstance] unTarGzipFileAtPath:filePath.path toPath:toPath.path error:&error];
    if (error) {
      error ? NSLog(@"ERROR %@", [error description]) : NSLog(@"failed");
      reject([@(error.code) stringValue], [error description], error);
      return;
    }
    if (!untared) {
      reject(0, @"Untar failed", nil);
      return;
    }

    NSLog(@"File decompressed at path %@", toPath.path);
    NSString *chartName = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:toPath.path error:nil][0];
    toPath = [toPath URLByAppendingPathComponent:chartName];

    InstallReleaseRequest *request = [[InstallReleaseRequest alloc] init];
    Chart *chart = [[Chart alloc] init];
    
    // Metadata
    NSData *chartData = [NSData dataWithContentsOfURL:[toPath URLByAppendingPathComponent:@"Chart.yaml"]];
    NSDictionary *chartYaml = [YATWSerialization YAMLObjectWithData:chartData options:0 error:nil];
    Metadata *meta = [[Metadata alloc] init];
    meta.name = chartYaml[@"name"];
    
    meta.version = chartYaml[@"version"];
    meta.keywordsArray = chartYaml[@"keywoard"];
    meta.home = chartYaml[@"home"];
    meta.description_p = chartYaml[@"description"];
    [chart setMetadata:meta];
    
    // Templates
    NSMutableArray *templates = [NSMutableArray new];
    NSURL *templatesPath = [toPath URLByAppendingPathComponent:@"templates"];
    NSArray *templatesDir = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:templatesPath.path error:nil];
    for (NSString *templatePath in templatesDir) {
      NSLog(@"Template: %@", templatePath);
      Template *template = [[Template alloc] init];
      template.name = templatePath;
      template.data_p = [NSData dataWithContentsOfURL:[templatesPath URLByAppendingPathComponent:templatePath]];
      [templates addObject:template];
    }
    [chart setTemplatesArray:templates];

    [request setChart:chart];
    [service installReleaseWithRequest:request handler:^(InstallReleaseResponse * _Nullable response, NSError * _Nullable error) {
      
    }];
  }];
}

- (void)downloadFileAtUrl:(NSString*)url completion:(void (^)(NSURL *filePath))completion
{
  NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
  AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:configuration];
  
  NSURL *URL = [NSURL URLWithString:url];
  NSURLRequest *request = [NSURLRequest requestWithURL:URL];
  
  NSURLSessionDownloadTask *downloadTask = [manager downloadTaskWithRequest:request progress:nil destination:^NSURL *(NSURL *targetPath, NSURLResponse *response) {
    NSURL *documentsDirectoryURL = [[NSFileManager defaultManager] URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil];
    return [documentsDirectoryURL URLByAppendingPathComponent:[response suggestedFilename]];
  } completionHandler:^(NSURLResponse *response, NSURL *filePath, NSError *error) {
    completion(filePath);
  }];
  [downloadTask resume];
}

@end