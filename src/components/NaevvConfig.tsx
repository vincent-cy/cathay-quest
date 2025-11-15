import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getNaevvConfig,
  saveNaevvConfig,
  clearNaevvConfig,
  isNaevvConfigured,
  type NaevvConfig,
} from "@/config/naevv.config";

interface NaevvConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NaevvConfigDialog = ({ open, onOpenChange }: NaevvConfigProps) => {
  const [config, setConfig] = useState<NaevvConfig>(getNaevvConfig());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setConfig(getNaevvConfig());
  }, [open]);

  const handleSave = () => {
    if (config.apiKey && config.llmBoundary) {
      saveNaevvConfig({
        apiKey: config.apiKey,
        llmBoundary: config.llmBoundary,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleClear = () => {
    clearNaevvConfig();
    setConfig({
      apiKey: null,
      llmBoundary: null,
      isConfigured: false,
    });
  };

  const isValid = config.apiKey && config.llmBoundary;
  const isConfigured = isNaevvConfigured();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            Naevv AI Assistant Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Alert */}
          {isConfigured && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Naevv is configured and ready to use!
              </AlertDescription>
            </Alert>
          )}

          {!config.apiKey || !config.llmBoundary ? (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                Please configure both API Key and LLM Boundary to enable Naevv
              </AlertDescription>
            </Alert>
          ) : null}

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-base font-semibold">
              API Key <span className="text-red-500">*</span>
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Naevv API Key"
              value={config.apiKey || ""}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and never sent to
              our servers.
            </p>
          </div>

          {/* LLM Boundary Input */}
          <div className="space-y-2">
            <Label htmlFor="llm-boundary" className="text-base font-semibold">
              LLM Boundary / System Prompt{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="llm-boundary"
              placeholder="Enter the LLM boundary or system prompt that defines Naevv's behavior and constraints..."
              value={config.llmBoundary || ""}
              onChange={(e) =>
                setConfig({ ...config, llmBoundary: e.target.value })
              }
              rows={6}
              className="font-mono text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This prompt defines how Naevv behaves and what boundaries it
              operates within.
            </p>
          </div>

          {/* Info Card */}
          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-2 text-sm">About Naevv</h4>
            <p className="text-xs text-muted-foreground space-y-2">
              <div>
                Naevv is an AI assistant designed to help users with
                personalized quest recommendations and assistance throughout the
                Cathay Quest application.
              </div>
              <div>
                Configure your API key and system prompt to customize Naevv's
                behavior for your needs.
              </div>
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={!isConfigured}
            >
              Clear Configuration
            </Button>
            <Button onClick={handleSave} disabled={!isValid} className="gap-2">
              {isSaved && <CheckCircle className="w-4 h-4" />}
              {isSaved ? "Saved!" : "Save Configuration"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
