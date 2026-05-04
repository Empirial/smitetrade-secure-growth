import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/context/StoreContext";
import { useCredit } from "@/context/CreditContext";
import { sendChatMessage, ChatMessage } from "@/lib/claude";
import { PAGE_CONTEXTS } from "@/lib/pageContexts";
import { motion, AnimatePresence } from "framer-motion";

export type ChatBotRole = "owner" | "customer" | "cashier" | "driver" | "lender" | "admin";

interface ChatBotProps {
  role: ChatBotRole;
}

// ─── System prompt builders ────────────────────────────────────────────────

function buildOwnerPrompt(data: {
  storeName: string; userName: string; productCount: number;
  pendingOrders: number; completedRevenue: number; staffCount: number;
  lowStockItems: string[];
}): string {
  return `You are an AI business assistant for ${data.userName}, owner of "${data.storeName}" on SmiteTrade — a South African informal retail platform.

Store snapshot:
- Products: ${data.productCount}
- Pending orders: ${data.pendingOrders}
- Total completed revenue: R${data.completedRevenue.toFixed(2)}
- Staff members: ${data.staffCount}
- Low stock (< 5 units): ${data.lowStockItems.length > 0 ? data.lowStockItems.join(', ') : 'none'}

Help with: sales analysis, inventory advice, pricing strategy, staff tips, understanding reports, and business questions.
Be concise and practical. Use Rand (R) for currency. Context is a South African spaza shop / informal retail environment.`;
}

function buildCustomerPrompt(data: {
  userName: string; orderCount: number; pendingOrders: number; categories: string[];
}): string {
  return `You are a friendly customer support assistant on SmiteTrade — a South African informal retail platform.

Customer: ${data.userName}
Orders: ${data.orderCount} total, ${data.pendingOrders} pending
Available product categories: ${data.categories.join(', ')}

Help with: order tracking, product questions, delivery status, credit/loan applications, account issues.
Be concise and friendly. Use Rand (R) for currency.`;
}

function buildCashierPrompt(data: {
  userName: string; storeName: string; pendingOrders: number;
  totalProductsSold: number; shiftActive: boolean; todaySales: number;
}): string {
  return `You are an AI assistant for ${data.userName}, a cashier at "${data.storeName}" on SmiteTrade.

Current shift snapshot:
- Shift active: ${data.shiftActive ? 'Yes' : 'No'}
- Pending orders in queue: ${data.pendingOrders}
- Today's completed sales: R${data.todaySales.toFixed(2)}
- Total products processed: ${data.totalProductsSold}

Help with: processing orders, handling payments, shift management, checking stock, resolving customer issues at the till.
Be concise and practical. Use Rand (R) for currency. South African retail context.`;
}

function buildDriverPrompt(data: {
  userName: string; activeDeliveries: number; completedDeliveries: number;
  pendingDeliveries: number;
}): string {
  return `You are an AI assistant for ${data.userName}, a delivery driver on SmiteTrade — a South African informal retail platform.

Delivery snapshot:
- Active (out for delivery): ${data.activeDeliveries}
- Pending (not yet picked up): ${data.pendingDeliveries}
- Completed today: ${data.completedDeliveries}

Help with: delivery status, order details, reporting delivery issues, navigating the app, wallet and earnings questions.
Be concise and practical. South African context.`;
}

function buildLenderPrompt(data: {
  userName: string; borrowerCount: number; activeLoanCount: number;
  overdueCount: number; pendingApplications: number; totalOutstanding: number;
}): string {
  return `You are an AI lending assistant for ${data.userName} on SmiteTrade — a South African P2P micro-lending platform.

Portfolio snapshot:
- Borrowers: ${data.borrowerCount}
- Active loans: ${data.activeLoanCount}
- Overdue loans: ${data.overdueCount}
- Pending applications: ${data.pendingApplications}
- Total outstanding: R${data.totalOutstanding.toFixed(2)}

Help with: loan management, borrower assessment, collections strategy, BRI credit scoring, application review, and risk management.
Be concise and practical. Use Rand (R) for currency. South African micro-lending context.`;
}

function buildAdminPrompt(data: {
  userName: string; totalStores: number; totalOrders: number;
  pendingOrders: number; totalRevenue: number; totalStaff: number;
}): string {
  return `You are an AI platform assistant for ${data.userName}, an admin on SmiteTrade — a South African multi-tenant retail SaaS platform.

Platform snapshot:
- Stores on platform: ${data.totalStores}
- Total orders: ${data.totalOrders} (${data.pendingOrders} pending)
- Platform revenue processed: R${data.totalRevenue.toFixed(2)}
- Total staff across stores: ${data.totalStaff}

Help with: platform analytics, store management, user issues, audit logs, dispute resolution, supplier oversight, and system health.
Be concise and data-driven. Use Rand (R) for currency. South African informal retail SaaS context.`;
}

// ─── Role config ───────────────────────────────────────────────────────────

const roleConfig: Record<ChatBotRole, { label: string; greeting: (name: string) => string }> = {
  owner:    { label: "Business Assistant",  greeting: n => `Hi ${n}! Ask me about sales, inventory, staff, or running your store.` },
  customer: { label: "Customer Support",    greeting: n => `Hi ${n}! I can help with orders, products, delivery, or your account.` },
  cashier:  { label: "Cashier Assistant",   greeting: n => `Hi ${n}! Ask me about orders in queue, shift management, or processing payments.` },
  driver:   { label: "Driver Assistant",    greeting: n => `Hi ${n}! Ask me about your deliveries, earnings, or how to report issues.` },
  lender:   { label: "Lending Assistant",   greeting: n => `Hi ${n}! Ask me about your loan portfolio, borrower risk, or pending applications.` },
  admin:    { label: "Platform Assistant",  greeting: n => `Hi ${n}! Ask me about platform analytics, stores, disputes, or system health.` },
};

