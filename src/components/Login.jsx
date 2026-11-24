import { useState } from 'react'

export default function Login({ mode, onLogin, onRegister, onBack }) {
	const up = mode === 'up'
	const [f, setF] = useState({ name: '', email: '', pw: '' })
	const [err, setErr] = useState('')
	const set = k => e => setF({ ...f, [k]: e.target.value })

	const submit = e => {
		e.preventDefault()
		if (f.pw.length < 6) return setErr('Parol kamida 6 belgi bo‘lsin')
		if (up && !f.name.trim()) return setErr('Ismingizni kiriting')
		setErr(up ? onRegister(f.name, f.email, f.pw) : onLogin(f.email, f.pw))
	}

	return (
		<main className='center'>
			<form className='card auth' onSubmit={submit}>
				<h2>{up ? 'Ro‘yxatdan o‘tish' : 'Kirish'}</h2>
				{up && <input placeholder='Ism' value={f.name} onChange={set('name')} />}
				<input type='email' placeholder='Email' value={f.email} onChange={set('email')} required />
				<input type='password' placeholder='Parol' value={f.pw} onChange={set('pw')} required />
				{err && <p className='err'>{err}</p>}
				<button className='btn'>{up ? 'Ro‘yxatdan o‘tish' : 'Kirish'}</button>
				<button type='button' className='link' onClick={onBack}>
					Orqaga
				</button>
			</form>
		</main>
	)
}
