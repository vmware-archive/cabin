/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "RCTRootView.h"

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

#ifdef DEBUG
  /**
   * Opt 1: Use for dev
   */
  NSURL *bundleURL = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
#else
  
  /**
   * Opt 2: Production with static Bundle
   */
  NSURL *bundleURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:bundleURL moduleName:@"Skippbox" initialProperties:nil launchOptions:nil];

  NSArray *objects = [[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil];
  UIView *launchView = [objects objectAtIndex:0];
  [launchView setTranslatesAutoresizingMaskIntoConstraints:false];
  rootView.loadingView = launchView;
  [rootView addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:|[launch]|" options:NSLayoutFormatAlignAllTop metrics:nil views:@{@"launch":launchView}]];
  [rootView addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"H:|[launch]|" options:NSLayoutFormatAlignAllTop metrics:nil views:@{@"launch":launchView}]];


  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.tintColor = [UIColor colorWithRed:0 green:0.569 blue:0.855 alpha:1];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
