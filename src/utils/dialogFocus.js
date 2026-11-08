const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const trapDialogTab = (event, root, activeElement) => {
  if (event.key !== 'Tab' || !root) return false;
  const focusable = [...root.querySelectorAll(FOCUSABLE)];
  if (focusable.length === 0) {
    event.preventDefault();
    root.focus();
    return true;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && (activeElement === first || !root.contains?.(activeElement))) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && (activeElement === last || !root.contains?.(activeElement))) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
};
