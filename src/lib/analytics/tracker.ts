import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

interface EventProperties {
  page?: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

interface UserProperties {
  name?: string;
  email?: string;
  role?: string;
  lastLogin?: Date;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
  [key: string]: string | number | boolean | Date | object | undefined;
}

export class Analytics {
  static init() {
    mixpanel.init(MIXPANEL_TOKEN!);
  }

  static trackPageView(page: string) {
    mixpanel.track('Page View', { page });
  }

  static trackEvent(name: string, properties?: EventProperties) {
    mixpanel.track(name, properties);
  }

  static setUserProperties(userId: string, properties: UserProperties) {
    mixpanel.people.set(userId, properties);
  }
}
