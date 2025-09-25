// Verification System - Phone OTP + PAN
const API_BASE = 'http://localhost:3000/api';

let verificationState = {
    phoneVerified: false,
    panVerified: false,
    currentOtp: null
};

document.addEventListener('DOMContentLoaded', checkAuthAndInit);

function checkAuthAndInit() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Check if already verified
    const userInfo = JSON.parse(atob(token.split('.')[1]));
    console.log('🔍 Checking verification status for:', userInfo.email);
}

async function sendOTP() {
    const phone = document.getElementById('phoneNumber').value;
    const btn = document.getElementById('sendOtpBtn');
    
    if (!phone) {
        alert('Please enter phone number');
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        const response = await fetch(`${API_BASE}/verify/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show OTP form
            document.getElementById('phoneForm').style.display = 'none';
            document.getElementById('otpForm').style.display = 'block';
            
            // Display mock OTP for demo
            document.getElementById('mockOtpDisplay').textContent = 
                `Demo OTP: ${data.mockOtp} (Auto-filled for testing)`;
            document.getElementById('otpCode').value = data.mockOtp;
            
            verificationState.currentOtp = data.mockOtp;
            
            console.log('📱 OTP sent successfully:', data.mockOtp);
            alert('OTP sent! Check the demo OTP displayed below.');
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('❌ OTP send error:', error);
        alert('Failed to send OTP. Please try again.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send OTP';
    }
}

async function verifyOTP() {
    const phone = document.getElementById('phoneNumber').value;
    const otp = document.getElementById('otpCode').value;
    const btn = document.getElementById('verifyOtpBtn');
    
    if (!otp) {
        alert('Please enter OTP');
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    
    try {
        const response = await fetch(`${API_BASE}/verify/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, otp })
        });
        
        const data = await response.json();
        
        if (data.success) {
            verificationState.phoneVerified = true;
            updateStepStatus('phoneStatus', 'Verified', 'success');
            
            console.log('✅ Phone verified successfully');
            alert('Phone verified successfully!');
            
            checkCompletion();
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('❌ OTP verification error:', error);
        alert('Invalid OTP. Please try again.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check"></i> Verify OTP';
    }
}

async function verifyPAN() {
    const panNumber = document.getElementById('panNumber').value.toUpperCase();
    const panName = document.getElementById('panName').value;
    const btn = document.getElementById('verifyPanBtn');
    
    if (!panNumber || !panName) {
        alert('Please fill all PAN details');
        return;
    }
    
    // Basic PAN format validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber)) {
        alert('Invalid PAN format. Use format: ABCDE1234F');
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    
    try {
        const response = await fetch(`${API_BASE}/verify/pan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ panNumber, name: panName })
        });
        
        const data = await response.json();
        
        if (data.success) {
            verificationState.panVerified = true;
            updateStepStatus('panStatus', 'Verified', 'success');
            
            console.log('✅ PAN verified successfully');
            alert('PAN verified successfully!');
            
            checkCompletion();
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('❌ PAN verification error:', error);
        alert('PAN verification failed. Please check details.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check"></i> Verify PAN';
    }
}

function updateStepStatus(elementId, text, type) {
    const element = document.getElementById(elementId);
    element.textContent = text;
    element.className = `step-status ${type}`;
}

async function checkCompletion() {
    if (verificationState.phoneVerified && verificationState.panVerified) {
        console.log('🎉 All verifications complete!');
        
        // Update user verification status
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(`${API_BASE}/verify/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    phoneVerified: true,
                    panVerified: true
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Show completion step
                document.getElementById('phoneStep').style.display = 'none';
                document.getElementById('panStep').style.display = 'none';
                document.getElementById('completionStep').style.display = 'block';
                
                console.log('✅ User verification completed in database');
            }
        } catch (error) {
            console.error('❌ Completion update error:', error);
        }
    }
}