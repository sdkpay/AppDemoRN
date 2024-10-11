import {NativeModules} from 'react-native';

export enum SDKEnvironment {
    EnvironmentProd = 0,
    EnvironmentSandboxWithoutBankApp = 1,
    EnvironmentSandboxRealBankApp = 2
}

class SPayBridgeModule {

    static setupSDK(params: {
                        bnplPlan: boolean,
                        spasiboBonuses: boolean,
                        resultViewNeeded: boolean,
                        helpers: boolean,
                        needLogs: boolean,
                        sbp: boolean,
                        creditCard: boolean,
                        debitCard: boolean
                    },
                    environment: SDKEnvironment,
                    fn: (errorString: string) => void) {
        NativeModules.SPayBridgeModule.setupSDK(
            params,
            environment, 
            (errorString: string) => fn(errorString)
        )
    }

    static isReadyForSPay(fn: (isReady: boolean) => void) {
        NativeModules.SPayBridgeModule.isReadyForSPay ((event: boolean) => fn(event));
    }

    static revokeRefreshToken() {
        NativeModules.SPayBridgeModule.revokeRefreshToken();
    }    

    static payWithBankInvoiceId(requestParams: {
                                    merchantLogin: string, 
                                    bankInvoiceId: string,
                                    orderNumber: string,
                                    language: string,
                                    redirectUri: string
                                    apiKey: string
                                }, 
                                fn: (error: any, event: string) => void) {
        console.log('start NativeModules.SPayBridgeModule.payWithBankInvoiceId')    
        console.log('merchantName %@', requestParams.merchantLogin) 
        console.log('bankInvoiceId %@', requestParams.bankInvoiceId)                    
        NativeModules.SPayBridgeModule.payWithBankInvoiceId(
            requestParams,
            (error: any, event: string) => { 
                console.log('internal callback NativeModule')
                fn(error, event) 
            }
        )
    }

    static payWithoutRefresh(requestParams: {
                                merchantLogin: string, 
                                bankInvoiceId: string,
                                orderNumber: string,
                                language: string,
                                redirectUri: string
                                apiKey: string
                            }, 
                            fn: (error: any, event: string) => void) {
        NativeModules.SPayBridgeModule.payWithoutRefresh(
            requestParams,
            (error: any, event: string) => fn(error, event)
        )
    }

    static payWithPartPay(requestParams: {
                            merchantLogin: string, 
                            bankInvoiceId: string,
                            orderNumber: string,
                            language: string,
                            redirectUri: string
                            apiKey: string
                         }, 
                         fn: (error: any, event: string) => void) {
        NativeModules.SPayBridgeModule.payWithPartPay(
            requestParams,
            (error: any, event: string) => fn(error, event)
        )
    }
}

export default SPayBridgeModule;