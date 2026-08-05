import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Award, BarChart3, Bell, BookOpen, BrainCircuit, ChevronDown, Flame, Gauge,
  HelpCircle, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Sparkles,
  Swords, Target, X,
} from 'lucide-react'
import { Avatar, Badge, Button } from './components/ui'
import { student } from './data/demo'
import { supabase } from './lib/supabase'
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Practice = lazy(() => import('./pages/Practice'))
const Assessment = lazy(() => import('./pages/Assessment'))
const ProgressPage = lazy(() => import('./pages/Progress'))
const Learn = lazy(() => import('./pages/Learn'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const Admin = lazy(() => import('./pages/Admin'))
const Auth = lazy(() => import('./pages/Auth'))

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/practice', label: 'Practice', icon: Target },
  { to: '/progress', label: 'My progress', icon: BarChart3 },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/leaderboard', label: 'Leaderboard', icon: Award },
]

function Logo() {
  return <div className="flex items-center gap-3">
    <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-leaf-600 text-white shadow-lift">
      <Sparkles size={21} strokeWidth={2.4} />
      <span className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-sun" />
    </div>
    <div><p className="font-display text-xl font-extrabold leading-none tracking-tight">pahas</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Learn with clarity</p></div>
  </div>
}

function Sidebar({ open, setOpen }) {
  return <>
    {open && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-black/[0.06] bg-[#fbfcf8] p-5 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between px-2 py-3"><Logo /><button className="rounded-xl p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(false)}><X size={20} /></button></div>
      <div className="mt-7 rounded-3xl bg-ink p-4 text-white">
        <div className="flex items-center justify-between"><span className="text-xs font-bold text-white/60">LEVEL {student.level}</span><Badge className="bg-white/10 text-sun">{student.points.toLocaleString()} XP</Badge></div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-sun" /></div>
        <p className="mt-2 text-xs text-white/50">160 XP until Level 8</p>
      </div>
      <nav className="mt-6 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'bg-leaf-100 text-leaf-700' : 'text-slate-500 hover:bg-black/[.035] hover:text-ink'}`}><Icon size={19} />{label}</NavLink>)}
      </nav>
      <div className="mt-auto space-y-1 border-t border-black/[.06] pt-4">
        <NavLink to="/admin" onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-slate-200 text-ink' : 'text-slate-500 hover:bg-black/[.035]'}`}><ShieldCheck size={19} />Admin demo</NavLink>
        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-black/[.035]"><Settings size={19} />Settings</button>
        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-black/[.035]"><HelpCircle size={19} />Help centre</button>
      </div>
    </aside>
  </>
}

function Header({ setOpen }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const titles = { '/': 'Overview', '/practice': 'Practice', '/progress': 'My progress', '/learn': 'Learning library', '/leaderboard': 'Leaderboard', '/admin': 'Admin workspace' }
  return <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-black/[.05] bg-paper/90 px-4 backdrop-blur-xl sm:px-8 lg:px-10">
    <div className="flex items-center gap-3"><button className="rounded-xl p-2 hover:bg-white lg:hidden" onClick={() => setOpen(true)}><Menu size={21} /></button><h1 className="font-display text-lg font-bold">{location.pathname.startsWith('/assessment') ? 'Quick practice' : titles[location.pathname] || 'Pahas'}</h1></div>
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="hidden items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-sm font-bold text-orange-600 sm:flex"><Flame size={18} fill="currentColor" />{student.streak} day streak</div>
      <button className="relative rounded-full border border-black/[.07] bg-white p-2.5 text-slate-500 hover:text-ink"><Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral ring-2 ring-white" /></button>
      <div className="relative">
        <button className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-white" onClick={() => setProfileOpen(!profileOpen)}><Avatar initials={student.initials} /><div className="hidden text-left md:block"><p className="text-sm font-bold leading-tight">{student.name}</p><p className="text-[11px] text-slate-400">Student</p></div><ChevronDown size={15} className="hidden text-slate-400 md:block" /></button>
        {profileOpen && <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-black/[.07] bg-white p-2 shadow-soft"><button className="flex w-full items-center gap-2 rounded-xl p-3 text-sm font-medium hover:bg-slate-50"><Settings size={16} />Account settings</button><button onClick={async () => { if (supabase) await supabase.auth.signOut(); navigate('/login') }} className="flex w-full items-center gap-2 rounded-xl p-3 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut size={16} />Sign out</button></div>}
      </div>
    </div>
  </header>
}

function WelcomeModal({ onClose }) {
  const navigate = useNavigate()
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
    <div className="noise relative w-full max-w-lg overflow-hidden rounded-4xl bg-white p-7 shadow-2xl sm:p-9">
      <button className="absolute right-5 top-5 rounded-full bg-slate-100 p-2" onClick={onClose}><X size={18} /></button>
      <div className="float mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-leaf-100 text-leaf-700"><BrainCircuit size={48} /></div>
      <div className="mt-6 text-center"><Badge>YOUR STUDY SPACE IS READY</Badge><h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight">Ayubowan, {student.name}! 👋</h2><p className="mx-auto mt-3 max-w-sm text-slate-500">Let’s turn past-paper practice into steady progress, one clear step at a time.</p></div>
      <div className="mt-7 grid grid-cols-3 gap-2 text-center"><div className="rounded-2xl bg-slate-50 p-3"><Target className="mx-auto text-leaf-600" size={20}/><p className="mt-2 text-xs font-bold">Smart practice</p></div><div className="rounded-2xl bg-slate-50 p-3"><Gauge className="mx-auto text-sky-600" size={20}/><p className="mt-2 text-xs font-bold">Track mastery</p></div><div className="rounded-2xl bg-slate-50 p-3"><Swords className="mx-auto text-coral" size={20}/><p className="mt-2 text-xs font-bold">Earn XP</p></div></div>
      <Button className="mt-7 w-full" size="lg" onClick={() => { onClose(); navigate('/practice') }}>Start practising <Target size={18} /></Button>
      <button className="mt-3 w-full py-2 text-sm font-semibold text-slate-400" onClick={onClose}>Explore my dashboard</button>
    </div>
  </div>
}

export default function App() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authReady, setAuthReady] = useState(!supabase)
  const [session, setSession] = useState(null)
  const [welcome, setWelcome] = useState(() => sessionStorage.getItem('pahas-welcomed') !== 'yes')
  const closeWelcome = () => { sessionStorage.setItem('pahas-welcomed', 'yes'); setWelcome(false) }
  useEffect(() => window.scrollTo(0, 0), [])
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true) })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); setAuthReady(true) })
    return () => data.subscription.unsubscribe()
  }, [])
  if (!authReady) return <div className="grid min-h-screen place-items-center bg-paper text-sm font-bold text-slate-400">Checking your session…</div>
  if (supabase && !session && location.pathname !== '/login') return <Navigate to="/login" replace />
  if (supabase && session && location.pathname === '/login') return <Navigate to="/" replace />
  if (location.pathname === '/login') return <Suspense fallback={<div className="grid min-h-screen place-items-center bg-paper text-sm font-bold text-slate-400">Opening Pahas…</div>}><Auth /></Suspense>
  return <div className="min-h-screen bg-paper">
    <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
    <div className="lg:pl-[268px]"><Header setOpen={setSidebarOpen} /><main className="mx-auto max-w-[1500px] p-4 sm:p-8 lg:p-10"><Suspense fallback={<div className="grid min-h-[60vh] place-items-center"><div className="flex items-center gap-3 text-sm font-bold text-slate-400"><span className="h-5 w-5 animate-spin rounded-full border-2 border-leaf-500 border-t-transparent"/>Opening your study space…</div></div>}><Routes><Route path="/" element={<Dashboard />} /><Route path="/practice" element={<Practice />} /><Route path="/assessment/:id" element={<Assessment />} /><Route path="/progress" element={<ProgressPage />} /><Route path="/learn" element={<Learn />} /><Route path="/leaderboard" element={<Leaderboard />} /><Route path="/admin" element={<Admin />} /></Routes></Suspense></main></div>
    {welcome && <WelcomeModal onClose={closeWelcome} />}
  </div>
}
