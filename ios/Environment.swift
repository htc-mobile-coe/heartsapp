import Foundation

// MARK: - Environment

/// Enumeration of the API environments that the app can connect to.
enum Environment {
  case dev
  case staging
  case production
  
  // MARK: Type properties
  
  /// The default environment based on the current build environment.
  static var current: Environment {
    
    let file = Bundle.main.object(forInfoDictionaryKey: "Environment") as? String
    guard let environment = file
    else {
      return .production
    }
    if environment == "DEV" {
      return .dev
    }
    else if environment == "QA" {
      return .staging
    }
    else {
      return .production
    }
  }
  
  // MARK: Instance properties
  
  /// The profile service host.
  var profileService: String {
    switch self {
    case .dev:
      return "profile-service-grpc.dev.heartfulnessinstitute.in:443"
    case .staging:
      return "profile-service-grpc.qa.heartfulnessinstitute.in:443"
    case .production:
      return "profile-service-grpc.heartfulnessinstitute.in:443"
    }
  }
  
  /// The meditation service host.
  var meditationService: String {
    switch self {
    case .dev:
      return "meditation-service-grpc.dev.heartfulnessinstitute.in:443"
    case .staging:
      return "meditation-service-grpc.qa.heartfulnessinstitute.in:443"
    case .production:
      return "meditation-service-grpc.heartfulnessinstitute.in:443"
    }
  }
  
  /// The content service host.
  var contentService: String {
    switch self {
    case .dev:
      return "meditation-service-grpc.dev.heartfulnessinstitute.in:443"
    case .staging:
      return "content-service-grpc.qa.heartfulnessinstitute.in:443"
    case .production:
      return "content-service-grpc.heartfulnessinstitute.in:443"
    }
  }
  
  /// The subscription service host.
  var subscriptionService: String {
    switch self {
    case .dev:
      return "meditation-service-grpc.dev.heartfulnessinstitute.in:443"
    case .staging:
      return "subscription-service-grpc.qa.heartfulnessinstitute.in:443"
    case .production:
      return "subscription-service-grpc.heartfulnessinstitute.in:443"
    }
  }
  
  /// The donation service host.
  var donationService: String {
    switch self {
    case .dev:
      return "meditation-service-grpc.dev.heartfulnessinstitute.in:443"
    case .staging:
      return "donation-service-grpc.qa.heartfulnessinstitute.in:443"
    case .production:
      return "donation-service-grpc.heartfulnessinstitute.in:443"
    }
  }
  
  var googleAppId: String {
    switch self {
    case .dev:
      return "583201066445-n9l4pa76v25o3f2a17llvjfpivc9h0fn.apps.googleusercontent.com"
      
    case .staging:
      return "498241637356-44ehu89b78tomj2t1tl0iiaiunanqime.apps.googleusercontent.com"
      
    case .production:
      return "995463456479-r0nopvsrhqobemjic6u5cllru4pjjhp5.apps.googleusercontent.com"
    }
  }
  
  var pushNotificationSenderId: String {
    switch self {
    case .dev:
      return "583201066445"
      
    case .staging:
      return "498241637356"
      
    case .production:
      return "995463456479"
    }
  }
  var donationURL: String{
    switch self {
    case .dev:
      return "donation-service.dev.heartfulnessinstitute.in/"
      
    case .staging:
      return "donation-service.qa.heartfulnessinstitute.in/"
      
    case .production:
      return "donation-service.heartfulnessinstitute.in/"
    }
  }
  var stateInCounryURL: String{
    switch self {
    case .dev:
      return "https://profile.srcm.net/api/v2/states"
      
    case .staging:
      return "https://profile.srcm.net/api/v2/states"
      
    case .production:
      return "https://profile.sahajmarg.org/api/v2/states"
    }
  }
  var googlePlaceAPIKey: String{
    switch self {
    case .dev:
      return "AIzaSyDJ8dKi2w8Ed9XUG4-pZo2ySanOZRKtCcw"
      
    case .staging:
      return "AIzaSyBaZ0JBJfALWH_0Vu6_qwvxB4vfR-BTAHw"
      
    case .production:
      return "AIzaSyCEHT9TXie0766aiXc7WLSW8uTg5yBlfuk"
    }
  }
  
  var googleMapAPIKey: String{
    switch self {
    case .dev:
      return "AIzaSyDAJFyxr3Stlc9_YwAmlDS986MD2R5zyvY"
      
    case .staging:
      return "AIzaSyDanIwwWLxyqLLSgBWN-PdcOeQ0C-Pv2IA"
      
    case .production:
      return "AIzaSyAqZrgFdAf22VAJlaZ1zqG9nrV83W5SL34"
    }
  }
  var googleGeocodeURL: String{
    return "https://maps.googleapis.com/maps/api/geocode/json"
  }
  var googlePlaceDetailsURL: String{
    return "https://maps.googleapis.com/maps/api/place/details/json"
  }

  var searchSeekerURL: String{
    switch self {
    case .dev:
      return "https://profile.srcm.net/api/v2/abhyasis/search"
      
    case .staging:
      return "https://profile.srcm.net/api/v2/abhyasis/search"
      
    case .production:
      return "https://profile.sahajmarg.org/api/v2/abhyasis/search"
    }
  }

  var mySRCMClientId: String{
    switch self {
    case .dev:
      return "zyiiw9lAK0j56F9uTda3RB0rJEKHPGfzawiYHbCm"
      
    case .staging:
      return "zyiiw9lAK0j56F9uTda3RB0rJEKHPGfzawiYHbCm"
      
    case .production:
      return "Z1zZmoQfhftyDhK5LSNQCfB6wDRTFlBXHmpLczMo"
    }
  }
  
  var mySRCMCitiesURL: String{
    switch self {
    case .dev:
      return "https://static-gatsby-qa.web.app/srcmapi/cities"

    case .staging:
      return "https://static-gatsby-qa.web.app/srcmapi/cities"

    case .production:
      return "http://static-gatsby.web.app/srcmapi/cities"
    }
  }
  var recurringDonationURL: String{
    switch self {
    case .dev:
      return "https://donations-staging-hfi.web.app"
      
    case .staging:
      return "https://donations-staging-hfi.web.app"
      
    case .production:
      return "https://donations.heartfulness.org"
    }
  }
}

@objc(EnvironmentSeverity)
public class EnvironmentSeverity: NSObject {
  @objc static var googleMapAPIKey:String{ Environment.current.googleMapAPIKey}
  
}
