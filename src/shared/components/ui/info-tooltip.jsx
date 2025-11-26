import { Info } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

/**
 * AWS-inspired InfoTooltip component
 * Displays inline help text with an info icon
 */
const InfoTooltip = ({ content, className, iconClassName }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center",
            "text-gray-400 hover:text-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded-full",
            "transition-colors",
            className
          )}
          aria-label="More information"
        >
          <Info className={cn("w-4 h-4", iconClassName)} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={cn(
            "z-50 w-72 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
          sideOffset={5}
        >
          {content}
          <Popover.Arrow className="fill-gray-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default InfoTooltip;
