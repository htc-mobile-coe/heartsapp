//
//  Dictionary+Extension.swift
//  heartsapp
//
//  Created by Alex Appadurai on 22/09/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation


extension Dictionary {
  
  var jsonString:String?{
    if let data = try? JSONSerialization.data(withJSONObject: self, options: []){
      return String.init(data: data, encoding: .utf8)
    }
    return nil
  }
}

extension Encodable {
  
  var jsonString:String?{
    if let data = try? JSONEncoder().encode(self){
      return String.init(data: data, encoding: .utf8)
    }
    return nil
  }
  var json:Any?{
    
    if let classData = try? JSONEncoder().encode(self), let object = try? JSONSerialization.jsonObject(with: classData, options: JSONSerialization.ReadingOptions.allowFragments){
       return object
     }
     return nil
   }
}
