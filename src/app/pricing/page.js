import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Check, Zap, Shield, Crown } from 'lucide-react';

export const metadata = {
  title: 'Pricing | AI Crypto Research Copilot',
};

export default function PricingPage() {
  const { userId } = auth();

  const features = [
    'Unlimited AI token analysis',
    'Historical risk scoring',
    'Advanced sentiment tracking',
    'Custom watchlist with alerts',
    'Early access to new features',
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Upgrade your trading edge
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Get deeper insights and unlimited usage with Copilot Pro. Built for serious researchers and traders.
        </p>
      </div>

      <div className="max-w-md mx-auto relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-light rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
        
        <div className="relative bg-bg-elevated border border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Crown size={24} className="text-primary-light" />
                Pro Plan
              </h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-slate-100">$19</span>
              <span className="text-slate-400 text-sm">/mo</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-primary-light" />
                </div>
                <span className="text-slate-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <form action="/api/checkout" method="POST">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-primary-content font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Zap size={18} />
              {userId ? 'Upgrade to Pro' : 'Get Started with Pro'}
            </button>
          </form>
          
          {!userId && (
            <p className="text-center text-xs text-slate-500 mt-4">
              You will be prompted to sign in before purchasing.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
