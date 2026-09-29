import { useMemo, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness, CalendarDays, Check, ChevronDown,
  CircleDollarSign, Clock3, CloudUpload, Command, FileText, FolderOpen, HelpCircle, Home,
  Inbox, LayoutGrid, LockKeyhole, Mail, Menu, MoreHorizontal, Plus, Search,
  Settings, ShieldCheck, Sparkles, Users, X,
} from 'lucide-react'

const STORAGE_KEY = 'client-operations-hub-profile'

const exampleProjects = [
  { id: 1, name: 'Lumen Studio Rebrand', client: 'Lumen Studio', type: 'Brand strategy', status: 'In progress', due: 'Oct 24', initials: 'LS', color: 'violet', progress: 68, value: '$8,400' },
  { id: 2, name: 'Briarwood Website', client: 'Briarwood & Co.', type: 'Web development', status: 'Needs review', due: 'Oct 28', initials: 'BC', color: 'mint', progress: 84, value: '$12,800' },
  { id: 3, name: 'Northstar Photo Session', client: 'Northstar Homes', type: 'Photography', status: 'Scheduled', due: 'Nov 02', initials: 'NH', color: 'peach', progress: 22, value: '$2,200' },
  { id: 4, name: 'Atlas Q4 Campaign', client: 'Atlas Coffee', type: 'Marketing retainer', status: 'In progress', due: 'Nov 08', initials: 'AC', color: 'blue', progress: 51, value: '$5,750' },
]

const exampleActivities = [
  { icon: Check, tone: 'green', title: 'Quote approved', detail: 'Lumen Studio approved the Brand Strategy quote', time: '18 min ago' },
  { icon: CloudUpload, tone: 'blue', title: 'New document uploaded', detail: 'Briarwood & Co. uploaded “Content inventory.pdf”', time: '2 hrs ago' },
  { icon: Mail, tone: 'purple', title: 'Message sent', detail: 'You sent a follow-up to Northstar Homes', time: 'Yesterday' },
  { icon: CircleDollarSign, tone: 'orange', title: 'Payment received', detail: 'Invoice #1048 was paid by Atlas Coffee', time: 'Yesterday' },
]

const exampleAgenda = [
  { time: '09:30', ampm: 'AM', title: 'Project kickoff', person: 'Lumen Studio', color: 'violet' },
  { time: '01:00', ampm: 'PM', title: 'Review call', person: 'Briarwood & Co.', color: 'mint' },
  { time: '03:30', ampm: 'PM', title: 'Discovery session', person: 'Atlas Coffee', color: 'peach' },
]

const exampleTasksByProject = {
  1: [
    { id: '1-1', title: 'Finalize brand positioning', status: 'done', due: 'Oct 17', owner: 'Alex' },
    { id: '1-2', title: 'Share visual direction', status: 'done', due: 'Oct 19', owner: 'Alex' },
    { id: '1-3', title: 'Review logo explorations', status: 'current', due: 'Oct 21', owner: 'Jamie' },
    { id: '1-4', title: 'Prepare brand system handoff', status: 'todo', due: 'Oct 24', owner: 'Alex' },
  ],
  2: [
    { id: '2-1', title: 'Content inventory review', status: 'done', due: 'Oct 18', owner: 'Alex' },
    { id: '2-2', title: 'Approve homepage direction', status: 'current', due: 'Oct 22', owner: 'Morgan' },
    { id: '2-3', title: 'Publish staging link', status: 'todo', due: 'Oct 25', owner: 'Alex' },
  ],
  3: [
    { id: '3-1', title: 'Confirm shot list', status: 'done', due: 'Oct 18', owner: 'Alex' },
    { id: '3-2', title: 'Send location details', status: 'current', due: 'Oct 28', owner: 'Alex' },
    { id: '3-3', title: 'Photography session', status: 'todo', due: 'Nov 02', owner: 'Alex' },
  ],
  4: [
    { id: '4-1', title: 'Review Q4 brief', status: 'done', due: 'Oct 16', owner: 'Alex' },
    { id: '4-2', title: 'Draft campaign concepts', status: 'current', due: 'Oct 23', owner: 'Alex' },
    { id: '4-3', title: 'Schedule launch assets', status: 'todo', due: 'Nov 01', owner: 'Alex' },
  ],
}

