package com.hfn.unified;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import android.content.Intent;
import android.content.res.Configuration;
import android.view.WindowManager;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {

    setTheme(R.style.AppTheme); // Now set the theme from Splash to App before setContentView
    setContentView(R.layout.launch_screen); // Then inflate the new view
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
    //Checking Git Commit
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }

  @Override
  protected String getMainComponentName() {
    return "heartsapp";
  }
}
