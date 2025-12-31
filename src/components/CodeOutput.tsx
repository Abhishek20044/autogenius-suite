import { Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CodeOutputProps {
  code: string;
  language: string;
  filename: string;
  explanation: string;
  standards: string[];
  warnings: string[];
}

export const CodeOutput = ({
  code,
  language,
  filename,
  explanation,
  standards,
  warnings,
}: CodeOutputProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "cpp":
      case "c++":
        return "text-primary";
      case "java":
        return "text-warning";
      case "rust":
        return "text-accent";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`font-mono text-sm font-medium ${getLanguageColor(language)}`}>
            {filename}
          </span>
          <div className="flex gap-1">
            {standards.map((std) => (
              <span
                key={std}
                className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent border border-accent/20"
              >
                {std}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadCode}>
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Code Block */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-warning/80" />
          <div className="w-3 h-3 rounded-full bg-accent/80" />
        </div>
        <pre className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
          <code className="font-mono text-sm text-foreground/90 whitespace-pre">
            {code}
          </code>
        </pre>
      </div>

      {/* Explanation */}
      {explanation && (
        <div className="glass rounded-xl p-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">Explanation</h4>
          <p className="text-sm text-muted-foreground">{explanation}</p>
        </div>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="glass rounded-xl p-4 border-warning/30">
          <h4 className="text-sm font-semibold text-warning mb-2">Important Notes</h4>
          <ul className="space-y-1">
            {warnings.map((warning, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-warning">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
