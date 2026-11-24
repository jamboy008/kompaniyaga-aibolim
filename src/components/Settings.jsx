import Icon from './Icon.jsx'

export default function Settings({ company, setCompany, onClose, onLogout, embedCode }) {
	const set = k => e => setCompany({ ...company, [k]: e.target.value })

	return (
		<div className='modal' onClick={onClose}>
			<div className='card sheet' onClick={e => e.stopPropagation()}>
				<div className='row between'>
					<h2>Sozlamalar</h2>
					<button className='icon-btn' onClick={onClose} aria-label='Yopish'>
						<Icon name='x' />
					</button>
				</div>
				<label>
					Kompaniya nomi
					<input value={company.name} onChange={set('name')} />
				</label>
				<label>
					Kompaniya sayti
					<input placeholder='https://kompaniya.uz' value={company.site} onChange={set('site')} />
				</label>
				<label>
					Backend manzili
					<input placeholder='https://api.kompaniya.uz' value={company.apiUrl} onChange={set('apiUrl')} />
				</label>
				<label>
					Saytga qo‘yish uchun kod
					<textarea readOnly rows={3} value={embedCode} onFocus={e => e.target.select()} />
				</label>
				{onLogout && (
					<button className='btn ghost' onClick={onLogout}>
						<Icon name='out' size={18} /> Chiqish
					</button>
				)}
			</div>
		</div>
	)
}
