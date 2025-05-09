// android/app/src/main/java/com/your/app/SquarePaymentModule.kt
package com.coffeeshopmobile

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.squareup.sdk.reader.ReaderSdk
import com.squareup.sdk.reader.checkout.ChargeRequest
import com.squareup.sdk.reader.checkout.CurrencyCode
import com.squareup.sdk.reader.checkout.CheckoutErrorCode
import com.squareup.sdk.reader.checkout.CheckoutException
import com.squareup.sdk.reader.authorization.AuthorizationState
import android.app.Activity

class SquarePaymentModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "SquarePayment"

    @ReactMethod
    fun startPayment(amount: Int, currencyCode: String, orderId: String, promise: Promise) {
        val currentActivity = currentActivity ?: run {
            promise.reject("NO_ACTIVITY", "No current activity")
            return
        }

        try {
            // Check authorization state
            if (ReaderSdk.authorizationManager().authorizationState != AuthorizationState.AUTHORIZED) {
                promise.reject("NOT_AUTHORIZED", "Square SDK not authorized")
                return
            }

            // Create charge request
            val chargeRequest = ChargeRequest.Builder(
                amount,
                CurrencyCode.valueOf(currencyCode)
                .note("Order #$orderId")
                .build()

            // Start checkout flow
            ReaderSdk.checkoutManager().startCheckoutActivity(currentActivity, chargeRequest)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("PAYMENT_ERROR", e.message ?: "Unknown error")
        }
    }

    @ReactMethod
    fun canProcessPayments(promise: Promise) {
        promise.resolve(
            ReaderSdk.authorizationManager().authorizationState == AuthorizationState.AUTHORIZED
        )
    }

    @ReactMethod
fun checkReaderConnection(promise: Promise) {
  promise.resolve(
    ReaderSdk.readerManager().readerSettings?.reader != null
  )
}

@ReactMethod
fun addReaderListener(promise: Promise) {
  ReaderSdk.readerManager().addReaderSettingsListener { readerSettings ->
    val eventParams = Arguments.createMap().apply {
      putBoolean("isConnected", readerSettings?.reader != null)
    }
    reactContext
      .getJSModule(RCTDeviceEventEmitter::class.java)
      .emit("onReaderConnectionChange", eventParams)
  }
  promise.resolve(true)
}
    
}