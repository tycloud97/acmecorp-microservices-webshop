require('source-map-support').install();

import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import fetch from 'node-fetch';

import { emitEvent } from '../../common/EmitEvent/EmitEvent';
import Log from '@dazn/lambda-powertools-logger';
import { withMiddlewares } from '../../common/Tracing/middleware';
import wrap from '@dazn/lambda-powertools-pattern-basic'

const DATABASE_API_ENDPOINT = process.env.DATABASE_API_ENDPOINT;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
const CorrelationIds = require('@dazn/lambda-powertools-correlation-ids')

export const BookDelivery = wrap(withMiddlewares(BookDeliveryHandler))

/**
 * @description This is a canned mock of what a delivery provider might send back when you request to book a delivery timeslot.
 */
export async function BookDeliveryHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // Handle CORS
  Log.info('event', {event})
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      body: JSON.stringify('OK')
    } as APIGatewayProxyResult;
  }

  const eventBody = event.body ? JSON.parse(event.body) : event;
  const { orderId, deliveryTime } = eventBody;

  if (!orderId || !deliveryTime) {
    Log.error('Missing orderId or deliveryTime!');
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      body: JSON.stringify('Missing required parameters!')
    } as APIGatewayProxyResult;
  }

  /**
   * In a real scenario, you would want to integrate and send the delivery info to your Delivery Provider.
   *
   * In this demo, however, we will want to fetch some additional data from the database, which the email service will need to know about.
   * Between putting such fetching logic in this service (Delivery) or in the Email service, I'd rather put it in Delivery, as it's
   * more of a "core" service than the Email service is, and such logic can be considered "privileged". An Email service should not have
   * any such privileges.
   */
  const correlationId = CorrelationIds.get();

  const data = await fetch(DATABASE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'x-correlation-id': correlationId?.['x-correlation-id'],
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `query {
        getOrder(id: ${orderId}) {
          customerName
          customerEmail
          customerPhone
          customerStreet
          customerCity
        }
      }`
    })
  })
    .then((res) => res.json())
    .then((res) => res.data.getOrder)
    .catch((error) => Log.error(error));

  if (!data) throw new Error('No data received!');

  /**
   * Add delivery information to order
   */
  await fetch(DATABASE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'x-correlation-id': correlationId?.['x-correlation-id'],
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `mutation {
        addDeliveryDataToOrder(deliveryData: {orderId: ${orderId}, deliveryTime: "${deliveryTime}"})
      }`
    })
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.data.addDeliveryDataToOrder) {
        const message = 'Failed to update with delivery information!';
        Log.error(message);
        throw new Error(message);
      }
    })
    .catch((error) => Log.error(error));

  // @ts-ignore
  const { customerName, customerEmail, customerPhone, customerStreet, customerCity } = data;
  Log.info("Prepare to push", {data})

  /**
   * Create a booking object
   */
  const booking = {
    orderId,
    name: customerName,
    email: customerEmail,
    phone: customerPhone,
    street: customerStreet,
    city: customerCity,
    deliveryTime
  };

  /**
   * Emit event so our other services can use the information
   */
  await emitEvent('DeliveryBooked', { ...booking, correlationId: correlationId?.['x-correlation-id'] });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'OPTIONS,POST'
    },
    body: JSON.stringify(booking)
  } as APIGatewayProxyResult;
}
