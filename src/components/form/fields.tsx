import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

export function inputClass(hasError = false) {
  return cn(
    "w-full rounded-md border bg-white px-3 py-2.5 text-sm text-neutral-800",
    "placeholder:text-neutral-400 transition-colors",
    "focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
      : "border-neutral-300 hover:border-neutral-400",
  );
}

type FieldProps = {
  id: string;
  label: ReactNode;
  children: ReactNode;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  requiredLabel?: string;
  className?: string;
};

/** Label, hint and error wiring shared by every text-like control. */
export function Field({
  id,
  label,
  children,
  error,
  hint,
  required,
  requiredLabel,
  className,
}: FieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-neutral-800"
      >
        {label}
        {required ? (
          <>
            <span aria-hidden className="ml-0.5 text-red-600">
              *
            </span>
            {requiredLabel ? (
              <span className="sr-only"> ({requiredLabel})</span>
            ) : null}
          </>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-neutral-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export function TextInput({ hasError, className, ...props }: TextInputProps) {
  return <input className={cn(inputClass(hasError), className)} {...props} />;
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export function Textarea({ hasError, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(inputClass(hasError), "min-h-32 resize-y", className)}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export function Select({ hasError, className, children, ...props }: SelectProps) {
  return (
    <select className={cn(inputClass(hasError), "pr-8", className)} {...props}>
      {children}
    </select>
  );
}

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: ReactNode;
  error?: string;
};

export function Checkbox({ id, label, error, className, ...props }: CheckboxProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-400 text-primary-700 accent-[#18174a] focus:ring-2 focus:ring-primary-200"
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        <label htmlFor={id} className="text-sm text-neutral-700">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Hidden field bots tend to fill in. Kept out of the tab order and off AT. */
export function Honeypot(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website">Website</label>
      <input
        id="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...props}
      />
    </div>
  );
}

type StatusProps = {
  tone: "error" | "success";
  title?: ReactNode;
  children: ReactNode;
};

export function FormStatus({ tone, title, children }: StatusProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-md border p-4 text-sm",
        tone === "error"
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-primary-200 bg-primary-50 text-primary-800",
      )}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? "mt-1" : undefined}>{children}</div>
    </div>
  );
}

/** Section wrapper matching the reference form's grouped layout. */
export function FormSection({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-lg border border-line bg-white p-5 sm:p-6">
      <legend className="px-2 text-base font-bold text-primary-800">
        {title}
      </legend>
      <div className="mt-2 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
