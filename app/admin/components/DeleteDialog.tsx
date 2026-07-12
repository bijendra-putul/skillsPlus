// app/admin/components/DeleteDialog.tsx
"use client";

interface DeleteDialogProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteDialog({
  isOpen,
  title,
  subtitle,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm bg-[#13151f] border border-white/10 rounded-2xl shadow-2xl z-10 p-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl mx-auto mb-4">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-white font-semibold text-center text-lg">
          {title}
        </h3>
        {subtitle && (
          <p className="text-slate-400 text-sm text-center mt-2">{subtitle}</p>
        )}

        <p className="text-slate-500 text-xs text-center mt-3">
          This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl transition-all"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
