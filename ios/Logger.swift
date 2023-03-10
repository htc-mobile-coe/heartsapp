//
//  Logger.swift
//  HeartsApp
//
//  Created by Anuradha Ramprakash on 10/25/18.
//  Copyright © 2018 Heartfulness Institute. All rights reserved.
//

import Foundation

let log = Logger()

class Logger {
    
    func debug(_ message: String) {
        #if DEBUG
        print("🐛: \(message)")
        #endif
    }
    
    func error(_ message: String) {
        print("🚨: \(message)")
    }
    
    func info(_ message: String) {
        print("ℹ️: \(message)")
    }
    
}
