import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import Log from '@dazn/lambda-powertools-logger';
import fetch from 'node-fetch';

const ENDPOINT = process.env.DATABASE_API_ENDPOINT;
if (!ENDPOINT) throw new Error('Missing required environment variables!');

// Valid statuses
enum Statuses {
  STOCKED = 'STOCKED',
  DELIVERY_BOOKED = 'DELIVERY_BOOKED'
}

import wrap from '@dazn/lambda-powertools-pattern-basic';
import { withMiddlewares } from '../../../common/Tracing/middleware';

export const UpdateOrderStatus = wrap(withMiddlewares(UpdateOrderStatusHandler))

/**
 * @description Update order status
 */
export async function UpdateOrderStatusHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    const eventBody = event.body ? JSON.parse(event.body) : event;
    const { orderId, transaction } = eventBody;

    const status = (() => {
      if (transaction === 'StockCreated') return Statuses.STOCKED;
      if (transaction === 'DeliveryBooked') return Statuses.DELIVERY_BOOKED;
      throw new Error('Invalid or missing status!');
    })();

    const body = {
      query: `mutation {\n  updateOrderStatus(id: ${orderId}, status: ${status}) {\n    orderId\n  }\n}`
    };

    await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return {
      statusCode: 200,
      body: JSON.stringify('Ping from update order status')
    } as APIGatewayProxyResult;
  } catch (error) {
    Log.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    } as APIGatewayProxyResult;
  }
}
