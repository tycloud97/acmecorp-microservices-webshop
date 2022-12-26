import { makeNewOrderDatabase } from '../../entities/OrderDatabase';

import { emitEvent } from '../../../../common/EmitEvent/EmitEvent';
const CorrelationIds = require('@dazn/lambda-powertools-correlation-ids')
import Log from '@dazn/lambda-powertools-logger';

export const placeOrder = async (
  name: string,
  email: string,
  phone: string,
  street: string,
  city: string,
  customerType: string,
  market: string,
  products: string,
  totalPrice: number,
  orgNumber?: number,
  testId?: number
) => {
  const db = makeNewOrderDatabase();

  const data = await db.placeOrder(
    name,
    email,
    phone,
    street,
    city,
    customerType,
    market,
    products,
    totalPrice,
    orgNumber,
    testId
  );


  const correlationId = CorrelationIds.get();

  Log.info('placeOrder correlationId', correlationId)

  await emitEvent('OrderPlaced', { ...data, correlationId: correlationId?.['x-correlation-id'] });

  return data.orderId;
};
