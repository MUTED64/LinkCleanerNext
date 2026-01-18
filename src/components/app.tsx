"use client";

import { useState, useCallback, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { toast } from "sonner";
import { Copy, Clipboard, Link, Loader2, CheckCircle } from "lucide-react";

import {
  extractUrls,
  replaceUrlsInText,
  copyToClipboard,
  readFromClipboard,
} from "@/lib/url-utils";
import { expandUrls } from "@/lib/api";

function TitleSection() {
  return (
    <div className="text-center space-y-2 py-8">
      <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
        <Link className="text-primary" />
        链接清洗工具
      </h1>
      <p className="text-muted-foreground">
        粘贴包含短链接的文本
        <br />
        自动还原长链接并清除跟踪参数
      </p>
    </div>
  );
}

function InputCard({ inputText, setInputText, onPaste, onCopy }: {
  inputText: string;
  setInputText: (value: string) => void;
  onPaste: () => void;
  onCopy: (text: string, type: "input" | "output") => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          输入内容
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPaste}
              className="flex items-center gap-1"
            >
              <Clipboard className="h-4 w-4" />
              粘贴并处理
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(inputText, "input")}
              disabled={!inputText}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              复制
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="在这里粘贴包含短链接的文本..."
          className="min-h-32 resize-none"
        />
      </CardContent>
    </Card>
  );
}

function ProcessingButton({ isProcessing, inputText, onProcess }: {
  isProcessing: boolean;
  inputText: string;
  onProcess: () => void;
}) {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onProcess}
        disabled={isProcessing || !inputText.trim()}
        size="lg"
        className="px-8"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            处理中...
          </>
        ) : (
          <>
            <Link className="h-4 w-4 mr-2" />
            处理链接
          </>
        )}
      </Button>
    </div>
  );
}

function OutputCard({ outputText, onCopy }: {
  outputText: string;
  onCopy: (text: string, type: "input" | "output") => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          处理结果
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(outputText, "output")}
              disabled={!outputText}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              复制
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={outputText}
          readOnly
          placeholder="处理后的内容将显示在这里..."
          className="min-h-32 resize-none bg-muted"
        />
      </CardContent>
    </Card>
  );
}

function FeatureList() {
  const features = [
    { title: "自动识别链接", desc: "支持识别文本中的http和https链接" },
    { title: "批量处理", desc: "可以同时处理多个短链接" },
    { title: "自动复制", desc: "处理完成后自动复制结果到剪贴板" },
    { title: "保留格式", desc: "原文本格式和非链接内容完全保留" },
  ];

  return (
    <>
      <CardContent className="space-y-3 pt-4 pb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{feature.title}</p>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardContent className="border-t pt-4">
        <p className="text-sm text-muted-foreground mb-2">
          自动清理以下跟踪参数和处理特殊链接：
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• UTM参数: utm_source, utm_medium, utm_campaign 等</p>
          <p>• 社交媒体参数: share_from, share_id, vd_source 等</p>
          <p>• 电商跟踪参数: spm, plat_id, track_id 等</p>
        </div>
        <p className="text-xs text-muted-foreground/60 mt-3">
          * 清洗规则可以在后端代码中自定义配置
        </p>
      </CardContent>
    </>
  );
}

function InstructionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">使用说明</CardTitle>
      </CardHeader>
      <FeatureList />
    </Card>
  );
}

export default function UrlCleanerApp() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [, startTransition] = useTransition();

  const handlePaste = useCallback(async () => {
    try {
      const clipboardText = await readFromClipboard();
      if (clipboardText) {
        setInputText(clipboardText);
        toast.success("已从剪贴板粘贴内容");

        startTransition(() => {
          processUrls(clipboardText);
        });
      } else {
        toast.error("剪贴板为空或无法访问");
      }
    } catch {
      toast.error("无法访问剪贴板");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTransition]);

  const handleCopy = useCallback(async (text: string, type: "input" | "output") => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${type === "input" ? "输入" : "输出"}内容已复制`);
    } else {
      toast.error("复制失败");
    }
  }, []);

  const processUrls = useCallback(async (textToProcess?: string) => {
    const text = textToProcess || inputText;
    if (!text.trim()) {
      toast.error("请输入要处理的内容");
      return;
    }

    setIsProcessing(true);

    try {
      const urlMatches = extractUrls(text);

      if (urlMatches.length === 0) {
        setOutputText(text);
        setIsProcessing(false);
        return;
      }

      toast.info(`找到 ${urlMatches.length} 个链接，正在处理...`);

      const urls = urlMatches.map((match) => match.url);
      const results = await expandUrls(urls);

      const urlReplacements = results.map((result) => ({
        original: result.original,
        replacement: result.result ? result.result.expanded : result.original,
      }));

      const processedText = replaceUrlsInText(text, urlReplacements);
      setOutputText(processedText);

      const successCount = results.filter((r) => r.result).length;
      const errorCount = results.filter((r) => r.error).length;

      if (successCount > 0) {
        toast.success(
          `成功处理 ${successCount} 个链接${
            errorCount > 0 ? `，${errorCount} 个失败` : ""
          }`
        );

        const copySuccess = await copyToClipboard(processedText);
        if (copySuccess) {
          toast.success("处理结果已自动复制到剪贴板");
        }
      } else {
        toast.error("所有链接处理失败");
      }

      results.forEach((result) => {
        if (result.error) {
          console.error(`处理 ${result.original} 失败:`, result.error);
        }
      });
    } catch (error) {
      console.error("处理过程中发生错误:", error);
      toast.error("处理失败，请稍后重试");
    } finally {
      setIsProcessing(false);
    }
  }, [inputText]);

  return (
    <div className="min-h-screen bg-gradient-to-br p-8">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
      <div className="max-w-3xl mx-auto space-y-6">
        <TitleSection />
        <InputCard
          inputText={inputText}
          setInputText={setInputText}
          onPaste={handlePaste}
          onCopy={handleCopy}
        />
        <ProcessingButton
          isProcessing={isProcessing}
          inputText={inputText}
          onProcess={() => processUrls()}
        />
        <OutputCard outputText={outputText} onCopy={handleCopy} />
        <InstructionsCard />
      </div>
    </div>
  );
}
