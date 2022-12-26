require('source-map-support').install();

import Log from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { withMiddlewares } from '../../common/Tracing/middleware';
import wrap from '@dazn/lambda-powertools-pattern-basic'

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
export const DeliveryTimes = wrap(withMiddlewares(DeliveryTimesHandler))

/**
 * @description This is a canned mock of what a delivery provider might send back when you request available timeslots.
 */
export async function DeliveryTimesHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  Log.info('event', event)

  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'OPTIONS,GET'
      },
      body: JSON.stringify('OK')
    } as APIGatewayProxyResult;
  }

  /**
   * Send back the following hard-coded dates:
   * 02/15/2021 @ 5:00pm (UTC) ---> 1613408400000
   * 02/16/2021 @ 6:00pm (UTC) ---> 1613498400000
   * 02/17/2021 @ 7:00pm (UTC) ---> 1613588400000
   */

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'OPTIONS,GET'
    },
    body: JSON.stringify({
      deliveryOptions: ['1613408400000', '1613498400000', '1613588400000']
    })
  } as APIGatewayProxyResult;
}
