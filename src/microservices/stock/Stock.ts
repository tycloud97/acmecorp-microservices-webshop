require('source-map-support').install();

import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

import { emitEvent } from '../../common/EmitEvent/EmitEvent';
import wrap from '@dazn/lambda-powertools-pattern-basic'
import Log from '@dazn/lambda-powertools-logger';

export const Stock = wrap(withMiddlewares(StockHandler))

import { withMiddlewares } from '../../common/Tracing/middleware';
/**
 * @description This is our integration point to handle anything to do with the stockist, like ordering items, stocking them, etc.
 */
export async function StockHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  Log.info('event', {event})
  const eventBody = event.body ? JSON.parse(event.body) : event;
  const { orderId } = eventBody;


  const CorrelationIds = require('@dazn/lambda-powertools-correlation-ids')
  const correlationId = CorrelationIds.get();

  if (orderId) {
    /**
     * Fast forward to items being stocked...
     */
    await emitEvent('StockCreated', { orderId, correlationId: correlationId?.['x-correlation-id'] });

    return {
      statusCode: 200,
      body: JSON.stringify(`Stock created for order ${orderId}`)
    } as APIGatewayProxyResult;
  }

  console.error('Missing "orderId" property!');

  return {
    statusCode: 400,
    body: JSON.stringify('Missing "orderId" property!')
  } as APIGatewayProxyResult;
}
