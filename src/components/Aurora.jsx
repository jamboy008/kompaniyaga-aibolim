import { useEffect, useRef } from 'react'

const palettes = {
	light: {
		base: [7, 22, 72],
		stops: [
			[0, [8, 26, 86]],
			[0.28, [24, 72, 190]],
			[0.5, [92, 160, 255]],
			[0.64, [226, 238, 255]],
			[0.78, [255, 226, 140]],
			[1, [255, 190, 30]],
		],
	},
	dark: {
		base: [6, 6, 10],
		stops: [
			[0, [10, 8, 14]],
			[0.3, [90, 14, 26]],
			[0.52, [210, 44, 52]],
			[0.68, [255, 150, 130]],
			[0.82, [255, 226, 214]],
			[1, [255, 120, 90]],
		],
	},
}

const mix = (stops, c) => {
	for (let i = 1; i < stops.length; i++) {
		if (c <= stops[i][0]) {
			const [a, ca] = stops[i - 1]
			const [b, cb] = stops[i]
			const k = (c - a) / (b - a)
			return ca.map((v, j) => Math.round(v + (cb[j] - v) * k))
		}
	}
	return stops[stops.length - 1][1]
}

export default function Aurora({ theme }) {
	const ref = useRef(null)

	useEffect(() => {
		const cv = ref.current
		const ctx = cv.getContext('2d')
		const pal = palettes[theme] || palettes.dark
		const lut = Array.from(
			{ length: 256 },
			(_, i) => `rgba(${mix(pal.stops, i / 255).join(',')},0.55)`,
		)
		const still = matchMedia('(prefers-reduced-motion: reduce)').matches
		let raf = 0
		let w = 0
		let h = 0
		let t = 0
		let ps = []

		const spawn = p => {
			p.x = Math.random() * w
			p.y = Math.random() * h
			p.px = p.x
			p.py = p.y
			p.life = 80 + Math.random() * 160
			p.wd = 0.9 + Math.random() * 1.6
			p.j = (Math.random() - 0.5) * 0.08
		}

		const step = () => {
			t += 0.0007
			ctx.fillStyle = `rgba(${pal.base},0.04)`
			ctx.fillRect(0, 0, w, h)
			const asp = w / h
			const vort = [
				[0.3 + 0.08 * Math.sin(t * 0.7), 0.65 + 0.08 * Math.cos(t * 0.6), 1],
				[0.72 + 0.07 * Math.cos(t * 0.5), 0.35 + 0.07 * Math.sin(t * 0.8), -1],
			]
			ctx.lineCap = 'round'
			for (const p of ps) {
				const u = p.x / w
				const v = p.y / h
				const a =
					Math.sin(u * 3.1 + t * 1.3) +
					Math.cos(v * 3.7 - t) +
					Math.sin((u + v) * 2.3 + t * 0.8)
				let vx = Math.cos(a)
				let vy = Math.sin(a)
				for (const [cx, cy, s] of vort) {
					const dx = (u - cx) * asp
					const dy = v - cy
					const d = Math.sqrt(dx * dx + dy * dy) + 0.05
					const wt = s * 2.4 * Math.exp(-(d * d) / 0.07)
					vx += (-dy * wt) / d
					vy += (dx * wt) / d
				}
				const len = Math.hypot(vx, vy) || 1
				p.x += (vx / len) * 0.2
				p.y += (vy / len) * 0.2
				let c =
					0.5 +
					0.34 * Math.sin(u * 3.1 + v * 1.4 + t * 0.5) +
					0.26 * Math.sin(v * 2.6 - u * 1.1 - t * 0.4) +
					p.j
				c = Math.max(0, Math.min(1, c))
				ctx.strokeStyle = lut[Math.round(c * 255)]
				ctx.lineWidth = p.wd
				ctx.beginPath()
				ctx.moveTo(p.px, p.py)
				ctx.lineTo(p.x, p.y)
				ctx.stroke()
				p.px = p.x
				p.py = p.y
				p.life -= 1
				if (p.life <= 0 || p.x < -5 || p.y < -5 || p.x > w + 5 || p.y > h + 5)
					spawn(p)
			}
		}

		const size = () => {
			w = cv.width = Math.ceil(innerWidth / 3)
			h = cv.height = Math.ceil(innerHeight / 3)
			ctx.fillStyle = `rgb(${pal.base})`
			ctx.fillRect(0, 0, w, h)
			ps = Array.from(
				{ length: Math.min(700, Math.floor((w * h) / 400)) },
				() => {
					const p = {}
					spawn(p)
					return p
				},
			)
			for (let i = 0; i < 140; i++) step()
		}

		let last = 0
		let timer = 0

		const loop = now => {
			raf = requestAnimationFrame(loop)
			if (now - last < 33) return
			last = now
			step()
		}

		const onResize = () => {
			clearTimeout(timer)
			timer = setTimeout(size, 250)
		}

		size()
		if (!still) raf = requestAnimationFrame(loop)
		addEventListener('resize', onResize)
		return () => {
			cancelAnimationFrame(raf)
			removeEventListener('resize', onResize)
			clearTimeout(timer)
		}
	}, [theme])

	return (
		<>
			<canvas ref={ref} className='aurora' />
			<div className='moon' />
			<i className='star s1' />
			<i className='star s2' />
			<i className='star s3' />
		</>
	)
}
