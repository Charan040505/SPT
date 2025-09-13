/**
 * OTP Utilities for Phone Verification
 * 
 * This module provides functions for generating, storing, and validating OTPs
 * for phone verification in the Student Performance Tracker application.
 */

// In-memory OTP store (in a production app, use a database or Redis)
type OTPRecord = {
  otp: string;
  expires: number; // Timestamp when OTP expires
  attempts: number; // Number of failed verification attempts
};

export const otpStore: Record<string, OTPRecord> = {};

/**
 * Generate a random OTP of specified length
 * @param length Length of the OTP (default: 6)
 * @returns Generated OTP string
 */
export function generateOTP(length: number = 6): string {
  // Generate a random numeric OTP
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

/**
 * Store an OTP for a phone number with expiration
 * @param phoneNumber The phone number to store OTP for
 * @param expiryMinutes Minutes until OTP expires (default: 2)
 * @returns The generated OTP
 */
export function storeOTP(phoneNumber: string, expiryMinutes: number = 2): string {
  const otp = generateOTP();
  const expirationTime = Date.now() + expiryMinutes * 60 * 1000;
  
  otpStore[phoneNumber] = {
    otp,
    expires: expirationTime,
    attempts: 0
  };
  
  return otp;
}

/**
 * Verify an OTP for a phone number
 * @param phoneNumber The phone number to verify
 * @param otp The OTP to verify
 * @returns Object with verification result and message
 */
export function verifyOTP(phoneNumber: string, otp: string): { 
  valid: boolean; 
  message: string; 
  attemptsLeft?: number;
} {
  // Check if OTP exists for this phone number
  const otpData = otpStore[phoneNumber];
  if (!otpData) {
    return { valid: false, message: 'No OTP was sent to this phone number' };
  }
  
  // Check if OTP has expired
  if (Date.now() > otpData.expires) {
    // Remove expired OTP
    delete otpStore[phoneNumber];
    return { valid: false, message: 'OTP has expired. Please request a new one' };
  }
  
  // Check if OTP matches
  if (otpData.otp !== otp) {
    // Increment failed attempts
    otpData.attempts += 1;
    
    // If too many failed attempts, invalidate the OTP
    if (otpData.attempts >= 3) {
      delete otpStore[phoneNumber];
      return { valid: false, message: 'Too many failed attempts. Please request a new OTP' };
    }
    
    return { 
      valid: false, 
      message: 'Invalid OTP', 
      attemptsLeft: 3 - otpData.attempts 
    };
  }
  
  // OTP is valid, remove it from store
  delete otpStore[phoneNumber];
  return { valid: true, message: 'Phone number verified successfully' };
}

/**
 * Check if an OTP exists and is valid for a phone number
 * @param phoneNumber The phone number to check
 * @returns Boolean indicating if a valid OTP exists
 */
export function hasValidOTP(phoneNumber: string): boolean {
  const otpData = otpStore[phoneNumber];
  if (!otpData) return false;
  
  // Check if OTP has expired
  if (Date.now() > otpData.expires) {
    delete otpStore[phoneNumber];
    return false;
  }
  
  return true;
}

/**
 * Get remaining time in seconds for an OTP
 * @param phoneNumber The phone number to check
 * @returns Remaining time in seconds or 0 if expired/not found
 */
export function getOTPRemainingTime(phoneNumber: string): number {
  const otpData = otpStore[phoneNumber];
  if (!otpData) return 0;
  
  const remainingMs = otpData.expires - Date.now();
  return remainingMs > 0 ? Math.floor(remainingMs / 1000) : 0;
}