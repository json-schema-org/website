import type { JSONSchemaTool } from '../JSONSchemaTool';
import type { Transform } from '../hooks/useToolsTransform';

interface AnalyticsQueryParams {
  eventType: 'query';
  eventPayload: Transform;
}

interface AnalyticsAboutParams {
  eventType: 'about';
  eventPayload: AnalyticsAboutPayload;
}

interface AnalyticsAboutPayload {
  name: JSONSchemaTool['name'];
  toolingTypes: JSONSchemaTool['toolingTypes'];
  languages: JSONSchemaTool['languages'];
  environments: JSONSchemaTool['environments'];
  license: JSONSchemaTool['license'];
  source: JSONSchemaTool['source'];
  homepage: JSONSchemaTool['homepage'];
  supportedDialects: JSONSchemaTool['supportedDialects'];
}

type AnalyticsParams = AnalyticsQueryParams | AnalyticsAboutParams;

export async function postAnalytics({
  eventType,
  eventPayload,
}: AnalyticsParams) {
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
