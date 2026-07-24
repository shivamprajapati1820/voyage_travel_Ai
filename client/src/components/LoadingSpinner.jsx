import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size = 24, fullScreen = false, label }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 size={size} className="animate-spin text-primary-600" />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
