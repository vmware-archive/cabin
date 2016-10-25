/*
  Copyright 2015 Skippbox, Ltd

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#import "AppDelegate.h"
#import "RCTRootView.h"
#import "Orientation.h"
#import "RCTBundleURLProvider.h"
#import "RNGoogleSignin.h"

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
  UIColor *blue = [UIColor colorWithRed:0.258824F green:0.541176F blue:0.749020F alpha:1.0F];
  self.window.tintColor = blue;
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {

  return [RNGoogleSignin application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

@end
