import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LifeBuoy, Building2 } from "lucide-react";

interface SupportFormProps {
  role: "owner" | "cashier" | "customer" | "driver" | "lender";
  target: "admin" | "owner";
  storeName?: string;
}

const SupportForm = ({ role, target, storeName }: SupportFormProps) => {
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType) {
      toast.error("Please select an issue type.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubject("");
      setIssueType("");
      setDescription("");
      setReference("");
      toast.success("Support ticket submitted successfully. We'll get back to you shortly.");
    }, 1500);
  };

  const isEmployerTarget = target === "owner";
  const heading = isEmployerTarget ? "Contact Your Store Owner" : "Contact SmiteTrade Support";
  const subheading = isEmployerTarget
    ? `Send a message to your employer${storeName ? ` at ${storeName}` : ""} about any issues, updates, or suggestions.`
    : "Report an issue, request an update, or share a suggestion with the SmiteTrade team.";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          {isEmployerTarget ? <Building2 className="h-6 w-6" /> : <LifeBuoy className="h-6 w-6" />}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        <p className="text-muted-foreground">{subheading}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEmployerTarget ? "Message Your Employer" : "Submit a Ticket"}</CardTitle>
          <CardDescription>Fill out the form below and we'll get back to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief summary of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={issueType} onValueChange={setIssueType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug / Issue</SelectItem>
                  <SelectItem value="update">Update Request</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number (Optional)</Label>
              <Input
                id="reference"
                placeholder="#12345"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please describe your issue in detail..."
                className="min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportForm;
