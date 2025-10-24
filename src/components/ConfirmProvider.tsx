"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

type ConfirmContextType = {
  confirm: (message: string, opts?: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);

  const confirm = useCallback((msg: string, opts: ConfirmOptions = {}) => {
    setMessage(msg);
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleClose = (result: boolean) => {
    setOpen(false);
    if (resolver) resolver(result);
    setResolver(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" />
          <div className="bg-white rounded-lg shadow-lg z-10 max-w-md w-full p-6">
            {options.title && (
              <h3 className="text-lg font-semibold mb-2">{options.title}</h3>
            )}
            <p className="text-sm text-gray-700 mb-4">
              {options.description || message}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleClose(false)}
                className="px-3 py-2 rounded border border-gray-200"
              >
                {options.cancelLabel || "Cancel"}
              </button>
              <button
                onClick={() => handleClose(true)}
                className="px-3 py-2 rounded bg-red-600 text-white"
              >
                {options.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
