import * as React from "react";

const cn = (...classes: (string | undefined | null | false)[]) => 
  classes.filter(Boolean).join(" ");

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          className
        )}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Select.displayName = "Select";

// Compatibility components for existing imports
const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
        "ring-offset-background placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <span className="text-muted-foreground">{placeholder}</span>
);

const SelectContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="hidden" {...props}>{children}</div>
);

const SelectItem = ({ value, children, ...props }: { value: string; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
  <option value={value} {...props}>{children}</option>
);

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
