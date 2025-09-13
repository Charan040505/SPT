// This is a test script for the phone verification system
// It can be run in the browser console or using Node.js

async function testPhoneVerification() {
  console.log('Starting phone verification test...');
  
  // Test data
  const testPhone = '1234567890';
  const testUserData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'student',
    studentId: 'S12345'
  };
  
  // Step 1: Send OTP
  console.log('Step 1: Sending OTP to', testPhone);
  const sendOtpResponse = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: testPhone, role: testUserData.role })
  });
  
  const sendOtpData = await sendOtpResponse.json();
  console.log('Send OTP response:', sendOtpData);
  
  if (!sendOtpResponse.ok) {
    console.error('❌ Send OTP failed:', sendOtpData.message);
    return;
  }
  
  // Get OTP from response (only works in development)
  const otp = sendOtpData.otp;
  if (!otp) {
    console.error('❌ No OTP returned in development mode');
    return;
  }
  
  console.log('✅ OTP sent successfully:', otp);
  
  // Step 2: Verify OTP
  console.log('Step 2: Verifying OTP', otp, 'for phone', testPhone);
  const verifyOtpResponse = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      phoneNumber: testPhone, 
      otp, 
      userData: testUserData 
    })
  });
  
  const verifyOtpData = await verifyOtpResponse.json();
  console.log('Verify OTP response:', verifyOtpData);
  
  if (!verifyOtpResponse.ok) {
    console.error('❌ Verify OTP failed:', verifyOtpData.message);
    return;
  }
  
  console.log('✅ OTP verified successfully');
  
  // Step 3: Test invalid OTP
  console.log('Step 3: Testing invalid OTP');
  // First send a new OTP
  const newSendOtpResponse = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: testPhone, role: testUserData.role })
  });
  
  const newSendOtpData = await newSendOtpResponse.json();
  const validOtp = newSendOtpData.otp;
  
  // Try with invalid OTP
  const invalidOtp = '000000';
  console.log('Testing with invalid OTP:', invalidOtp);
  const invalidVerifyResponse = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      phoneNumber: testPhone, 
      otp: invalidOtp
    })
  });
  
  const invalidVerifyData = await invalidVerifyResponse.json();
  console.log('Invalid OTP response:', invalidVerifyData);
  
  if (invalidVerifyResponse.ok) {
    console.error('❌ Invalid OTP was accepted!');
  } else {
    console.log('✅ Invalid OTP correctly rejected');
  }
  
  // Step 4: Test with valid OTP again
  console.log('Step 4: Testing with valid OTP again:', validOtp);
  const validVerifyResponse = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      phoneNumber: testPhone, 
      otp: validOtp
    })
  });
  
  const validVerifyData = await validVerifyResponse.json();
  console.log('Valid OTP response:', validVerifyData);
  
  if (validVerifyResponse.ok) {
    console.log('✅ Valid OTP correctly accepted');
  } else {
    console.error('❌ Valid OTP was rejected:', validVerifyData.message);
  }
  
  console.log('Phone verification test completed');
}

// Export the test function
export { testPhoneVerification };

// If running in browser, add to window object
if (typeof window !== 'undefined') {
  (window as any).testPhoneVerification = testPhoneVerification;
  console.log('Phone verification test function added to window object. Run testPhoneVerification() to test.');
}