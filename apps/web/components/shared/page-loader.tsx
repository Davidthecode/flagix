import { Spinner } from "@flagix/ui/components/spinner";

export default function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner className="text-emerald-600" size={32} />
    </div>
  );
}
