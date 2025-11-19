export class SMSService {
  async sendSMS(phone: string, message: string) {
    return { success: true, message: 'SMS sent successfully' };
  }

  async sendOrderConfirmationSMS(phone: string, orderId: string) {
    const message = `Your order #${orderId} has been confirmed. Thank you for shopping with বঙ্গাল!`;
    return this.sendSMS(phone, message);
  }

  async sendOrderStatusSMS(phone: string, orderId: string, status: string) {
    const message = `Your order #${orderId} is now ${status}. Track your order at ${process.env.CLIENT_URL}/orders`;
    return this.sendSMS(phone, message);
  }
}
