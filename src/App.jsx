import { useEffect, useState } from 'react'
import Landing from './components/Landing.jsx'
import Login from './components/Login.jsx'
import Aurora from './components/Aurora.jsx'
import Chat from './components/Chat.jsx'
import useAuth from './hooks/useAuth.js'
import { useStored } from './hooks/useStored.js'

const embed = new URLSearchParams(location.search).has('embed')

export default function App() {
	const auth = useAuth()
	const [theme, setTheme] = useStored('cc_theme', 'dark')
	const [company, setCompany] = useStored('cc_company', {
		name: 'Kompaniya',
		site: '',
		apiUrl: '',
	})
	const [screen, setScreen] = useState('landing')
	const [mode, setMode] = useState('in')

	useEffect(() => {
		document.documentElement.dataset.theme = theme
	}, [theme])

	const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
	const open = m => {
		setMode(m)
		setScreen('auth')
	}

	return (
		<div className='app'>
			<Aurora theme={theme} />
			<div className='glow' />
			{embed || auth.user ? (
				<Chat
					embed={embed}
					user={auth.user}
					company={company}
					setCompany={setCompany}
					theme={theme}
					onToggle={toggle}
					onLogout={auth.logout}
				/>
			) : screen === 'auth' ? (
				<Login
					key={mode}
					mode={mode}
					onLogin={auth.login}
					onRegister={auth.register}
					onBack={() => setScreen('landing')}
				/>
			) : (
				<Landing
					company={company}
					theme={theme}
					onToggle={toggle}
					onAuth={open}
				/>
			)}
		</div>
	)
}
