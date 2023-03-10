package com.hfn.unified;

import android.content.Context;

import androidx.multidex.MultiDexApplication;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

//import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
//import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
//import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
//import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
//import io.invertase.firebase.auth.RNFirebaseAuthPackage;
//import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          List<ReactPackage> packages = new PackageList(this).getPackages();
          packages.add(new com.hfn.unified.reactnative.ReactPackage());
//          packages.add(new RNFirebaseMessagingPackage());
//          packages.add(new RNFirebaseNotificationsPackage());
//          packages.add(new RNFirebaseAuthPackage());
//          packages.add(new RNFirebaseCrashlyticsPackage());
//          packages.add(new RNFirebaseAnalyticsPackage());
//          packages.add(new RNFirebaseRemoteConfigPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
      super.onCreate();
      SoLoader.init(this, /* native exopackage */ false);
      initializeFlipper(this); // Remove this line if you don't want Flipper enabled

  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
