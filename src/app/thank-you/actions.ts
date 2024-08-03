'use server';

import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(
    `this is getPyamentStatus function and user is ${user?.id} ${user?.email}`
  );

  if (!user?.id || !user.email) {
    throw new Error('You need to be logged in to view this page.');
  }

  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  });
  console.log(
    `this is getPyamentStatus function and the order is is ${order?.isPaid}`
  );

  if (!order) throw new Error('This order does not exist.');

  if (order.isPaid) {
    return order;
  } else {
    return false;
  }
};
