import { useEffect } from 'react';

export const useDialogFocus = (isOpen, dialogRef, initialRef) => {
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    (initialRef?.current || dialog?.querySelector('button, input, a[href]') || dialog)?.focus();
    return () => {
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen, dialogRef, initialRef]);
};
