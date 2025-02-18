import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function ZoomControls({
  onZoomIn,
  onZoomOut,
}: ZoomControlsProps) {
  return (
    <div className="absolute bottom-8 right-8 flex flex-col gap-2">
      <button
        onClick={onZoomIn}
        className="w-8 h-8 bg-white rounded-md shadow-lg flex items-center justify-center hover:bg-gray-100"
      >
        <PlusIcon className="w-5 h-5 text-gray-600" />
      </button>
      <button
        onClick={onZoomOut}
        className="w-8 h-8 bg-white rounded-md shadow-lg flex items-center justify-center hover:bg-gray-100"
      >
        <MinusIcon className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
