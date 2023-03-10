import Foundation

/// The set of recognized Service errors.
enum ServiceError: Error {
  case missingToken
  case nilResponse
  case unauthorized
}
