require('source-map-support').install();

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import nodemailer from 'nodemailer';

import Log from '@dazn/lambda-powertools-logger';
import { createTransport } from './frameworks/nodemailer';

const NODEMAILER_USER = process.env.NODEMAILER_USER;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;
if (!NODEMAILER_USER || !NODEMAILER_USER)
  throw new Error('Missing Nodemailer user and/or password!');

import wrap from '@dazn/lambda-powertools-pattern-basic';
import AWSXRay from 'aws-xray-sdk';
import { reportError, withMiddlewares } from '../../common/Tracing/middleware';
import { createMessage } from './frameworks/messages';

export const Email = (withMiddlewares(EmailHandler))

const delay = ms => new Promise(res => setTimeout(res, ms));

const doTaskSixSeconds = async () => {
  Log.info("doTaskSixSeconds")
  const segment = AWSXRay.getSegment();
  const subsegment = segment.addNewSubsegment('doTaskSixSeconds');
  await delay(4000);
  await doTaskTwoSeconds(subsegment)
  subsegment.close();
}

const doTaskTwoSeconds = async (sm) => {
  Log.info("doTaskTwoSeconds")
  const subsegment = sm.addNewSubsegment('doTaskTwoSeconds');
  await delay(2000);
  subsegment.close();
}

/**
 * @description Send email with Ethereal mail service
 */
export async function EmailHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  Log.info('event', { event })
  const subsegment = AWSXRay.getSegment();
  const eventBody = event.body ? JSON.parse(event.body) : event;
  const transaction = eventBody.transaction;

  const message = createMessage(transaction, eventBody);

  const mailTransport = createTransport(NODEMAILER_USER, NODEMAILER_PASS);

  await doTaskSixSeconds();

  // Attempt to send the email
  try {
    const mail = await mailTransport.sendMail(message);
    const previewUrl = nodemailer.getTestMessageUrl(mail);
    return {
      statusCode: 200,
      body: JSON.stringify(previewUrl)
    } as APIGatewayProxyResult;
  } catch (error) {
    reportError(error)
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    } as APIGatewayProxyResult;
  } finally {
    subsegment.close()
  }
}