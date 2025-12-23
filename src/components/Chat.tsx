import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [widgetInput, setWidgetInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const widgetInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const messageInput = input;
    setInput("");
    setIsLoading(true);

    const assistantMessageIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const history = messages.map((msg) => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageInput, history })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[assistantMessageIndex] = {
                    role: "assistant",
                    content: accumulatedText
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Failed to parse chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[assistantMessageIndex] = {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again."
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleWidgetSubmit = async () => {
    if (!widgetInput.trim()) return;

    const userMessage: Message = { role: "user", content: widgetInput };
    setMessages([userMessage]);
    const messageInput = widgetInput;
    setWidgetInput("");
    setIsOpen(true);
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const assistantMessageIndex = 1;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageInput, history: [] })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[assistantMessageIndex] = {
                    role: "assistant",
                    content: accumulatedText
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Failed to parse chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[assistantMessageIndex] = {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again."
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  };

  const handleWidgetKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleWidgetSubmit();
    }
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full transition-all"
            style={{
              backgroundColor: "var(--sl-color-bg)",
              border: "1px solid var(--color-border)"
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--sl-color-accent)", flexShrink: 0 }}
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>
            <input
              ref={widgetInputRef}
              type="text"
              value={widgetInput}
              onChange={(e) => setWidgetInput(e.target.value)}
              onKeyDown={handleWidgetKeyDown}
              placeholder="Ask AI..."
              className="text-sm outline-none bg-transparent min-w-[150px]"
              style={{
                color: "var(--sl-color-white)"
              }}
            />
            {widgetInput.trim() && (
              <button
                onClick={handleWidgetSubmit}
                className="flex items-center justify-center w-7 h-7 rounded-full transition-all hover:scale-110 hover:shadow-lg group"
                style={{
                  backgroundColor: "var(--sl-color-accent)",
                  color: "var(--sl-color-black)",
                  flexShrink: 0
                }}
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:-translate-y-0.5 transition-transform duration-200"
                  style={{ display: "block" }}
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-96 h-[80vh] max-h-[800px] rounded-lg flex flex-col z-50 transition-all duration-300 ease-out ${
            isClosing
              ? "opacity-0 translate-y-2 scale-98"
              : "opacity-100 translate-y-0 scale-100"
          }`}
          style={{
            backgroundColor: "var(--sl-color-bg)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div
            className="flex items-center justify-between p-4 rounded-t-lg"
            style={{
              backgroundColor: "var(--sl-color-gray-6)",
              borderBottom: "1px solid var(--sl-color-gray-5)"
            }}
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--sl-color-accent)" }}
              >
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                <path d="M20 3v4" />
                <path d="M22 5h-4" />
                <path d="M4 17v2" />
                <path d="M5 18H3" />
              </svg>
              <h3
                className="font-semibold text-sm"
                style={{ color: "var(--sl-color-white)" }}
              >
                ZaneOps Assistant
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-all flex items-center justify-center group border border-transparent hover:border-[var(--sl-color-gray-5)]"
              style={{
                color: "var(--sl-color-gray-3)",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sl-color-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:rotate-90 transition-transform duration-200"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div
                className="text-center text-sm p-4"
                style={{ color: "var(--sl-color-gray-3)" }}
              >
                Ask me anything about ZaneOps!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`text-sm ${
                    msg.role === "user"
                      ? "rounded-2xl max-w-[80%] px-4 py-2"
                      : "w-full p-3"
                  }`}
                  style={
                    msg.role === "user"
                      ? {
                          backgroundColor: "var(--sl-color-gray-5)",
                          color: "var(--sl-color-white)"
                        }
                      : {
                          color: "var(--sl-color-white)"
                        }
                  }
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-4 last:mb-0 leading-7 text-[0.9rem]">
                              {children}
                            </p>
                          ),
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code
                                className="px-2 py-0.5 rounded-md text-xs font-mono"
                                style={{
                                  backgroundColor: "var(--sl-color-gray-6)",
                                  color: "var(--sl-color-accent)",
                                  border: "1px solid var(--sl-color-gray-5)"
                                }}
                              >
                                {children}
                              </code>
                            ) : (
                              <pre
                                className="p-4 rounded-lg overflow-x-auto my-3 border"
                                style={{
                                  backgroundColor: "var(--sl-color-gray-6)",
                                  borderColor: "var(--sl-color-gray-5)"
                                }}
                              >
                                <code
                                  className="text-xs font-mono block"
                                  style={{
                                    color: "var(--sl-color-white)",
                                    lineHeight: "1.7"
                                  }}
                                >
                                  {children}
                                </code>
                              </pre>
                            );
                          },
                          ul: ({ children }) => (
                            <ul
                              className="my-3 space-y-2 pl-5"
                              style={{ listStyleType: "disc" }}
                            >
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol
                              className="my-3 space-y-2 pl-5"
                              style={{ listStyleType: "decimal" }}
                            >
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-7 text-[0.9rem] pl-1">
                              {children}
                            </li>
                          ),
                          h1: ({ children }) => (
                            <h1
                              className="text-lg font-bold mb-3 mt-4 first:mt-0"
                              style={{ color: "var(--sl-color-white)" }}
                            >
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2
                              className="text-base font-bold mb-3 mt-4 first:mt-0"
                              style={{ color: "var(--sl-color-white)" }}
                            >
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3
                              className="text-sm font-semibold mb-2 mt-3 first:mt-0"
                              style={{ color: "var(--sl-color-white)" }}
                            >
                              {children}
                            </h3>
                          ),
                          a: ({ children, href }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--sl-color-accent)" }}
                              className="underline hover:opacity-80 transition-opacity font-medium"
                            >
                              {children}
                            </a>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote
                              className="border-l-4 pl-4 my-3 italic"
                              style={{
                                borderColor: "var(--sl-color-accent)",
                                color: "var(--sl-color-gray-2)"
                              }}
                            >
                              {children}
                            </blockquote>
                          ),
                          strong: ({ children }) => (
                            <strong
                              className="font-semibold"
                              style={{ color: "var(--sl-color-white)" }}
                            >
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em style={{ color: "var(--sl-color-gray-2)" }}>
                              {children}
                            </em>
                          ),
                          img: ({ src, alt }) => (
                            <img
                              src={src}
                              alt={alt || ""}
                              className="rounded-lg my-3 max-w-full h-auto border"
                              style={{
                                borderColor: "var(--sl-color-gray-5)"
                              }}
                              loading="lazy"
                            />
                          )
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className="flex justify-start">
                <div className="rounded-lg p-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: "var(--sl-color-accent)",
                          animation: "pulse 1.5s ease-in-out infinite"
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: "var(--sl-color-accent)",
                          animation: "pulse 1.5s ease-in-out infinite 0.2s"
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: "var(--sl-color-accent)",
                          animation: "pulse 1.5s ease-in-out infinite 0.4s"
                        }}
                      />
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--sl-color-gray-3)" }}
                    >
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <style>
              {`
                @keyframes pulse {
                  0%, 100% {
                    opacity: 0.3;
                    transform: scale(0.8);
                  }
                  50% {
                    opacity: 1;
                    transform: scale(1.2);
                  }
                }
              `}
            </style>
            <div ref={messagesEndRef} />
          </div>

          <div
            className="p-4"
            style={{
              borderTop: "1px solid var(--sl-color-gray-5)"
            }}
          >
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI..."
                rows={1}
                className="w-full px-4 py-4 pr-12 rounded-lg text-sm outline-none focus:ring-2 transition-shadow resize-none overflow-hidden"
                style={{
                  backgroundColor: "var(--sl-color-gray-6)",
                  color: "var(--sl-color-white)",
                  border: "1px solid var(--sl-color-gray-5)",
                  outlineColor: "var(--sl-color-accent)",
                  maxHeight: "150px",
                  minHeight: "56px"
                }}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-4 bottom-4 w-9 h-9 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 hover:shadow-lg flex items-center justify-center group"
                style={{
                  backgroundColor:
                    input.trim() && !isLoading
                      ? "var(--sl-color-accent)"
                      : "var(--sl-color-gray-5)",
                  color:
                    input.trim() && !isLoading
                      ? "var(--sl-color-black)"
                      : "var(--sl-color-gray-3)"
                }}
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
