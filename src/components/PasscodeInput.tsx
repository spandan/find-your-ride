"use client";

type PasscodeInputProps = {
  name: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  autoComplete?: "current-password" | "new-password";
  placeholder?: string;
};

export function PasscodeInput({
  name,
  label,
  required = true,
  minLength = 4,
  maxLength = 32,
  autoComplete = "current-password",
  placeholder = "••••••••",
}: PasscodeInputProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        name={name}
        type="password"
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className="input-field font-mono tracking-widest"
        autoComplete={autoComplete}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        inputMode="text"
        placeholder={placeholder}
        aria-label={label}
        data-1p-ignore
      />
    </label>
  );
}
