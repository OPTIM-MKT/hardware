import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      theme="system"
      toastOptions={{
        style: {
          borderRadius: "14px",
          fontFamily:
            "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        },
        className: "hw-toast",
      }}
    />
  );
}
