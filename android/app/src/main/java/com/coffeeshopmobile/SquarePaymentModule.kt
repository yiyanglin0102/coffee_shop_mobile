// android/app/src/main/java/com/your/app/SquarePaymentModule.kt
package com.coffeeshopmobile

import com.facebook.react.bridge.*
import com.squareup.sdk.reader.ReaderSdk
import com.squareup.sdk.reader.checkout.*
import com.squareup.sdk.reader.authorization.AuthorizationState
import com.squareup.sdk.reader.core.CardReader
import android.app.Activity

class SquarePaymentModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "SquarePayment"

    @ReactMethod
    fun startPayment(amount: Int, currencyCode: String, orderId: String, promise: Promise) {
        // ... existing implementation ...
    }

    @ReactMethod
    fun canProcessPayments(promise: Promise) {
        // ... existing implementation ...
    }

    @ReactMethod
    fun checkReaderConnection(promise: Promise) {
        val isConnected = ReaderSdk.readerManager().readerSettings?.reader != null
        promise.resolve(isConnected)
    }

    @ReactMethod
    fun getConnectedReaderDetails(promise: Promise) {
        try {
            val reader = ReaderSdk.readerManager().readerSettings?.reader
            if (reader != null) {
                val readerInfo = Arguments.createMap().apply {
                    putString("serialNumber", reader.serialNumber)
                    putString("deviceType", reader.deviceType.name)
                }
                promise.resolve(readerInfo)
            } else {
                promise.resolve(null)
            }
        } catch (e: Exception) {
            promise.reject("READER_ERROR", e)
        }
    }

    @ReactMethod
    fun addReaderListener(promise: Promise) {
        ReaderSdk.readerManager().addReaderSettingsListener { readerSettings ->
            val eventParams = Arguments.createMap().apply {
                putBoolean("isConnected", readerSettings?.reader != null)
                
                // Add reader details to event
                if (readerSettings?.reader != null) {
                    val reader = readerSettings.reader
                    putString("serialNumber", reader.serialNumber)
                    putString("deviceType", reader.deviceType.name)
                }
            }
            reactApplicationContext
                .getJSModule(RCTDeviceEventEmitter::class.java)
                .emit("onReaderConnectionChange", eventParams)
        }
        promise.resolve(true)
    }

    @ReactMethod
fun getConnectedReaderDetails(promise: Promise) {
    try {
        val reader = ReaderSdk.readerManager().readerSettings?.reader
        if (reader != null) {
            val readerInfo = Arguments.createMap().apply {
                putString("serialNumber", reader.serialNumber)
                putString("deviceType", reader.deviceType.name)
                
                // Add more hardware info
                putString("modelName", reader.deviceModel.name)
                putString("softwareVersion", reader.softwareVersion)
                
                // Battery status if available
                reader.batteryStatus?.let { battery ->
                    putString("batteryStatus", battery.status.name)
                    putDouble("batteryLevel", battery.level.toDouble())
                }
            }
            promise.resolve(readerInfo)
        } else {
            promise.resolve(null)
        }
    } catch (e: Exception) {
        promise.reject("READER_ERROR", e)
    }
}
}