const publicNavItems = [
  { label: 'Home', icon: Home },
  { label: 'Detailed Overview Example', icon: LayoutGrid },
]

const memberNavItems = [
  { label: 'Overview', icon: Home },
  { label: 'Projects', icon: BriefcaseBusiness },
  { label: 'Clients', icon: Users },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Invoices', icon: CircleDollarSign },
  { label: 'Documents', icon: FolderOpen },
  { label: 'Portal', icon: ShieldCheck },
]

function readStoredProfile() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

function App() {
  const [account, setAccount] = useState(readStoredProfile)
  const [activeView, setActiveView] = useState(() => readStoredProfile() ? 'Overview' : 'Home')
  const [projects, setProjects] = useState([])
  const [tasksByProject, setTasksByProject] = useState({})
  const [selectedProject, setSelectedProject] = useState(null)
  const [projectReturnView, setProjectReturnView] = useState('Projects')
  const [query, setQuery] = useState('')
  const [authMode, setAuthMode] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const [mobileNav, setMobileNav] = useState(false)

  const signedIn = Boolean(account)
  const visibleNavItems = signedIn ? memberNavItems : publicNavItems
  const filteredProjects = useMemo(() => projects.filter((project) => `${project.name} ${project.client} ${project.type}`.toLowerCase().includes(query.toLowerCase())), [projects, query])

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  function createAccount(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const profile = {
      fullName: form.get('fullName')?.toString().trim(),
      businessName: form.get('businessName')?.toString().trim(),
      email: form.get('email')?.toString().trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    }
    if (!profile.fullName || !profile.businessName || !profile.email) return
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)) } catch { notify('Account created for this session') }
    setAccount(profile)
    setTasksByProject({})
    setActiveView('Overview')
    setAuthMode(null)
    notify('Your empty workspace is ready')
  }

  function signOut() {
    try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* Storage can be disabled by the browser. */ }
    setAccount(null)
    setProjects([])
    setTasksByProject({})
    setSelectedProject(null)
    setActiveView('Home')
    notify('You have been signed out')
  }

  function addProject(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = form.get('name')?.toString().trim()
    const client = form.get('client')?.toString().trim()
    if (!name || !client) return
    setProjects((current) => [{ id: Date.now(), name, client, type: 'New project', status: 'Planning', due: 'TBD', initials: client.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase(), color: 'blue', progress: 0 }, ...current])
    setShowModal(false)
    notify('Project added to your workspace')
  }

  function navigate(label) {
    setActiveView(label)
    setMobileNav(false)
  }

  function openProject(project, returnView) {
    setSelectedProject(project)
    setProjectReturnView(returnView)
    if (returnView === 'Detailed Overview Example') setTasksByProject((current) => current[project.id] ? current : { ...current, [project.id]: exampleTasksByProject[project.id] || [] })
    setActiveView('Project Overview')
  }

  function toggleTask(projectId, taskId) {
    setTasksByProject((current) => ({
      ...current,
      [projectId]: (current[projectId] || []).map((task) => task.id === taskId ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task),
    }))
    notify('Task status updated')
  }

  function addTask(projectId, title) {
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    setTasksByProject((current) => ({
      ...current,
      [projectId]: [...(current[projectId] || []), { id: `${projectId}-${Date.now()}`, title: cleanTitle, status: 'todo', due: 'TBD', owner: account?.fullName?.split(' ')[0] || 'You' }],
    }))
    notify('Task added to project')
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'is-open' : ''}`}>
      <div className="brand-lockup"><div className="brand-mark"><Sparkles size={16} strokeWidth={2.5} /></div><span>client<span>ops</span></span></div>
      {signedIn ? <button className="workspace-switcher"><span className="workspace-dot">{account.businessName[0]}</span><span className="workspace-name">{account.businessName}</span><ChevronDown size={14} /></button> : <div className="visitor-badge"><LockKeyhole size={13} /><span>Visitor mode</span></div>}
      <nav className="primary-nav" aria-label="Primary navigation">
        <p className="nav-label">{signedIn ? 'Workspace' : 'Explore'}</p>
        {visibleNavItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeView === label ? 'active' : ''}`} onClick={() => navigate(label)}><Icon size={17} /><span>{label}</span>{signedIn && label === 'Projects' && projects.length > 0 && <small>{projects.length}</small>}</button>)}
        {signedIn && <><p className="nav-label nav-label-spaced">Manage</p><button className={`nav-item ${activeView === 'Inbox' ? 'active' : ''}`} onClick={() => navigate('Inbox')}><Inbox size={17} /><span>Inbox</span><small className="count-alert">0</small></button></>}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-item" onClick={() => notify('Help center opened')}><HelpCircle size={17} /><span>Help center</span></button>
        {signedIn && <><button className="nav-item" onClick={() => notify('Settings are coming soon')}><Settings size={17} /><span>Settings</span></button><div className="sidebar-divider" /><button className="user-row user-row-button" onClick={signOut}><div className="avatar avatar-user">{initialsFor(account.fullName)}</div><div><strong>{account.fullName}</strong><span>Sign out</span></div><MoreHorizontal size={17} /></button></>}
      </div>
    </aside>

    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={20} /></button><div className="breadcrumb"><span>{signedIn ? 'Workspace' : 'Client Operations Hub'}</span><span className="slash">/</span><strong>{activeView}</strong></div><div className="topbar-actions"><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={signedIn ? 'Search anything...' : 'Explore the product...'} /><kbd><Command size={11} /> K</kbd></label>{signedIn && <div className="notification-wrap"><button className="icon-button" onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications"><Bell size={18} /><i /></button>{showNotifications && <div className="notification-popover"><strong>Notifications</strong><p>Your new workspace has no unread updates yet.</p><button onClick={() => { setShowNotifications(false); notify('Notifications are all caught up') }}>Mark all as read</button></div>}</div>}{signedIn && <div className="avatar avatar-top">{initialsFor(account.fullName)}</div>}</div></header>
      <div className="content-wrap">{activeView === 'Home' ? <LandingPage onCreate={() => setAuthMode('create')} onExample={() => navigate('Detailed Overview Example')} hasAccount={signedIn} onContinue={() => navigate('Overview')} /> : activeView === 'Detailed Overview Example' ? <Overview isExample projects={exampleProjects} activities={exampleActivities} agenda={exampleAgenda} onAdd={() => setAuthMode('create')} onNotify={notify} onOpenProject={(project) => openProject(project, 'Detailed Overview Example')} onOpenPortal={() => signedIn ? navigate('Portal') : setAuthMode('create')} /> : activeView === 'Overview' ? <Overview account={account} projects={filteredProjects} activities={[]} agenda={[]} onAdd={() => setShowModal(true)} onNotify={notify} onOpenProject={(project) => openProject(project, 'Overview')} onOpenPortal={() => navigate('Portal')} /> : activeView === 'Project Overview' && selectedProject ? <ProjectOverview project={selectedProject} tasks={tasksByProject[selectedProject.id] || (selectedProject.id < 5 ? exampleTasksByProject[selectedProject.id] || [] : [])} isExample={projectReturnView === 'Detailed Overview Example'} onBack={() => navigate(projectReturnView)} onNotify={notify} onToggleTask={(taskId) => toggleTask(selectedProject.id, taskId)} onAddTask={(title) => addTask(selectedProject.id, title)} /> : activeView === 'Portal' ? <PortalView onNotify={notify} /> : <ViewPlaceholder view={activeView} projects={filteredProjects} onAdd={() => setShowModal(true)} onNotify={notify} onOpenProject={(project) => openProject(project, 'Projects')} />}</div>
    </main>

    {authMode && <AuthModal onClose={() => setAuthMode(null)} onSubmit={createAccount} />}
    {showModal && <ProjectModal onClose={() => setShowModal(false)} onSubmit={addProject} />}
    {toast && <div className="toast"><Check size={16} />{toast}</div>}
  </div>
}

