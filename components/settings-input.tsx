import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface SettingConfig {
  label: string;
  id: string;
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

export function SettingInput({
  label,
  id,
  value,
  onChange,
  min,
  max,
}: SettingConfig) {
  return (
    <div className="flex items-center gap-4 justify-between">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="col-span-3 flex items-center gap-2">
        <Input
          id={id}
          type="number"
          className="w-18"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>min</span>
      </div>
    </div>
  );
}

interface SettingsFormProps {
  settings: SettingConfig[];
}

export function SettingsForm({ settings }: SettingsFormProps) {
  return (
    <div className="grid gap-4 py-4">
      {settings.map((setting) => (
        <SettingInput key={setting.id} {...setting} />
      ))}
    </div>
  );
}
