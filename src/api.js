const wait = ms => new Promise(r => setTimeout(r, ms))

export async function ask(company, message, history) {
	const base = company.apiUrl || import.meta.env.VITE_API_URL
	if (!base) {
		await wait(900)
		return `Demo rejim: server ulanmagan. Sozlamalarda backend manzilini kiriting, shunda ${company.name || 'kompaniya'} haqidagi savollarga haqiqiy javob beraman.`
	}
	const res = await fetch(`${base.replace(/\/$/, '')}/chat`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			message,
			history: history.slice(-10).map(m => ({ role: m.role, text: m.text })),
			company: company.name,
			site: company.site,
		}),
	})
	if (!res.ok) throw new Error(`Server xatosi: ${res.status}`)
	const data = await res.json()
	return data.reply || 'Javob olinmadi.'
}
