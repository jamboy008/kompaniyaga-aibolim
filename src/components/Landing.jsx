import Icon from './Icon.jsx'

const points = [
	[
		'Saytingiz haqida aniq javob',
		'Bot kompaniya sayti ma’lumotiga tayanib javob beradi.',
	],
	[
		'Saytga bir qator kod bilan ulanadi',
		'Widget skripti sahifangizga chat tugmasini qo‘shadi.',
	],
	[
		'Qorong‘i va yorug‘ rejim',
		'Foydalanuvchi o‘ziga qulay ko‘rinishni tanlaydi.',
	],
]

export default function Landing({ company, theme, onToggle, onAuth }) {
	return (
		<main className='landing'>
			<header className='top'>
				<span className='brand'>
					<Icon name='bot' /> {company.name}
				</span>
				<div className='row'>
					<div className='row'>
						<button
							className='icon-btn'
							onClick={onToggle}
							aria-label='Rejimni almashtirish'
						>
							<Icon name={theme === 'dark' ? 'sun' : 'moon'} />
						</button>
					</div>
					<button className='btn ghost' onClick={() => onAuth('in')}>
						Kirish
					</button>
				</div>
			</header>
			<section className='hero'>
				<h1>Sayt haqidagi savolga bir zumda javob beradigan yordamchi</h1>
				<p>
					Mijozlaringiz narx, xizmat va aloqa haqida savolni chatda beradi va
					javobni darhol oladi.
				</p>
				<button className='btn' onClick={() => onAuth('up')}>
					Boshlash
				</button>
			</section>
			<section className='points'>
				{points.map(([t, d]) => (
					<article key={t} className='card'>
						<h3>{t}</h3>
						<p>{d}</p>
					</article>
				))}
			</section>
		</main>
	)
}
