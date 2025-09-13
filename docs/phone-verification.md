# Phone Verification System Documentation

## Overview

The Student Performance Tracker (SPT) now uses phone number verification with One-Time Password (OTP) for user authentication. This document explains how the system works and how to use it.

## User Flow

1. **Registration**: Users enter their details including phone number on the registration page
2. **OTP Sending**: System sends a 6-digit OTP to the provided phone number
3. **OTP Verification**: User enters the OTP to verify their identity
4. **Account Creation**: Upon successful verification, the user account is created
5. **Login**: Users can now log in with their credentials

## Technical Implementation

### API Endpoints

#### 1. Send OTP

**Endpoint**: `/api/auth/send-otp`

**Method**: POST

**Request Body**:
```json
{
  "phoneNumber": "1234567890",
  "role": "student"
}
```

**Response (Success)**:
```json
{
  "message": "OTP sent successfully",
  "expiresIn": "2 minutes"
}
```

**Response (Development Mode)**:
```json
{
  "message": "OTP sent successfully",
  "otp": "123456",  // Only in development mode
  "expiresIn": "2 minutes"
}
```

#### 2. Verify OTP

**Endpoint**: `/api/auth/verify-otp`

**Method**: POST

**Request Body (with user data)**:
```json
{
  "phoneNumber": "1234567890",
  "otp": "123456",
  "userData": {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "student",
    "studentId": "S12345"
  }
}
```

**Request Body (verification only)**:
```json
{
  "phoneNumber": "1234567890",
  "otp": "123456"
}
```

**Response (Success)**:
```json
{
  "message": "Phone number verified successfully",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Response (Error)**:
```json
{
  "message": "Invalid OTP",
  "attemptsLeft": 2
}
```

### OTP Validation Rules

1. OTP expires after 2 minutes
2. Maximum 3 failed attempts allowed
3. OTP is invalidated after successful verification

## Frontend Components

### Registration Page

The registration page (`/register`) now includes a phone number field. After submitting the form, the system sends an OTP to the provided phone number and redirects to the verification page.

### Verification Page

The verification page (`/verify-phone`) allows users to enter the OTP they received. It includes:

- OTP input field
- Resend OTP button (available after 30 seconds)
- Countdown timer showing OTP expiration

## Testing

A test script is available at `/api/test-phone-verification.ts`. In development mode, you can run this script in the browser console:

```javascript
testPhoneVerification()
```

This will test the complete phone verification flow including:
- Sending OTP
- Verifying valid OTP
- Testing invalid OTP
- Testing OTP expiration

## Security Considerations

1. OTPs are stored in memory with expiration times
2. In production, OTPs should be sent via a secure SMS service
3. Failed attempt counting prevents brute force attacks
4. OTP is never exposed in production responses

## Future Improvements

1. Implement SMS service integration (Twilio, etc.)
2. Add phone number validation and formatting
3. Implement rate limiting for OTP requests
4. Add support for voice OTP for accessibility