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
  supportedDialects: JSONSchemaTool['supportedDialects'];
}

type AnalyticsParams = AnalyticsQueryParams | AnalyticsAboutParams;

export async function postAnalytics({
  eventType,
  eventPayload,
}: AnalyticsParams) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Analytics event is disabled in development mode.');
      return;
    }

    const deviceType = /Mobi/.test(navigator.userAgent) ? 'Mobile' : 'Desktop';

    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbyKimeFeIfrY8OH2waWajATg-21cdC6PlzZ4iJTsETNQA6854jkQSAyMVv6lDKzCUSs/exec',
      {
        redirect: 'follow',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          deviceType,
          event: eventType,
          payload: eventPayload,
        }),
      },
    );

    if (!response.ok) {
      console.error('Error posting analytics event:', response.statusText);
    } else {
      console.log('Event posted successfully');
    }
  } catch (error) {
    console.error('Error posting event:', error);
  }
}
