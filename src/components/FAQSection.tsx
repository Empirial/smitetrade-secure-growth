import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is SmiteTrade?",
    a: "SmiteTrade is a fintech platform that helps businesses manage stock and sales, customers order groceries easily, and drivers earn by delivering goods.",
  },
  {
    q: "Where is it available?",
    a: "Currently available in selected areas, with expansion coming soon.",
  },
  {
    q: "How do I order?",
    a: "Select items from your local shop or send your own grocery list — we'll handle the rest.",
  },
  {
    q: "How do I pay?",
    a: "Mobile payments, EFT, or cash — whichever works best for you.",
  },
  {
    q: "How long is delivery?",
    a: "Same-day or within a few hours, depending on your area.",
  },
  {
    q: "How does it help my shop?",
    a: "Track stock, manage sales, and reach more customers — all from one platform.",
  },
  {
    q: "Do I need technical skills?",
    a: "No. SmiteTrade is designed to be simple and easy to use for everyone.",
  },
  {
    q: "How do I earn as an owner?",
    a: "Through increased sales and customer orders placed directly through the platform.",
  },
  {
    q: "How do I join as a driver?",
    a: "Register with your personal details and vehicle information to get started.",
  },
  {
    q: "How do drivers get jobs?",
    a: "Orders are assigned based on your location — the closer you are, the more jobs you get.",
  },
  {
    q: "How do drivers get paid?",
    a: "You are paid per delivery directly through the platform.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-electric/5 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="text-gradient-blue">Questions.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass-card border border-border/50 rounded-xl px-6 data-[state=open]:border-emerald-500/40 transition-colors duration-200"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-emerald-400 hover:no-underline py-5 transition-colors duration-150">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