function initialsFor(value = '') { return value.split(' ').filter(Boolean).map((word) => word[0]).join('').slice(0, 2).toUpperCase() || 'CO' }

function LandingPage({ onCreate, onExample, hasAccount, onContinue }) {
  return <section className="landing-page"><div className="landing-hero"><div className="landing-copy"><div className="landing-kicker"><span>✦</span> Operations software for service businesses</div><h1>Keep the work moving. Keep clients close.</h1><p>Client Operations Hub brings projects, clients, appointments, invoices, files, and communication into one calm workspace.</p><div className="landing-actions">{hasAccount ? <button className="button button-primary" onClick={onContinue}>Continue to workspace <ArrowRight size={15} /></button> : <button className="button button-primary" onClick={onCreate}>Create your free workspace <ArrowRight size={15} /></button>}<button className="button button-quiet" onClick={onExample}>See detailed example <ArrowUpRight size={14} /></button></div><div className="landing-note"><ShieldCheck size={14} /> Your workspace starts empty by design.</div></div><div className="landing-visual"><div className="visual-glow" /><div className="visual-window"><div className="visual-window-top"><span /><span /><span /><b>clientops</b></div><div className="visual-body"><div className="visual-side"><i /><i /><i /><i /><i /></div><div className="visual-main"><em /><strong /><div className="visual-metrics"><i /><i /><i /></div><div className="visual-rows"><i /><i /><i /></div></div></div></div></div></div><div className="landing-section-heading"><div><p className="eyebrow">Everything in one view</p><h2>Built for the way service businesses actually work.</h2></div><span>Start small. Grow into a full operations hub.</span></div><div className="feature-grid"><Feature icon={Users} title="Clients" text="Keep relationship context and next steps close to every engagement." tone="violet" /><Feature icon={BriefcaseBusiness} title="Projects" text="Turn every commitment into a clear, trackable plan of work." tone="blue" /><Feature icon={CircleDollarSign} title="Invoices" text="Make quotes, payments, and outstanding balances easier to see." tone="orange" /><Feature icon={ShieldCheck} title="Client portal" text="Give clients one place to review progress, files, approvals, and messages." tone="green" /></div></section>
}

