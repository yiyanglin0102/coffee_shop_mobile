// android/app/src/main/java/com/your/app/SquarePaymentModule.kt
package com.coffeeshopmobile

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.Collections

class SquarePaymentPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext) =
        emptyList<ViewManager<*, *>>()

    override fun createNativeModules(reactContext: ReactApplicationContext) =
        listOf<NativeModule>(SquarePaymentModule(reactContext))
}