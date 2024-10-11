#import "SPayButtonManager.h"


@implementation RNTSPayButtonManager

RCT_EXPORT_MODULE(RNTSPayButton)

- (UIView *)view
{
  return [[SBPButton alloc] init];
}

@end
