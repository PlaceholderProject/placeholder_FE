import { toast } from "sonner";
import React from "react";

type ConfirmOptions = {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export function showConfirmToast({ message, confirmText = "확인", cancelText = "취소", onConfirm, onCancel }: ConfirmOptions) {
  toast.custom(t => (
    <div className="w-[32.5rem] rounded-[0.9rem] bg-white p-[2rem] text-sm text-zinc-900 shadow-md">
      <p className="font-medium">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            toast.dismiss(t);
            onCancel?.();
          }}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            toast.dismiss(t);
            onConfirm();
          }}
          className="rounded-md bg-zinc-900 px-3 py-1 text-sm text-white hover:bg-zinc-800"
        >
          {confirmText}
        </button>
      </div>
    </div>
  ));
}
