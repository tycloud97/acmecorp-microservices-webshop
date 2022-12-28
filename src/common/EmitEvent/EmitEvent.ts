import AWSXRay from 'aws-xray-sdk';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const eventBridge = AWSXRay.captureAWSv3Client(new EventBridgeClient({ region: 'us-east-1' }));
import Log from '@dazn/lambda-powertools-logger';

import { events } from './events';
import { captureException } from '../Tracing/middleware';

/**
 * @description Utility to emit events with AWS EventBridge library
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html
 * @see https://www.npmjs.com/package/@aws-sdk/client-eventbridge
 */
export async function emitEvent(eventName: string, data: Record<string, unknown>) {
  try {
    Log.info('emitEvent', {data})
    const command = events[eventName](data);
    const event = new PutEventsCommand({ Entries: [command] });
    if (!event) throw new Error('No such event name!');

    return await eventBridge.send(event);
  } catch (error) {
    captureException(error)
    Log.error('Failed to emit event!\n', error);
  }
}
