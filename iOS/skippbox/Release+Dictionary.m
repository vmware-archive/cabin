//
//  Release+Dictionary.m
//  skippbox
//
//  Created by Remi Santos on 20/10/2016.
//  Copyright © 2016 Skippbox. All rights reserved.
//

#import "Release+Dictionary.h"
#import <objc/runtime.h>

@implementation Release (Dictionary)

-(NSDictionary *) toDictionary
{
  NSMutableDictionary *dic = [NSMutableDictionary dictionary];
  dic[@"name"] = self.name;
  dic[@"manifest"] = self.manifest;
  dic[@"version"] = @(self.version);
  dic[@"namespace"] = self.namespace_p;
  dic[@"chart"] = @{
                    @"name": self.chart.metadata.name,
                    @"home": self.chart.metadata.home,
                    @"version": self.chart.metadata.version,
                    @"description": self.chart.metadata.description_p,
                    };
  dic[@"info"] = @{
                   @"status": @(Status_Code_RawValue(self.info.status)),
                   @"firstDeployed": @(self.info.firstDeployed.seconds),
                   @"lastDeployed": @(self.info.lastDeployed.seconds),
                   @"deleted": @(self.info.deleted.seconds)
                   };
  return [NSDictionary dictionaryWithDictionary:dic];
}

@end