// ─── Component ─────────────────────────────────────────────────────────────

export function ChatBot({ role }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const { user, products, orders, currentStore, staff, stores } = useStore();
  const { borrowers, loans, applications } = useCredit();

  // Look up page context for the current route (exact match, then strip trailing segments for dynamic routes)
  const currentPageContext = (() => {
    const path = location.pathname;
    if (PAGE_CONTEXTS[path]) return PAGE_CONTEXTS[path];
    // Handle dynamic routes like /customer/orders/abc123
    const parent = path.split('/').slice(0, 3).join('/');
    return PAGE_CONTEXTS[`${parent}/:id`] || "";
  })();

  const firstName = user?.name?.split(' ')[0] || 'there';
  const config = roleConfig[role];
  const greeting = config.greeting(firstName);

  // ── Build system prompt per role ──
  const systemPrompt = (() => {
    const today = new Date().toDateString();
    switch (role) {
      case "owner":
        return buildOwnerPrompt({
          storeName: currentStore?.name || "your store",
          userName: user?.name || "Owner",
          productCount: products.length,
          pendingOrders: orders.filter(o => o.status === "Pending").length,
          completedRevenue: orders.filter(o => o.status === "Delivered").reduce((s, o) => s + (o.total ?? 0), 0),
          staffCount: staff?.length ?? 0,
          lowStockItems: products.filter(p => (p.stock ?? 0) < 5).map(p => p.name),
        });

      case "customer":
        return buildCustomerPrompt({
          userName: user?.name || "Customer",
          orderCount: orders.length,
          pendingOrders: orders.filter(o => o.status === "Pending").length,
          categories: [...new Set(products.map(p => (p as any).category || 'General'))].slice(0, 6) as string[],
        });

      case "cashier": {
        const todayOrders = orders.filter(o => {
          const d = (o as any).createdAt?.toDate?.() || new Date((o as any).createdAt);
          return d.toDateString() === today;
        });
        return buildCashierPrompt({
          userName: user?.name || "Cashier",
          storeName: currentStore?.name || "your store",
          pendingOrders: orders.filter(o => o.status === "Pending").length,
          totalProductsSold: todayOrders.filter(o => o.status === "Delivered").reduce((s, o) => s + ((o as any).items?.length ?? 0), 0),
          shiftActive: !!(staff as any)?.currentShift,
          todaySales: todayOrders.filter(o => o.status === "Delivered").reduce((s, o) => s + (o.total ?? 0), 0),
        });
      }

      case "driver": {
        const myOrders = orders.filter(o => (o as any).driverId === user?.uid || (o as any).assignedDriver === user?.uid);
        return buildDriverPrompt({
          userName: user?.name || "Driver",
          activeDeliveries: myOrders.filter(o => o.status === "Out for Delivery").length,
          pendingDeliveries: myOrders.filter(o => o.status === "Pending" || o.status === "Ready").length,
          completedDeliveries: myOrders.filter(o => o.status === "Delivered").length,
        });
      }

      case "lender":
        return buildLenderPrompt({
          userName: user?.name || "Lender",
          borrowerCount: borrowers.length,
          activeLoanCount: loans.filter(l => l.status === "active").length,
          overdueCount: loans.filter(l => l.status === "overdue").length,
          pendingApplications: applications.filter(a => a.status === "pending").length,
          totalOutstanding: loans.filter(l => l.status === "active").reduce((s, l) => s + ((l as any).amount ?? 0), 0),
        });

      case "admin":
        return buildAdminPrompt({
          userName: user?.name || "Admin",
          totalStores: (stores as any)?.length ?? 0,
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === "Pending").length,
          totalRevenue: orders.filter(o => o.status === "Delivered").reduce((s, o) => s + (o.total ?? 0), 0),
          totalStaff: staff?.length ?? 0,
        });
    }
  })() + (currentPageContext ? `\n\nCurrent page context:\n${currentPageContext}` : "");

  // Customer portal: stack above the cart bubble (56px + 24px bottom + 16px gap = 96px)
  const fabBottom = role === "customer" ? 96 : 24;
  const panelBottom = fabBottom + 64;

  // Reset chat when navigating to a new page so context is always fresh
  useEffect(() => {
    setMessages([]);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: greeting }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = updated.filter(m => m.content !== greeting);
      const reply = await sendChatMessage(apiMessages, systemPrompt);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `Sorry, I ran into an issue. ${err.message || "Please try again."}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{ bottom: fabBottom, right: 24 }}
        className="fixed z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center"
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isOpen ? "x" : "msg"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{ bottom: panelBottom, right: 24 }}
            className="fixed z-40 w-80 h-[420px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-primary text-primary-foreground shrink-0">
              <Bot className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold leading-none">SmiteTrade AI</p>
                <p className="text-xs opacity-70 mt-0.5">{config.label}</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-3 py-3">
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm leading-snug ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Thinking…</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2 px-3 py-2.5 border-t border-border shrink-0">
              <Input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask anything…"
                className="h-8 text-sm"
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
