// ==============================================================================
// PAIMANA PREDICT — MULTI-CHANNEL NOTIFICATION PROVIDERS
// Multi-Channel Dispatch Adapters (In-App, NIC SMS Gateway, Gov-Mail, WhatsApp)
// ==============================================================================

class NotificationProviders {
  constructor() {
    this.deliveryLogs = [];
  }

  async dispatchMultiChannel(payload) {
    const { channels = ['IN_APP'], recipient, subject, message, metadata = {} } = payload;
    const results = [];

    for (const ch of channels) {
      let status = 'SENT';
      let channelRef = null;

      switch (ch) {
        case 'EMAIL':
          channelRef = `MAIL-GW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          // Simulated Gov-Mail SMTP dispatcher
          break;
        case 'SMS':
          channelRef = `NIC-SMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          // Simulated NIC SMS Gateway dispatcher
          break;
        case 'WHATSAPP':
          channelRef = `WA-GOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          // Simulated WhatsApp for Gov API dispatcher
          break;
        case 'IN_APP':
        default:
          channelRef = `INAPP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          break;
      }

      const log = {
        dispatchId: `DSP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        channel: ch,
        channelRef,
        recipient: recipient || 'monitoring_officer',
        subject: subject || 'Government Project Notification',
        messageSnippet: (message || '').slice(0, 120),
        status,
        timestamp: new Date().toISOString(),
      };

      this.deliveryLogs.unshift(log);
      if (this.deliveryLogs.length > 200) {
        this.deliveryLogs = this.deliveryLogs.slice(0, 200);
      }

      results.push(log);
    }

    return results;
  }

  getDeliveryLogs(limit = 50) {
    return this.deliveryLogs.slice(0, limit);
  }
}

export const notificationProviders = new NotificationProviders();
