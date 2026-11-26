import React, { ReactNode } from "react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import SkipPaySettingsForm from "@/components/skip_pay/SkipPaySettingsForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Theme, useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const SettingsSection: React.FC<{ title: string, description: ReactNode, children: ReactNode }> = ({ title, description, children }) => (
  <section className="grid gap-4 border-t py-8 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
    <div className="space-y-1">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="min-w-0">{children}</div>
  </section>
)

const themeOptions: { value: Theme, label: string, icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

const ThemeSegmentedControl: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div role="radiogroup" aria-label="Theme" className="inline-flex w-full rounded-lg border bg-muted/40 p-1 sm:w-auto">
      {themeOptions.map((option) => {
        const selected = theme === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex h-8 flex-1 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none",
              selected && "bg-card text-foreground shadow-xs"
            )}
          >
            <option.icon className="size-4" aria-hidden="true" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

const SettingsPage: React.FC = () => {
  return (
    <div>
      <PageHeader title="Settings" description="Manage calculator rates and how Invoicer looks." />

      <div className="border-t pt-8">
        <SettingsSection
          title="Skip Pay calculator"
          description="Rates used to calculate the monthly invoice. Each customer has its own settings, used by the calculator."
        >
          <SkipPaySettingsForm />
        </SettingsSection>

        <SettingsSection
          title="Appearance"
          description="Choose a theme. System follows your operating system's light or dark setting."
        >
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">Saved in this browser.</p>
              </div>
              <ThemeSegmentedControl />
            </CardContent>
          </Card>
        </SettingsSection>
      </div>
    </div>
  );
}

export default SettingsPage;
