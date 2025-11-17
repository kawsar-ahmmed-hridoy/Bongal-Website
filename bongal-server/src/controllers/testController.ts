import type { Request, Response } from 'express';
import { EmailService } from '../services/emailService';

const emailService = new EmailService();

export const testEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    // Generate a test verification code
    const testCode = Math.floor(100000 + Math.random() * 900000).toString();

    console.log('\n🧪 ===== EMAIL TEST STARTED =====');
    console.log('📧 Sending test email to:', email);
    console.log('🔢 Test verification code:', testCode);

    await emailService.sendVerificationEmail(email, testCode);

    console.log('✅ ===== EMAIL TEST SUCCESSFUL =====\n');

    res.json({
      success: true,
      message: 'Test email sent successfully! Check your inbox.',
      testCode: testCode,
      email: email,
      note: 'This is a test email. The code will not work for actual verification.'
    });

  } catch (error: any) {
    console.error('\n❌ ===== EMAIL TEST FAILED =====');
    console.error('Error:', error.message);
    console.error('================================\n');

    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
      details: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        hasPassword: !!process.env.EMAIL_PASSWORD
      }
    });
  }
};
