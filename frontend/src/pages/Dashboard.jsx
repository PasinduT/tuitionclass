import { useNavigate } from 'react-router-dom'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Clock3, Flame, Lightbulb, Play, Sparkles, Target, Trophy, Zap } from 'lucide-react'
import { Badge, Button, Card, Progress } from '../components/ui'
import { activity, mastery, student } from '../data/demo'

function Stat({ icon: Icon, label, value, note, tone }) {
  const colors = { green: 'bg-leaf-50 text-leaf-600', orange: 'bg-orange-50 text-orange-500', blue: 'bg-sky-50 text-sky-600', purple: 'bg-violet-50 text-violet-600' }
  return <Card className="flex items-center gap-4 p-5 shadow-none"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${colors[tone]}`}><Icon size={22} /></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><div className="mt-1 flex items-end gap-2"><p className="font-display text-2xl font-extrabold">{value}</p><span className="mb-1 text-xs font-bold text-leaf-600">{note}</span></div></div></Card>
}

function MasteryRow({ item }) {
  return <div className="group rounded-2xl p-3 transition-colors hover:bg-slate-50"><div className="flex items-center justify-between"><div><p className="text-sm font-bold">{item.topic}</p><p className="mt-0.5 text-xs text-slate-400">{item.subject}</p></div><div className="text-right"><p className="font-display text-lg font-extrabold">{item.score}%</p><p className={`text-[11px] font-bold ${item.delta >= 0 ? 'text-leaf-600' : 'text-coral'}`}>{item.delta >= 0 ? '+' : ''}{item.delta}% this week</p></div></div><Progress value={item.score} className="mt-3 h-2.5" indicatorClassName="bg-[var(--mastery)]" style={{ '--mastery': item.color }} /></div>
}

export default function Dashboard() {
  const navigate = useNavigate()
  return <div className="page-enter">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Badge className="mb-3"><Sparkles size={12} className="mr-1" /> WEDNESDAY, 5 AUGUST</Badge><h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Good afternoon, {student.name}.</h2><p className="mt-2 text-slate-500">A little practice today keeps the exam stress away.</p></div><Button variant="secondary" onClick={() => navigate('/progress')}>View full progress <ArrowRight size={17} /></Button></div>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={Zap} label="Total XP" value={student.points.toLocaleString()} note="+320" tone="green" />
      <Stat icon={Flame} label="Practice streak" value={`${student.streak} days`} note="Best: 18" tone="orange" />
      <Stat icon={CheckCircle2} label="Questions done" value="148" note="+31" tone="blue" />
      <Stat icon={Trophy} label="Global rank" value={`#${student.rank}`} note="↑ 4" tone="purple" />
    </div>

    <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.8fr]">
      <Card className="noise relative min-h-[345px] overflow-hidden border-0 bg-[#173f2a] p-7 text-white sm:p-9">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[44px] border-white/[.035]" /><div className="dot-grid absolute inset-y-0 right-0 w-[45%] opacity-30" />
        <div className="relative z-10 max-w-[64%] sm:max-w-[58%]"><Badge className="bg-white/10 text-[#9ce6b5]"><Target size={13} className="mr-1" /> RECOMMENDED FOR YOU</Badge><h3 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Strengthen your electricity basics</h3><p className="mt-4 text-sm leading-6 text-white/65">You lost marks on series circuits twice this week. A focused 10-minute set can turn that around.</p><div className="mt-7 flex flex-wrap gap-3"><Button className="bg-white text-ink shadow-none hover:bg-leaf-50" onClick={() => navigate('/assessment/electricity')}><Play size={17} fill="currentColor" /> Start 6 questions</Button><button className="px-3 text-sm font-bold text-white/70 hover:text-white" onClick={() => navigate('/learn')}>Review lesson</button></div></div>
        <div className="absolute -bottom-7 right-3 sm:right-12"><div className="float relative grid h-40 w-40 place-items-center rounded-full bg-[#dff3d6] shadow-2xl sm:h-52 sm:w-52"><span className="text-6xl sm:text-7xl">⚡</span><div className="absolute -left-4 top-5 rounded-2xl bg-sun px-3 py-2 text-xs font-extrabold text-ink shadow-lg">+90 XP</div><div className="absolute right-0 top-0 h-7 w-7 rounded-full bg-coral" /></div></div>
      </Card>

      <Card className="p-6"><div className="flex items-center justify-between"><div><h3 className="font-display text-lg font-extrabold">Topic mastery</h3><p className="mt-1 text-sm text-slate-400">Based on your last 30 days</p></div><button onClick={() => navigate('/progress')} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-ink"><ChevronRight size={20} /></button></div><div className="mt-4 space-y-1">{mastery.map(item => <MasteryRow key={item.topic} item={item} />)}</div></Card>
    </div>

    <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.7fr_.55fr]">
      <Card className="p-6"><div className="flex items-start justify-between"><div><h3 className="font-display text-lg font-extrabold">Your learning rhythm</h3><p className="mt-1 text-sm text-slate-400">Accuracy across this week</p></div><Badge tone="green">+12% vs last week</Badge></div><div className="mt-5 h-44"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activity} margin={{ left: -20, right: 0 }}><defs><linearGradient id="score" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2fa866" stopOpacity={.25}/><stop offset="100%" stopColor="#2fa866" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} /><Tooltip contentStyle={{ border: 0, borderRadius: 14, boxShadow: '0 10px 30px #0002' }} formatter={v => [`${v}%`, 'Accuracy']} /><Area type="monotone" dataKey="score" stroke="#2fa866" strokeWidth={3} fill="url(#score)" /></AreaChart></ResponsiveContainer></div></Card>

      <Card className="p-6"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-600"><Lightbulb size={21} /></div><div><h3 className="font-display text-lg font-extrabold">Today’s plan</h3><p className="text-xs text-slate-400">About 28 minutes</p></div></div><div className="mt-5 space-y-3"><button onClick={() => navigate('/assessment/daily')} className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left hover:bg-leaf-50"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white font-bold text-leaf-600">1</span><span className="flex-1"><span className="block text-sm font-bold">Daily warm-up</span><span className="text-xs text-slate-400">5 mixed questions</span></span><Clock3 size={15} className="text-slate-400" /></button><button onClick={() => navigate('/learn')} className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left hover:bg-sky-50"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white font-bold text-sky-600">2</span><span className="flex-1"><span className="block text-sm font-bold">Motion graphs</span><span className="text-xs text-slate-400">Quick lesson</span></span><BookOpen size={15} className="text-slate-400" /></button></div></Card>

      <Card className="flex flex-col items-center justify-center overflow-hidden bg-[#fff8e8] p-6 text-center"><div className="grid h-20 w-20 place-items-center rounded-full bg-sun/40 text-4xl">🏅</div><p className="mt-4 text-xs font-bold uppercase tracking-widest text-amber-700">Almost there</p><h3 className="mt-1 font-display text-lg font-extrabold">Algebra ace</h3><p className="mt-2 text-xs leading-5 text-slate-500">Answer 7 more Algebra questions correctly.</p><Progress value={72} className="mt-4 w-full bg-amber-100" indicatorClassName="bg-amber-500" /></Card>
    </div>
  </div>
}
