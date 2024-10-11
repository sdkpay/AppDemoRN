//
//  DemoVC.m
//  AppDemoRN
//
//  Created by Гладкий Сергей Игоревич on 01.07.2024.
//

#import <Foundation/Foundation.h>
#import "DemoVC.h"

@implementation DemoVC

- (void)viewDidLoad 
{
  [super viewDidLoad];
  [SPay getAuthURL: [[NSURL alloc] initWithString: @"url"]];
}

@end
