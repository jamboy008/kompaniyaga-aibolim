import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import Settings from './Settings.jsx'
import { useStored } from '../hooks/useStored.js'
import { ask } from '../api.js'

let uid = Date.now()
const blank = () => ({ id: ++uid, title: 'Yangi suhbat', messages: [] })

export default function Chat({
	embed,
	user,
	company,
	setCompany,
	theme,
	onToggle,
	onLogout,
}) {
	const [chats, setChats] = useStored('cc_chats', [blank()])
	const [activeId, setActiveId] = useState(chats[0].id)
	const [text, setText] = useState('')
	const [busy, setBusy] = useState(false)
	const [menu, setMenu] = useState(false)
	const [settings, setSettings] = useState(false)
	const end = useRef(null)

	const active = chats.find(c => c.id === activeId) || chats[0]
	const embedCode = `<script src="${location.origin}/widget.js" defer></script>`

	useEffect(() => {
		end.current?.scrollIntoView({ behavior: 'smooth' })
	}, [active.messages.length, busy])

	const patch = (id, fn) => setChats(l => l.map(c => (c.id === id ? fn(c) : c)))

	const newChat = () => {
		const c = blank()
		setChats(l => [c, ...l])
		setActiveId(c.id)
		setMenu(false)
	}

	const send = async e => {
		e.preventDefault()
		const q = text.trim()
		if (!q || busy) return
		const id = active.id
		const history = active.messages
		setText('')
		setBusy(true)
		patch(id, c => ({
			...c,
			title: c.messages.length ? c.title : q.slice(0, 32),
			messages: [...c.messages, { id: ++uid, role: 'user', text: q }],
		}))
		let reply
		try {
			reply = await ask(company, q, history)
		} catch (err) {
			reply = err.message
		}
		patch(id, c => ({
			...c,
			messages: [...c.messages, { id: ++uid, role: 'ai', text: reply }],
		}))
		setBusy(false)
	}

	return (
		<div className={`shell ${embed ? 'embed' : ''}`}>
			{!embed && (
				<aside className={`side ${menu ? 'open' : ''}`}>
					<button className='btn' onClick={newChat}>
						<Icon name='plus' size={18} /> Yangi suhbat
					</button>
					<nav>
						{chats.map(c => (
							<button
								key={c.id}
								className={`item ${c.id === active.id ? 'on' : ''}`}
								onClick={() => {
									setActiveId(c.id)
									setMenu(false)
								}}
							>
								{c.title}
							</button>
						))}
					</nav>
					<div className='me'>
						<span>{user?.name}</span>
						<button
							className='icon-btn'
							onClick={() => setSettings(true)}
							aria-label='Sozlamalar'
						>
							<Icon name='gear' />
						</button>
					</div>
				</aside>
			)}
			<section className='main'>
				<header className='bar'>
					{!embed && (
						<button
							className='icon-btn mob'
							onClick={() => setMenu(v => !v)}
							aria-label='Menyu'
						>
							<Icon name='menu' />
						</button>
					)}
					<strong>{company.name}</strong>
					<div className='row'>
						<button
							className='icon-btn'
							onClick={onToggle}
							aria-label='Rejimni almashtirish'
						>
							<Icon name={theme === 'dark' ? 'sun' : 'moon'} />
						</button>
					</div>
				</header>
				<div className='feed'>
					{!active.messages.length && (
						<div className='empty'>
							<h2>{company.name} haqida so‘rang</h2>
							<p>Xizmatlar, narxlar, manzil yoki aloqa haqida savol bering.</p>
						</div>
					)}
					{active.messages.map(m => (
						<div key={m.id} className={`msg ${m.role}`}>
							{m.text}
						</div>
					))}
					{busy && (
						<div className='msg ai dots'>
							<i />
							<i />
							<i />
						</div>
					)}
					<div ref={end} />
				</div>
				<form className='composer' onSubmit={send}>
					<input
						value={text}
						onChange={e => setText(e.target.value)}
						placeholder='Savolingizni yozing'
						aria-label='Savol'
					/>
					<button
						className='send'
						disabled={!text.trim() || busy}
						aria-label='Yuborish'
					>
						<Icon name='send' />
					</button>
				</form>
			</section>
			{settings && (
				<Settings
					company={company}
					setCompany={setCompany}
					embedCode={embedCode}
					onClose={() => setSettings(false)}
					onLogout={onLogout}
				/>
			)}
		</div>
	)
}
