import React from 'react';
import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import BillingDashboard from './_components/billing-dashboard';

type Params = Promise<Record<string, never>>;
type SearchParams = Promise<{
  session_id?: string;
  [key: string]: string | string[] | undefined;
}>;

export default async function Page(props: { params: Params; searchParams: SearchParams }) {
  // Await both params and searchParams
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);

  const session_id = typeof searchParams.session_id === 'string' ? searchParams.session_id : '';

  if (session_id) {
    const stripe = new Stripe(process.env.STRIPE_SECRET!, {
      typescript: true,
      apiVersion: '2025-03-31.basil',
    });

    try {
      const session = await stripe.checkout.sessions.listLineItems(session_id);
      const user = await currentUser();

      if (user) {
        const plan = session.data[0]?.description || 'Basic';
        const credits = plan === 'Unlimited' ? 'Unlimited' : plan === 'Pro' ? '100' : '10';

        await db.user.update({
          where: { clerkId: user.id },
          data: { tier: plan, credits },
        });
      }
    } catch (error) {
      console.error('Stripe session error:', error);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Billing</span>
      </h1>
      <BillingDashboard />
    </div>
  );
}
