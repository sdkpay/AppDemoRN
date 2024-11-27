package com.appdemorn

import android.Manifest.permission.ACCESS_FINE_LOCATION
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableNativeArray
import com.facebook.react.bridge.ReadableNativeMap
import spay.sdk.SPaySdkApp
import spay.sdk.SPaySdkInitConfig
import spay.sdk.api.InitializationResult
import spay.sdk.api.PaymentResult
import spay.sdk.api.SPayHelperConfig
import spay.sdk.api.SPayHelpers
import spay.sdk.api.SPayStage
//import spay.sdk.di.qualifier.logWriter.Console

class SPayBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun setupSDK(params: ReadableMap, environment: Int,  callBack: Callback) {
        val activity = currentActivity
        val listOfHelpers = mutableListOf<SPayHelpers>()
        val stage = when (environment) {
            1 -> SPayStage.SandBoxWithoutBankApp
            2 -> SPayStage.SandboxRealBankApp
            else -> SPayStage.Prod
        }
        val config = SPaySdkInitConfig(
            activity?.application ?: throw IllegalArgumentException("The activity is not initialized"),
            params.getBoolean("bnplPlan"),
            stage,
            SPayHelperConfig(params.getBoolean("helpers"), listOfHelpers),
            params.getBoolean("resultViewNeeded"),
            params.getBoolean("needLogs")
        ) { initializationResult ->
            when (initializationResult) {
                is InitializationResult.Success -> callBack.invoke()
                is InitializationResult.ConfigError -> callBack.invoke(initializationResult.message)
            }
        }
        SPaySdkApp.getInstance().initialize(config)
    }

    @ReactMethod
    fun isReadyForSPay(callBack: Callback) {
        val activity = currentActivity
        val result = SPaySdkApp.getInstance().isReadyForSPaySdk(
            activity?.application ?: throw IllegalArgumentException("The activity is not initialized")
        )
        callBack.invoke(result)
    }

    @ReactMethod
    fun payWithBankInvoiceId(requestParams: ReadableMap, callBack: Callback) {
        val activity = currentActivity
        try {
            SPaySdkApp.getInstance().payWithBankInvoiceId(
                activity ?: throw IllegalArgumentException("The activity is not initialized"),
                requestParams.getString("apiKey").toString(),
                requestParams.getString("merchantLogin"),
                requestParams.getString("bankInvoiceId").toString(),
                requestParams.getString("orderNumber").toString(),
                "RU",
                requestParams.getString("language")
            ) { paymentResult ->
                when (paymentResult) {
                    is PaymentResult.Success -> {
                        // do on success
                        callBack.invoke(null, "success")
                    }
                    is PaymentResult.Error -> {
                        // do on error
                        callBack.invoke("error", paymentResult.toString())
                    }
                    is PaymentResult.Processing -> {
                        // do on processing
                        callBack.invoke(null, "waiting")
                    }
                    // do on cancel
                    is PaymentResult.Cancel -> {
                        callBack.invoke(null, "cancel")
                    }
                }
            }
        } catch (e: Exception) {
            callBack.invoke("error exception", e.toString())
        }
    }

    @ReactMethod
    fun payWithPartPay(requestParams: ReadableMap, callBack: Callback) {
        val activity = currentActivity
        try {
            SPaySdkApp.getInstance().payWithPartPay(
                activity ?: throw IllegalArgumentException("The activity is not initialized"),
                requestParams.getString("apiKey").toString(),
                requestParams.getString("merchantLogin"),
                requestParams.getString("bankInvoiceId").toString(),
                requestParams.getString("orderNumber").toString(),
                "RU",
                requestParams.getString("language")
            ) { paymentResult ->
                when (paymentResult) {
                    is PaymentResult.Success -> {
                        // do on success
                        callBack.invoke(null, "success")
                    }
                    is PaymentResult.Error -> {
                        // do on error
                        callBack.invoke("error", paymentResult.toString())
                    }
                    is PaymentResult.Processing -> {
                        // do on processing
                        callBack.invoke(null, "waiting")
                    }
                    // do on cancel
                    is PaymentResult.Cancel -> {
                        callBack.invoke(null, "cancel")
                    }
                }
            }
        } catch (e: Exception) {
            callBack.invoke("error exception", e.toString())
        }
    }

    @ReactMethod
    fun payWithoutRefresh(requestParams: ReadableMap, callBack: Callback) {
        val activity = currentActivity
        try {
            SPaySdkApp.getInstance().payWithoutRefresh(
                activity ?: throw IllegalArgumentException("The activity is not initialized"),
                requestParams.getString("apiKey").toString(),
                requestParams.getString("merchantLogin"),
                requestParams.getString("bankInvoiceId").toString(),
                requestParams.getString("orderNumber").toString(),
                "RU",
                requestParams.getString("language")
            ) { paymentResult ->
                when (paymentResult) {
                    is PaymentResult.Success -> {
                        // do on success
                        callBack.invoke(null, "success")
                    }

                    is PaymentResult.Error -> {
                        // do on error
                        callBack.invoke("error", paymentResult.toString())
                    }

                    is PaymentResult.Processing -> {
                        // do on processing
                        callBack.invoke(null, "waiting")
                    }
                    // do on cancel
                    is PaymentResult.Cancel -> {
                        callBack.invoke(null, "cancel")
                    }
                }
            }
        } catch (e: Exception) {
            callBack.invoke("error exception", e.toString())
        }
    }

    @ReactMethod
    fun checkPermissions(callBack: Callback) {
        val activity = currentActivity
        val result = SPaySdkApp.getInstance().checkPermissions(
            activity?.application ?: throw IllegalArgumentException("The activity is not initialized")
        )
        val writableArray = Arguments.fromArray(result.second.toTypedArray())
        callBack.invoke(result.first, writableArray)
    }

    @ReactMethod
    fun logout() {
        SPaySdkApp.getInstance().logout()
    }

    companion object {
        const val NAME = "SPayBridgeModule"
    }
}