import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpenCheck, BrainCircuit, Check, Eye, EyeOff, ShieldCheck, Sparkles, Target, Trophy } from 'lucide-react'
import { Badge, Button } from '../components/ui'
import { isDemoMode, supabase } from '../lib/supabase'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', dob: '' })
  const update = event => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async event => {
    event.preventDefault(); setLoading(true); setError('')
    if (isDemoMode) { setTimeout(() => { setLoading(false); navigate('/') }, 500); return }
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name, date_of_birth: form.dob } } })
      : await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    setLoading(false)
    if (result.error) setError(result.error.message)
    else navigate('/')
  }

  return <div className="grid min-h-screen bg-paper lg:grid-cols-[1.05fr_.95fr]">
    <section className="noise relative hidden overflow-hidden bg-ink p-14 text-white lg:flex lg:flex-col">
      <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-leaf-600"><Sparkles size={22}/></div><div><p className="font-display text-2xl font-extrabold">Tuition Class</p><p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/40">Learn with clarity</p></div></div>
      <div className="relative z-10 my-auto max-w-xl"><Badge className="bg-white/10 text-[#9ce6b5]">BUILT FOR SRI LANKAN O/L</Badge><h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.08] tracking-tight">Past papers, made personal.</h1><p className="mt-5 max-w-lg text-lg leading-8 text-white/55">Know your weak spots, practise with purpose, and walk into the exam room with confidence.</p><div className="mt-10 grid grid-cols-3 gap-3"><div className="rounded-3xl bg-white/[.06] p-5"><Target className="text-[#8de4ac]"/><p className="mt-4 text-sm font-bold">Smart practice</p></div><div className="rounded-3xl bg-white/[.06] p-5"><BrainCircuit className="text-sky-300"/><p className="mt-4 text-sm font-bold">Clear feedback</p></div><div className="rounded-3xl bg-white/[.06] p-5"><Trophy className="text-sun"/><p className="mt-4 text-sm font-bold">Visible growth</p></div></div></div>
      <div className="dot-grid absolute -bottom-20 -right-16 h-96 w-96 rounded-full opacity-20"/>
      <p className="relative text-xs text-white/30">English medium · Mathematics & Science</p>
    </section>
    <section className="flex items-center justify-center p-5 sm:p-10"><div className="w-full max-w-md"><div className="mb-10 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-leaf-600 text-white"><Sparkles size={20}/></div><p className="font-display text-2xl font-extrabold">Tuition Class</p></div><Badge>{mode === 'signin' ? 'WELCOME BACK' : 'START YOUR JOURNEY'}</Badge><h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight">{mode === 'signin' ? 'Ready for another win?' : 'Create your learning space'}</h2><p className="mt-2 text-sm text-slate-500">{mode === 'signin' ? 'Sign in and pick up where you left off.' : 'A few details, then your practice plan is ready.'}</p>
      <div className="mt-7 grid grid-cols-2 rounded-2xl bg-slate-100 p-1"><button onClick={()=>setMode('signin')} className={`rounded-xl py-2.5 text-sm font-bold ${mode==='signin'?'bg-white text-ink shadow-sm':'text-slate-400'}`}>Sign in</button><button onClick={()=>setMode('signup')} className={`rounded-xl py-2.5 text-sm font-bold ${mode==='signup'?'bg-white text-ink shadow-sm':'text-slate-400'}`}>Create account</button></div>
      <form className="mt-6 space-y-4" onSubmit={submit}>{mode === 'signup' && <><label className="block text-sm font-bold">Full name<input required name="name" value={form.name} onChange={update} className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-white px-4 outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10" placeholder="How should we call you?"/></label><label className="block text-sm font-bold">Date of birth<input required type="date" name="dob" value={form.dob} onChange={update} className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-white px-4 outline-none focus:border-leaf-500"/></label></>}<label className="block text-sm font-bold">Email address<input required type="email" name="email" value={form.email} onChange={update} className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-white px-4 outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10" placeholder="you@example.com"/></label><label className="block text-sm font-bold">Password<div className="relative mt-2"><input required minLength="8" type={showPassword?'text':'password'} name="password" value={form.password} onChange={update} className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 pr-12 outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10" placeholder="At least 8 characters"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400">{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>{error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}<Button className="w-full" size="lg" disabled={loading}>{loading ? 'Opening your space…' : mode==='signin' ? 'Sign in' : 'Create my account'}<ArrowRight size={17}/></Button></form>
      {isDemoMode && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-sky-600"/><p className="text-xs leading-5 text-sky-800"><strong>Demo mode is active.</strong> Enter any valid-looking email and an 8-character password to explore. Connect Supabase to enable real accounts.</p></div>}
      {mode==='signup' && <p className="mt-5 text-center text-xs leading-5 text-slate-400">By continuing, you agree to the platform rules and privacy policy. We store only your name, email, and date of birth.</p>}
    </div></section>
  </div>
}
