import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object;

  if (event.type === 'checkout.session.completed') {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const userId = session.client_reference_id;

    if (userId) {
      // Update Clerk user metadata to mark them as PRO
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          stripeCustomerId: session.customer,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          plan: 'pro',
        },
      });
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    // Find the user by Customer ID in Clerk (optional, or rely on active session)
    const users = await clerkClient.users.getUserList({
      query: session.customer, // Clerk doesn't natively search by metadata easily without listing, but in practice, you might store mapping in DB
    });

    // We can iterate and update if we stored it in publicMetadata
    const user = users.data.find((u) => u.publicMetadata.stripeCustomerId === session.customer);

    if (user) {
      await clerkClient.users.updateUserMetadata(user.id, {
        publicMetadata: {
          ...user.publicMetadata,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
