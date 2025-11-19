import { Resend } from 'resend';

export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    // Initialize Resend with API key
    this.resend = new Resend(process.env.RESEND_API_KEY || '');

    // Use custom domain email or fallback to Resend's onboarding email
    this.fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const data = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
        replyTo: 'bongal848@gmail.com', // Replies go to your Gmail
      });

      return data;
    } catch (error: any) {
      console.error('Email send error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendVerificationEmail(email: string, verificationCode: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Use the verification code below to access your বঙ্গাল account. Thank you! </h1>
        <h2 style="color: #16a34a; font-size: 32px; margin: 20px 0;">${verificationCode}</h2>
        <p style="margin-top: 30px; color: #666;">This code will expire in 15 minutes.</p>
        <p>If you did not sign up, please ignore this email.</p>
      </div>
    `;
    return this.sendEmail(email, 'Verify Your Email - বঙ্গাল', html);
  }


  async sendWelcomeEmail(to: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Welcome to বঙ্গাল! 🌾</h1>
        <p>Dear ${name},</p>
        <p>Thank you for registering with বঙ্গাল. We're excited to have you!</p>
        <p>Start exploring authentic village products from Bangladesh.</p>
        <a href="${process.env.CLIENT_URL}/products" 
           style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
          Browse Products
        </a>
        <p style="margin-top: 30px; color: #666;">Best regards,<br>The বঙ্গাল Team</p>
      </div>
    `;
    return this.sendEmail(to, 'Welcome to বঙ্গাল!', html);
  }

  async sendOrderConfirmation(to: string, orderDetails: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Order Confirmation 📦</h1>
        <p>Your order #${orderDetails.orderId} has been confirmed by বঙ্গাল!</p>
        <h3>Order Details:</h3>
        <ul>
          ${orderDetails.items.map((item: any) => `
            <li>${item.name} x ${item.quantity} - ৳${item.price * item.quantity}</li>
          `).join('')}
        </ul>
        <p style="font-size: 18px; font-weight: bold;">Total: ৳${orderDetails.total}</p>
        <p>We'll notify you when your order is shipped.</p>
        <a href="${process.env.CLIENT_URL}/orders" 
           style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
          Track Order
        </a>
      </div>
    `;
    return this.sendEmail(to, 'Order Confirmation - বঙ্গাল', html);
  }
}
