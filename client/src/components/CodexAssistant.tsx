import { useState } from "react";
import { useCodex } from "@/hooks/useCodex";
import { Brain, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CodexAssistant({ role }: { role: "coach" | "client" | "athlete" }) {
  const { askCodex, response, loading } = useCodex(role);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      askCodex(input);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!open ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="bg-gradient-to-br from-primary to-secondary text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all"
            title="Assistant Codex"
          >
            <Brain className="w-6 h-6" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-card shadow-2xl rounded-2xl w-96 border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                <h3 className="font-semibold">Synrgy Codex</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Response Area */}
            <div className="h-64 overflow-y-auto p-4 bg-muted/20">
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="ml-2">Codex réfléchit...</span>
                </div>
              ) : response ? (
                <div className="prose prose-sm max-w-none">
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <p className="text-sm whitespace-pre-wrap">{response}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Pose-moi une question !</p>
                  <p className="text-xs mt-2">Je suis ton assistant IA Synrgy</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <input
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Demande à ton assistant..."
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Powered by Synrgy Codex AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

