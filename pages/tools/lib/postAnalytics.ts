import type { JSONSchemaTool } from '../JSONSchemaTool';
import type { Transform } from '../hooks/useToolsTransform';

type AnalyticsEvent = 'query' | 'about';

interface AnalyticsQueryPayload extends Transform {}

interface AnalyticsAboutPayload extends JSONSchemaTool {}

type AnalyticsPayload = AnalyticsQueryPayload | AnalyticsAboutPayload;

export async function postAnalytics(
  eventType: AnalyticsEvent,
  eventPayload: AnalyticsPayload,
) {
  try {
    const deviceType = /Mobi/.test(navigator.userAgent) ? 'Mobile' : 'Desktop';

    const response = await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceType,
        event: eventType,
        payload: eventPayload,
      }),
    });

    if (!response.ok) {
      console.error('Error posting analytics event:', response.statusText);
    } else {
      console.log('Event posted successfully');
    }
  } catch (error) {
    console.error('Error posting event:', error);
  }
}
