import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // In a real app, you would retrieve the user's email from Clerk
    // and maybe save the customer ID back to Clerk's publicMetadata.
    // For now, we create a basic checkout session.

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID, // Replace with your actual Price ID from Stripe Dashboard
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      client_reference_id: userId,
      // Optional: Ask for billing address
      billing_address_collection: 'auto',
    });

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
