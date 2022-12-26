require('source-map-support').install();

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import nodemailer from 'nodemailer';

import { createMessage } from './frameworks/messages';
import { createTransport } from './frameworks/nodemailer';

const NODEMAILER_USER = process.env.NODEMAILER_USER;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;
if (!NODEMAILER_USER || !NODEMAILER_USER)
  throw new Error('Missing Nodemailer user and/or password!');
import Log from '@dazn/lambda-powertools-logger';

import wrap from '@dazn/lambda-powertools-pattern-basic';
import { withMiddlewares } from '../../common/Tracing/middleware';

export const Email = wrap(withMiddlewares(EmailHandler))

/**
 * @description Send email with Ethereal mail service
 */
export async function EmailHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  Log.info('event', event)
  const eventBody = event.body ? JSON.parse(event.body) : event;
  const transaction = eventBody.transaction;

  const message = createMessage(transaction, eventBody);

  const mailTransport = createTransport(NODEMAILER_USER, NODEMAILER_PASS);

  // Attempt to send the email
  try {
    const mail = await mailTransport.sendMail(message);
    const previewUrl = nodemailer.getTestMessageUrl(mail);
    return {
      statusCode: 200,
      body: JSON.stringify(previewUrl)
    } as APIGatewayProxyResult;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    } as APIGatewayProxyResult;
  }
}