function Feature({ icon: Icon, title, text, tone }) { return <article className="feature-card"><div className={`feature-icon ${tone}`}><Icon size={17} /></div><h3>{title}</h3><p>{text}</p><ArrowUpRight size={15} className="feature-arrow" /></article> }

function AuthModal({ onClose, onSubmit }) { return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal-card account-modal" onSubmit={onSubmit}><div className="modal-header"><div><span className="eyebrow">Start fresh</span><h2>Create your workspace</h2><p className="modal-description">Your first workspace starts clean — no sample clients, projects, or account data.</p></div><button type="button" className="close-button" onClick={onClose}><X size={18} /></button></div><label>Full name<input name="fullName" placeholder="e.g. Alex Wilson" autoFocus required /></label><label>Business name<input name="businessName" placeholder="e.g. Avery & Co." required /></label><label>Work email<input name="email" type="email" placeholder="you@business.com" required /></label><div className="demo-account-note"><LockKeyhole size={14} /><span>This prototype remembers your workspace on this browser. No password is stored.</span></div><div className="modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">Create workspace <ArrowUpRight size={15} /></button></div></form></div> }

function ProjectModal({ onClose, onSubmit }) { return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal-card" onSubmit={onSubmit}><div className="modal-header"><div><span className="eyebrow">Workspace</span><h2>Add a project</h2></div><button type="button" className="close-button" onClick={onClose}><X size={18} /></button></div><label>Project name<input name="name" placeholder="e.g. Summer campaign" autoFocus required /></label><label>Client name<input name="client" placeholder="e.g. Acme Studio" required /></label><div className="modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">Create project <ArrowUpRight size={15} /></button></div></form></div> }

function Overview({ isExample = false, account, projects = [], activities = [], agenda = [], onAdd, onNotify, onOpenProject, onOpenPortal }) {
  const metrics = isExample ? [{ label: 'Total revenue', value: '$28,450', change: '+12.8%', note: 'vs. last month', icon: CircleDollarSign, tone: 'violet', spark: 'revenue' }, { label: 'Active projects', value: '4', change: '+2', note: 'this month', icon: BriefcaseBusiness, tone: 'blue', spark: 'projects' }, { label: 'Outstanding', value: '$6,240', change: '-8.4%', note: 'vs. last month', icon: Clock3, tone: 'orange', spark: 'outstanding' }, { label: 'Client satisfaction', value: '96%', change: '+4.2%', note: 'vs. last month', icon: Users, tone: 'green', spark: 'satisfaction' }] : [{ label: 'Total revenue', value: '$0', change: '—', note: 'no invoices yet', icon: CircleDollarSign, tone: 'violet', spark: 'revenue' }, { label: 'Active projects', value: `${projects.length}`, change: 'Ready', note: 'workspace total', icon: BriefcaseBusiness, tone: 'blue', spark: 'projects' }, { label: 'Outstanding', value: '$0', change: '—', note: 'no invoices yet', icon: Clock3, tone: 'orange', spark: 'outstanding' }, { label: 'Client satisfaction', value: '—', change: 'Ready', note: 'after first project', icon: Users, tone: 'green', spark: 'satisfaction' }]
  return <><section className="welcome-row"><div><p className="eyebrow">{isExample ? 'Example workspace · Tuesday, October 15, 2024' : 'Your workspace · Getting started'}</p><h1>{isExample ? 'Good morning, Alex' : `Welcome, ${account?.fullName?.split(' ')[0] || 'there'}`} <span>✦</span></h1><p className="welcome-copy">{isExample ? 'Here’s what’s happening across your business today.' : 'Your workspace is ready for its first client and project.'}</p></div><button className="button button-primary" onClick={onAdd}><Plus size={16} /> {isExample ? 'Create your workspace' : 'New project'}</button></section><section className="metric-grid">{metrics.map((metric) => <Metric key={metric.label} {...metric} />)}</section><section className="dashboard-grid"><div className="panel projects-panel"><PanelHeading title={isExample ? 'Active projects' : 'Your projects'} action={isExample ? 'View all' : 'Add a project'} onClick={onAdd} />{projects.length ? <div className="project-list">{projects.map((project) => <ProjectRow key={project.id} project={project} onClick={() => onOpenProject(project)} />)}</div> : <EmptyState icon={BriefcaseBusiness} text="Your first project will appear here" action="Create a project" onClick={onAdd} />}</div><div className="panel agenda-panel"><PanelHeading title="Today’s agenda" action={isExample ? 'Open calendar' : 'Book appointment'} onClick={() => onNotify(isExample ? 'Calendar view opened' : 'Appointment flow opened')} />{agenda.length ? <><div className="agenda-date"><strong>Tue, Oct 15</strong><span>{agenda.length} appointments</span></div>{agenda.map((item) => <AgendaItem key={item.title} {...item} />)}</> : <EmptyState icon={CalendarDays} text="No appointments scheduled" action="Book your first appointment" onClick={() => onNotify('Appointment flow opened')} />}</div></section><section className="dashboard-grid lower-grid"><div className="panel activity-panel"><PanelHeading title="Recent activity" action={isExample ? 'See all activity' : 'Learn more'} onClick={() => onNotify(isExample ? 'Activity history opened' : 'Activity history will appear here')} />{activities.length ? <div className="activity-list">{activities.map((activity) => <ActivityItem key={activity.title} {...activity} />)}</div> : <EmptyState icon={Clock3} text="Activity will appear as work gets done" />}</div><div className="panel portal-panel"><div className="portal-orb"><ShieldCheck size={21} /></div><div className="portal-copy"><span className="eyebrow">Client portal</span><h3>{isExample ? 'Make every client feel in the loop.' : 'Your client portal is ready when you are.'}</h3><p>{isExample ? 'Share project updates, files, approvals, and invoices in one calm, branded space.' : 'Give clients a clear place to see project status, approve quotes, and share documents.'}</p><button className="text-button" onClick={onOpenPortal}>{isExample ? 'Preview portal' : 'See portal preview'} <ArrowUpRight size={14} /></button></div><div className="portal-graphic"><div className="mini-window"><div className="mini-window-top"><span /><span /><span /></div><div className="mini-content"><i /><b /><em /></div></div></div></div></section></>
}

function Metric({ label, value, change, note, icon: Icon, tone, spark }) { return <article className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={17} /></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-foot"><span className={change.startsWith('-') ? 'negative' : ''}>{change}</span><small>{note}</small></div><div className={`sparkline ${spark}`}><span /><span /><span /><span /><span /><span /><span /></div></article> }
function PanelHeading({ title, action, onClick }) { return <div className="panel-heading"><h2>{title}</h2><button className="panel-action" onClick={onClick}>{action} <ArrowUpRight size={13} /></button></div> }
function ProjectRow({ project, onClick }) { return <button className="project-row" onClick={onClick}><div className={`avatar project-avatar ${project.color}`}>{project.initials}</div><div className="project-info"><strong>{project.name}</strong><span>{project.client} <i>·</i> {project.type}</span></div><div className="progress-wrap"><div className="progress-meta"><small>{project.progress}%</small><small>{project.status}</small></div><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div></div><div className="project-due"><small>Due</small><strong>{project.due}</strong></div><MoreHorizontal size={17} className="row-more" /></button> }
function AgendaItem({ time, ampm, title, person, color }) { return <div className="agenda-item"><div className="agenda-time"><strong>{time}</strong><small>{ampm}</small></div><div className={`agenda-marker ${color}`} /><div className="agenda-detail"><strong>{title}</strong><span>{person}</span></div><MoreHorizontal size={16} /></div> }
function ActivityItem({ icon: Icon, tone, title, detail, time }) { return <div className="activity-item"><div className={`activity-icon ${tone}`}><Icon size={15} /></div><div className="activity-detail"><strong>{title}</strong><span>{detail}</span></div><time>{time}</time></div> }
function EmptyState({ icon: Icon, text, action, onClick }) { return <div className="empty-state"><Icon size={20} /><span>{text}</span>{action && <button className="text-button" onClick={onClick}>{action} <ArrowUpRight size={13} /></button>}</div> }

function ProjectOverview({ project, tasks, isExample, onBack, onNotify, onToggleTask, onAddTask }) {
  const [newTask, setNewTask] = useState('')
  const completed = tasks.filter((task) => task.status === 'done').length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : project.progress
  const submitTask = (event) => { event.preventDefault(); if (!newTask.trim()) return; onAddTask(newTask); setNewTask('') }
  return <section className="project-page"><button className="back-button" onClick={onBack}><ArrowRight size={15} /> Back to {isExample ? 'example overview' : 'projects'}</button><div className="project-page-header"><div><div className={`avatar project-avatar ${project.color}`}>{project.initials}</div><div className="project-title-block"><p className="eyebrow">{isExample ? 'Example project' : 'Project overview'}</p><h1>{project.name}</h1><p>{project.client} <span>·</span> {project.type}</p></div></div><button className="button button-quiet" onClick={() => onNotify('Project sharing is coming soon')}><ArrowUpRight size={15} /> Share project</button></div><div className="project-summary"><div><span>Status</span><strong className="summary-status"><i /> {project.status}</strong></div><div><span>Due date</span><strong>{project.due}</strong></div><div><span>Progress</span><strong>{progress}%</strong></div><div><span>Project value</span><strong>{project.value || 'Not set'}</strong></div></div><div className="project-detail-grid"><div className="panel task-panel"><div className="panel-heading"><div><h2>Tasks</h2><p className="panel-subtitle">Keep the work connected to this project.</p></div><span className="task-count">{completed}/{tasks.length} complete</span></div><form className="add-task-form" onSubmit={submitTask}><input value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add a task to this project..." aria-label="New task" /><button className="button button-primary" type="submit"><Plus size={15} /> Add task</button></form>{tasks.length ? <div className="task-list">{tasks.map((task) => <div className={`task-row ${task.status === 'done' ? 'completed' : ''}`} key={task.id}><button type="button" className="task-checkbox" onClick={() => onToggleTask(task.id)} aria-label={`Mark ${task.title} ${task.status === 'done' ? 'incomplete' : 'complete'}`}><Check size={12} /></button><div className="task-copy"><strong>{task.title}</strong><span>{task.owner} <i>·</i> Due {task.due}</span></div><span className={`task-status ${task.status}`}>{task.status === 'done' ? 'Complete' : task.status === 'current' ? 'In progress' : 'To do'}</span></div>)}</div> : <EmptyState icon={LayoutGrid} text="No tasks yet" action="Add your first task above" />}</div><div className="project-side-column"><div className="panel progress-panel"><PanelHeading title="Project progress" action="View activity" onClick={() => onNotify('Project activity opened')} /><div className="large-progress"><div className="large-progress-number">{progress}<span>%</span></div><div className="large-progress-track"><span style={{ width: `${progress}%` }} /></div></div><p>{tasks.length ? `${tasks.length - completed} ${tasks.length - completed === 1 ? 'task remains' : 'tasks remain'} in this project.` : 'Add tasks to start tracking project progress.'}</p></div><div className="panel project-notes"><div className="note-icon"><FileText size={17} /></div><p className="eyebrow">Project notes</p><h3>{isExample ? 'Keep the handoff feeling easy.' : 'Capture context as you go.'}</h3><p>{isExample ? 'This is where project-level notes, decisions, and client context can live alongside the work.' : 'Add notes, decisions, and client context here once your workspace is connected to the API.'}</p><button className="text-button" onClick={() => onNotify('Project notes editor opened')}>Add a note <ArrowUpRight size={14} /></button></div></div></div></section>
}

function PortalView({ onNotify }) { const [approved, setApproved] = useState(false); return <section className="portal-page"><div className="portal-page-top"><div><p className="eyebrow">Client portal preview</p><h1>Welcome, Jamie <span>✦</span></h1><p className="placeholder-copy">Everything you need for your Lumen Studio project, in one place.</p></div><button className="button button-quiet" onClick={() => onNotify('Portal link copied to clipboard')}><ArrowUpRight size={15} /> Share portal</button></div><div className="client-banner"><div className="avatar project-avatar violet">LS</div><div><strong>Lumen Studio Rebrand</strong><span>Managed by Avery & Co. · Updated just now</span></div><span className="status-pill"><i /> In progress</span></div><div className="portal-grid"><div className="panel portal-status-card"><PanelHeading title="Project status" action="View timeline" onClick={() => onNotify('Project timeline opened')} /><div className="portal-progress"><div className="portal-progress-number">68<span>%</span></div><div><strong>Moving along nicely</strong><p>Strategy and visual direction are complete. We’re now refining the brand system.</p></div></div><div className="milestones"><span className="done"><i><Check size={11} /></i>Kickoff</span><span className="done"><i><Check size={11} /></i>Strategy</span><span className="current"><i>3</i>Design review</span><span><i>4</i>Launch</span></div></div><div className="panel approval-card"><div className="approval-icon"><FileText size={18} /></div><p className="eyebrow">Needs your approval</p><h3>Brand strategy quote</h3><p>Scope, timeline, and investment for the next phase.</p><div className="approval-price">$8,400 <span>USD</span></div>{approved ? <div className="approved-state"><Check size={15} /> Approved on Oct 15</div> : <button className="button button-primary" onClick={() => { setApproved(true); onNotify('Quote approved and team notified') }}>Approve quote <ArrowUpRight size={14} /></button>}</div><div className="panel portal-files-card"><PanelHeading title="Shared files" action="View all" onClick={() => onNotify('Shared files opened')} /><div className="shared-file"><div className="file-type">PDF</div><div><strong>Brand strategy.pdf</strong><span>4.8 MB · Oct 14</span></div><ArrowUpRight size={14} /></div><div className="shared-file"><div className="file-type slides">SLD</div><div><strong>Visual direction.key</strong><span>18.2 MB · Oct 12</span></div><ArrowUpRight size={14} /></div><button className="upload-button" onClick={() => onNotify('Document uploader opened')}><CloudUpload size={15} /> Upload a document</button></div><div className="panel portal-message-card"><div className="message-avatar avatar-user">AW</div><div><p className="eyebrow">Your project lead</p><h3>Have a question?</h3><p>Send Alex a message and keep everything about this project in one thread.</p><button className="text-button" onClick={() => onNotify('Message composer opened')}>Send a message <ArrowUpRight size={14} /></button></div></div></div></section> }

function ViewPlaceholder({ view, projects, onAdd, onNotify, onOpenProject }) { const copy = { Projects: ['Projects', 'Keep every engagement moving forward.', 'New project'], Clients: ['Clients', 'The people and relationships behind your work.', 'Add client'], Calendar: ['Calendar', 'Your schedule, without the scheduling scramble.', 'Book appointment'], Invoices: ['Invoices', 'Keep cash flow clear and predictable.', 'New invoice'], Documents: ['Documents', 'A home for every file your clients need.', 'Upload document'], Inbox: ['Inbox', 'Client communication, gathered in one place.', 'New message'] }[view] || ['Workspace', 'Everything your business needs, in one place.', 'Get started']; return <section className="placeholder-view"><div className="placeholder-icon"><LayoutGrid size={22} /></div><p className="eyebrow">{view}</p><h1>{copy[0]}</h1><p className="placeholder-copy">{copy[1]}</p><button className="button button-primary" onClick={view === 'Projects' ? onAdd : () => onNotify(`${copy[2]} flow opened`)}><Plus size={16} /> {copy[2]}</button>{view === 'Projects' && projects.length > 0 && <div className="placeholder-projects">{projects.map((project) => <ProjectRow key={project.id} project={project} onClick={() => onOpenProject(project)} />)}</div>}</section> }

export default App
