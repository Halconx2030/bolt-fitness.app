import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export class Analytics {
  static init() {
    mixpanel.init(MIXPANEL_TOKEN!);
  }

  static trackPageView(page: string) {
    mixpanel.track('Page View', { page });
  }

  static trackEvent(name: string, properties?: Record<string, any>) {
    mixpanel.track(name, properties);
  }

  static setUserProperties(userId: string, properties: Record<string, any>) {
    mixpanel.people.set(userId, properties);
  }
}
