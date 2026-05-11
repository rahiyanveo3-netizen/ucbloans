import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Auth() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ phone: "", password: "", full_name: "" });

  if (!loading && user) return <Navigate to="/" replace />;

  const email = (phone: string) => `${phone.replace(/\D/g, "")}@ucbloan.app`;

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email(form.phone), password: form.password });
    setBusy(false);
    if (error) toast.error("লগইন ব্যর্থ: " + error.message);
    else nav("/");
  };

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email(form.phone),
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: form.full_name, phone: form.phone },
      },
    });
    setBusy(false);
    if (error) toast.error("রেজিস্ট্রেশন ব্যর্থ: " + error.message);
    else { toast.success("রেজিস্ট্রেশন সফল!"); nav("/"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/10 p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-6">
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-full bg-primary items-center justify-center text-2xl font-black text-primary-foreground mb-2">U</div>
          <h1 className="text-2xl font-bold">UCB LOAN</h1>
        </div>
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">লগইন</TabsTrigger>
            <TabsTrigger value="signup">রেজিস্ট্রেশন</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={login} className="space-y-4 mt-4">
              <div><Label>মোবাইল নাম্বার</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>পাসওয়ার্ড</Label><Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
              <Button disabled={busy} className="w-full" type="submit">লগইন</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={signup} className="space-y-4 mt-4">
              <div><Label>পূর্ণ নাম</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><Label>মোবাইল নাম্বার</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>পাসওয়ার্ড (৬+ অক্ষর)</Label><Input type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
              <Button disabled={busy} className="w-full" type="submit">রেজিস্ট্রেশন</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
