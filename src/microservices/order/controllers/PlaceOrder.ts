require('source-map-support').install();

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import fetch from 'node-fetch';

const ENDPOINT = process.env.DATABASE_API_ENDPOINT;

import Log from '@dazn/lambda-powertools-logger';
import wrap from '@dazn/lambda-powertools-pattern-basic';
import { captureException, withMiddlewares } from '../../../common/Tracing/middleware';
const CorrelationIds = require('@dazn/lambda-powertools-correlation-ids')

export const PlaceOrder = wrap(withMiddlewares(PlaceOrderHandler))

/**
 * @description Placing the order is done after any payment processing is complete.
 * The function is nothing more than a (public) security buffer that interacts with the ("internal") Database API.
 */
export async function PlaceOrderHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    Log.info('event', {event});

    const eventBody = event.body ? JSON.parse(event.body) : event;
    Log.info('eventBody', eventBody);

    /**
     * Use eventbody.detail if you are not doing any input transformation.
     * Since we are using 11 arguments, we are above the maximum number of items we can transform.
     * Therefore, we accept all data and destructure it manually instead.
     */
    const {
      name,
      email,
      phone,
      street,
      city,
      customerType,
      market,
      products,
      totalPrice,
      testId,
      orgNumber
    } = eventBody.detail;

    const body = {
      query: `mutation {
      placeOrder(name: "${name}", email: "${email}", phone: "${phone}", street: "${street}", city: "${city}", customerType: "${customerType}", market: "${market}", products: "${products}", totalPrice: ${totalPrice}, testId: ${testId}, orgNumber: ${orgNumber}) {
        orderId
      }
    }
    `
    };

    const correlationId = CorrelationIds.get();

    await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'x-correlation-id': correlationId?.['x-correlation-id'],
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return {
      statusCode: 200,
      body: JSON.stringify('SUCCESS')
    } as APIGatewayProxyResult;
  } catch (error) {
    captureException(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    } as APIGatewayProxyResult;
  }
}
