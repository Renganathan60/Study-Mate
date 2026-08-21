import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function EmptyState({ icon: Icon = HelpCircle, title, description, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-white/50 ">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 ">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900 ">{title}</h3>
      <p className="mt-1.5 text-xs text-slate-500 max-w-xs">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
