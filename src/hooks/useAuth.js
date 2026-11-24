import { useStored } from './useStored.js'

export default function useAuth() {
	const [users, setUsers] = useStored('cc_users', [])
	const [session, setSession] = useStored('cc_session', '')

	const user = users.find(u => u.email === session)

	const login = (email, pw) => {
		const mail = email.trim().toLowerCase()
		const found = users.find(u => u.email === mail)
		if (!found || found.password !== pw) return 'Email yoki parol noto‘g‘ri'
		setSession(found.email)
		return ''
	}

	const register = (name, email, pw) => {
		const mail = email.trim().toLowerCase()
		if (users.some(u => u.email === mail))
			return 'Bu email allaqachon ro‘yxatdan o‘tgan'
		setUsers(l => [...l, { name: name.trim(), email: mail, password: pw }])
		setSession(mail)
		return ''
	}

	const logout = () => setSession('')

	const updateUser = patch =>
		setUsers(l => l.map(u => (u.email === session ? { ...u, ...patch } : u)))

	const changePassword = (oldPw, newPw) => {
		if (user.password !== oldPw) return 'Joriy parol noto‘g‘ri'
		updateUser({ password: newPw })
		return ''
	}

	const deleteAccount = () => {
		setUsers(l => l.filter(u => u.email !== session))
		setSession('')
	}

	return {
		user,
		login,
		register,
		logout,
		updateUser,
		changePassword,
		deleteAccount,
	}
}
