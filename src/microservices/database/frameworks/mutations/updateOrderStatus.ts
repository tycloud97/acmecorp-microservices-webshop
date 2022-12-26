import { makeNewOrderDatabase } from '../../entities/OrderDatabase';

import { emitEvent } from '../../../../common/EmitEvent/EmitEvent';
const CorrelationIds = require('@dazn/lambda-powertools-correlation-ids')

type Status = 'STOCKED' | 'DELIVERY_BOOKED';

export const updateOrderStatus = async (id: number, newStatus: Status) => {
  const db = makeNewOrderDatabase();

  const correlationId = CorrelationIds.get();
  const data = await db.updateOrderStatus(id, newStatus);

  if (newStatus === 'STOCKED') await emitEvent('OrderDeliverable', { ...data, correlationId: correlationId?.['x-correlation-id'] });

  return data.orderId;
};
