import https from 'https';
import http from "http";
import CorrelationIds from '@dazn/lambda-powertools-correlation-ids';
import Log from '@dazn/lambda-powertools-logger';
import middy from '@middy/core';
import * as Lambda from 'aws-lambda';
import AWS from 'aws-sdk';
import AWSXRay, { Subsegment } from 'aws-xray-sdk';
export const withTracing = (tracingEnabled: boolean) => {
  return {
    before: (handler: middy.Request) => {
      try {
        /**
         * There is a bug in dazn/lambda-powertools-middleware-correlation-ids:
         * It doesn't support passing correlationIds for APIGatewayProxyHandlerV2
         * Problem: it looks for 'httpMethod' as a property on event, but for APIGatewayProxyHandlerV2 this property is stored in requestContext object
         * https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-middleware-correlation-ids/event-sources/api-gateway.js#L6
         */
        const event = handler?.event;
        if (event?.requestContext?.http?.method) {
          event['httpMethod'] = event.requestContext.http.method;
        }

        if (tracingEnabled) {
          AWSXRay.captureAWS(AWS);
          AWSXRay.captureHTTPsGlobal(http, true);
          AWSXRay.captureHTTPsGlobal(https, true);
          AWSXRay.capturePromise();

          const correlationId = CorrelationIds.get();
          if (!correlationId || !correlationId['x-correlation-id']) {
            Log.warn('x-correlation-id is undefined. Could not attach to xray.');

            return;
          }

          Log.debug('Correlation Id', { correlationId });
          const segment = AWSXRay.getSegment();
          const subSegment = segment.addNewSubsegment('Correlation ID');
          subSegment.addAnnotation('correlationID', correlationId['x-correlation-id']);
          subSegment.close();
        }
      } catch (err) {
        Log.warn('Error while instrumenting x-ray', { err });
      }
    },
  };
};

export const withMiddlewares = (handler: Lambda.APIGatewayProxyHandler) => {
  return middy(handler)
    .use(withTracing(true))
};


export const reportError = (error: Error): void => {
  Log.error('reportError', error)
  const segment = AWSXRay.getSegment();

  try {
    let subsegment = segment.addNewSubsegment("Error");
    subsegment.addError(error, true)
    subsegment.close();
   
  } catch (error) {
    Log.error('error', error);
  }
};

export async function wrapXRayAsync<T>(segmentName: string, f: (subsegment: AWSXRay.Subsegment | undefined) => T): Promise<T> {
  return AWSXRay.captureAsyncFunc(segmentName, async (subsegment) => {
    try {
      return f(subsegment);
    } finally {
      if (subsegment) {
        subsegment.close();
      }
    }
  });
}
