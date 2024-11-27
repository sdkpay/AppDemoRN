#import "SPayBridgeModule.h"
#import "AppDelegate.h"

@implementation SPayBridgeModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setupSDK: (NSDictionary *)params
          environment: (NSInteger)environment
          callback: (RCTResponseSenderBlock)callback)
{
  SConfig* config = [[SConfig alloc] initWithSbp:params[@"sbp"]
                                      creditCard:params[@"creditCard"]
                                       debitCard:params[@"debitCard"]];
  [SPay setupWithBnplPlan:params[@"bnplPlan"]
           spasiboBonuses:params[@"spasiboBonuses"]
         resultViewNeeded:params[@"resultViewNeeded"]
                  helpers:params[@"helpers"]
                 needLogs:params[@"needLogs"]
             helperConfig:config
              environment:environment
               completion:^(SPError * _Nullable error) {
    callback(@[error.description ?: [NSNull null]]);
  }];
}

RCT_EXPORT_METHOD(isReadyForSPay:(RCTResponseSenderBlock)callback)
{
  bool isReady = [SPay isReadyForSPay];
  callback(@[@(isReady)]);
}

RCT_EXPORT_METHOD(payWithBankInvoiceId: (NSDictionary *)params callback: (RCTResponseSenderBlock)callback)
{
  
  dispatch_async(dispatch_get_main_queue(), ^{
    SBankInvoiceIdPaymentRequest * request = [[SBankInvoiceIdPaymentRequest alloc]
                                              initWithMerchantLogin:params[@"merchantLogin"]
                                              bankInvoiceId:params[@"bankInvoiceId"]
                                              orderNumber:params[@"orderNumber123"]
                                              language:params[@"language"]
                                              redirectUri:params[@"redirectUri"]
                                              apiKey:params[@"apiKey"]];
    [SPay payWithBankInvoiceIdWith:self.topViewController
                    paymentRequest:request
                        completion:^(enum SPayState state,
                                     NSString * _Nonnull info,
                                     NSString * _Nullable localSessionId) {

      switch(state) {
        case SPayStateSuccess:
          callback(@[[NSNull null], @"success"]);
          break;
        case SPayStateWaiting:
          callback(@[[NSNull null], @"waiting"]);
          break;
        case SPayStateCancel:
          callback(@[[NSNull null], @"cancel"]);
          break;
        case SPayStateError:
          callback(@[info, info]);
          break;
      }
    }];
  });
}

RCT_EXPORT_METHOD(payWithoutRefresh: (NSDictionary *)params callback: (RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    SBankInvoiceIdPaymentRequest * request = [[SBankInvoiceIdPaymentRequest alloc]
                                              initWithMerchantLogin:params[@"merchantLogin"]
                                              bankInvoiceId:params[@"bankInvoiceId"]
                                              orderNumber:params[@"orderNumber"]
                                              language:params[@"language"]
                                              redirectUri:params[@"redirectUri"]
                                              apiKey:params[@"apiKey"]];
    [SPay payWithoutRefreshWith:self.topViewController
                 paymentRequest:request
                     completion:^(enum SPayState state,
                                  NSString * _Nonnull info,
                                  NSString * _Nullable localSessionId) {
      switch(state) {
        case SPayStateSuccess:
          callback(@[[NSNull null], @"success"]);
          break;
        case SPayStateWaiting:
          callback(@[[NSNull null], @"waiting"]);
          break;
        case SPayStateCancel:
          callback(@[[NSNull null], @"cancel"]);
          break;
        case SPayStateError:
          callback(@[info, info]);
          break;
      }
    }];
  });
}

RCT_EXPORT_METHOD(payWithPartPay: (NSDictionary *)params callback: (RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    SBankInvoiceIdPaymentRequest * request = [[SBankInvoiceIdPaymentRequest alloc]
                                              initWithMerchantLogin:params[@"merchantLogin"]
                                              bankInvoiceId:params[@"bankInvoiceId"]
                                              orderNumber:params[@"orderNumber"]
                                              language:params[@"language"]
                                              redirectUri:params[@"redirectUri"]
                                              apiKey:params[@"apiKey"]];
    [SPay payWithPartPayWith:self.topViewController
              paymentRequest:request
                  completion:^(enum SPayState state,
                               NSString * _Nonnull info,
                               NSString * _Nullable localSessionId) {
      switch(state) {
        case SPayStateSuccess:
          callback(@[[NSNull null], @"success"]);
          break;
        case SPayStateWaiting:
          callback(@[[NSNull null], @"waiting"]);
          break;
        case SPayStateCancel:
          callback(@[[NSNull null], @"cancel"]);
          break;
        case SPayStateError:
          callback(@[info, info]);
          break;
      }
    }];
  });
}

- (UIViewController*)topViewController {
  return [self topViewControllerWithRootViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
}

- (UIViewController*)topViewControllerWithRootViewController:(UIViewController*)viewController {
  if ([viewController isKindOfClass:[UITabBarController class]]) {
    UITabBarController* tabBarController = (UITabBarController*)viewController;
    return [self topViewControllerWithRootViewController:tabBarController.selectedViewController];
  } else if ([viewController isKindOfClass:[UINavigationController class]]) {
    UINavigationController* navContObj = (UINavigationController*)viewController;
    return [self topViewControllerWithRootViewController:navContObj.visibleViewController];
  } else if (viewController.presentedViewController && !viewController.presentedViewController.isBeingDismissed) {
    UIViewController* presentedViewController = viewController.presentedViewController;
    return [self topViewControllerWithRootViewController:presentedViewController];
  }
  else {
    for (UIView *view in [viewController.view subviews])
    {
      id subViewController = [view nextResponder];
      if ( subViewController && [subViewController isKindOfClass:[UIViewController class]])
      {
        if ([(UIViewController *)subViewController presentedViewController]  && ![subViewController presentedViewController].isBeingDismissed) {
          return [self topViewControllerWithRootViewController:[(UIViewController *)subViewController presentedViewController]];
        }
      }
    }
    return viewController;
  }
}

RCT_EXPORT_METHOD(setBankScheme: (NSString *)urlString) {
  NSURL * url = [NSURL URLWithString:urlString];
  [SPay setBankScheme: url error: NULL];
}

RCT_EXPORT_METHOD(logout)
{
  [SPay logout];
}

@end
