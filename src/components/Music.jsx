import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon.jsx'
import { tracks, play, stop, setVolume, current } from '../ambient.js'

export default function Music() {
	const [open, setOpen] = useState(false)
	const [cur, setCur] = useState(current())
	const [vol, setVol] = useState(0.5)
	const box = useRef(null)
	const frame = useRef(null)

	const live = tracks.find(t => t.id === cur)

	useEffect(() => {
		const close = e => {
			if (box.current && !box.current.contains(e.target)) setOpen(false)
		}
		document.addEventListener('mousedown', close)
		return () => document.removeEventListener('mousedown', close)
	}, [])

	const send = v => {
		const w = frame.current && frame.current.contentWindow
		if (w)
			w.postMessage(
				JSON.stringify({
					event: 'command',
					func: 'setVolume',
					args: [Math.round(v * 100)],
				}),
				'*',
			)
	}

	const pick = id => {
		if (cur === id) {
			stop()
			setCur('')
		} else {
			play(id, vol)
			setCur(id)
		}
	}

	const change = e => {
		const v = Number(e.target.value)
		setVol(v)
		setVolume(v)
		send(v)
	}

	return (
		<div className='music' ref={box}>
			<button
				className={`icon-btn ${cur ? 'live' : ''}`}
				onClick={() => setOpen(v => !v)}
				aria-label='Musiqa'
			>
				<Icon name='music' />
			</button>
			{open && (
				<div className='music-pop'>
					{tracks.map(t => (
						<button
							key={t.id}
							className={`track ${cur === t.id ? 'on' : ''}`}
							onClick={() => pick(t.id)}
						>
							<span className='eq'>
								<i />
								<i />
								<i />
							</span>
							{t.name}
						</button>
					))}
					<input
						type='range'
						min='0'
						max='1'
						step='0.05'
						value={vol}
						onChange={change}
						aria-label='Ovoz balandligi'
					/>
				</div>
			)}
			{live &&
				live.yt &&
				createPortal(
					<div className='yt-mini'>
						<iframe
							ref={frame}
							title={live.name}
							src={`https://www.youtube.com/embed/${live.yt}?autoplay=1&loop=1&playlist=${live.yt}&enablejsapi=1&playsinline=1`}
							allow='autoplay; encrypted-media'
							onLoad={() => send(vol)}
						/>
						<button
							className='yt-close'
							onClick={() => pick(live.id)}
							aria-label='Yopish'
						>
							<Icon name='x' size={16} />
						</button>
					</div>,
					document.body,
				)}
		</div>
	)
}
