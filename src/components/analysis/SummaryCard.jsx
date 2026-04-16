'use client';
// ── Summary Card ───────────────────────────────────────────────────
import { FileText } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function SummaryCard({ summary }) {
  return (
    <Card className="animate-slide-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <FileText size={15} className="text-primary-light" />
        </div>
        <h3 className="font-semibold text-slate-200">Summary</h3>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
    </Card>
  );
}
