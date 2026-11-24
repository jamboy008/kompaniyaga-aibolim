const files = []

const youtube = [{ id: 'yt-minus', name: 'Minus (YouTube)', yt: '5-Sx68TBY7s' }]

const generated = [
	{
		id: 'tun',
		name: 'Tun osmoni',
		root: 110,
		step: 10,
		bells: [24, 27, 29, 31, 34],
		chords: [
			[0, 7, 12, 15],
			[-4, 3, 7, 12],
			[3, 10, 14, 19],
			[-2, 5, 10, 14],
		],
	},
	{
		id: 'dengiz',
		name: 'Sokin dengiz',
		root: 98,
		step: 12,
		bells: [24, 26, 28, 31, 33],
		chords: [
			[0, 7, 12, 14],
			[-3, 4, 9, 12],
			[5, 12, 16, 19],
			[7, 14, 19, 23],
		],
	},
	{
		id: 'ummon',
		name: 'Ummon',
		root: 82.41,
		step: 14,
		bells: [24, 26, 31, 33, 36],
		chords: [
			[0, 7, 12, 14],
			[-5, 2, 7, 11],
			[-3, 4, 9, 12],
			[-7, 0, 5, 9],
		],
	},
	{
		id: 'sokintun',
		name: 'Sokin tun',
		root: 73.42,
		step: 12,
		bells: [24, 27, 29, 31, 34],
		chords: [
			[0, 7, 12, 15],
			[-4, 3, 8, 12],
			[-9, -2, 3, 7],
			[-2, 5, 10, 14],
		],
	},
	{
		id: 'yulduz',
		name: 'Yulduzlar',
		root: 146.83,
		step: 9,
		bells: [28, 31, 33, 36, 40],
		chords: [
			[0, 7, 12, 16],
			[-7, 0, 5, 9],
			[-3, 4, 9, 12],
			[-5, 2, 7, 11],
		],
	},
	{
		id: 'bulut',
		name: 'Bulutlar',
		root: 87.31,
		step: 11,
		bells: [24, 26, 28, 31, 33],
		chords: [
			[0, 7, 12, 16],
			[5, 12, 17, 21],
			[-3, 4, 9, 12],
			[7, 14, 19, 23],
		],
	},
	{
		id: 'vodiy',
		name: 'Vodiy',
		root: 123.47,
		step: 13,
		bells: [24, 27, 29, 31, 34],
		chords: [
			[0, 7, 12, 15],
			[-4, 3, 8, 12],
			[3, 10, 15, 19],
			[-2, 5, 10, 14],
		],
	},
	{
		id: 'oy',
		name: 'Oy nuri',
		root: 65.41,
		step: 16,
		bells: [28, 31, 33, 36],
		chords: [
			[0, 7, 11, 16],
			[-3, 4, 9, 12],
			[-7, 0, 4, 9],
			[-5, 2, 7, 11],
		],
	},
]

export const tracks = [...generated, ...files, ...youtube]

let ctx = null
let session = null
let vol = 0.5

const hz = (root, semi) => root * Math.pow(2, semi / 12)

function impulse(c) {
	const len = Math.floor(c.sampleRate * 3.5)
	const buf = c.createBuffer(2, len, c.sampleRate)
	for (let ch = 0; ch < 2; ch++) {
		const d = buf.getChannelData(ch)
		for (let i = 0; i < len; i++)
			d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6)
	}
	return buf
}

function pad(s, t, freq, dur) {
	;[-6, 6].forEach(det => {
		const o = ctx.createOscillator()
		const g = ctx.createGain()
		o.type = det < 0 ? 'triangle' : 'sine'
		o.frequency.value = freq
		o.detune.value = det
		g.gain.setValueAtTime(0, t)
		g.gain.linearRampToValueAtTime(0.03, t + 3)
		g.gain.setValueAtTime(0.03, t + dur - 1)
		g.gain.linearRampToValueAtTime(0, t + dur + 3)
		o.connect(g)
		g.connect(s.filter)
		o.start(t)
		o.stop(t + dur + 3.2)
	})
}

function bell(s, t, freq) {
	const o = ctx.createOscillator()
	const g = ctx.createGain()
	o.type = 'sine'
	o.frequency.value = freq
	g.gain.setValueAtTime(0, t)
	g.gain.linearRampToValueAtTime(0.028, t + 0.03)
	g.gain.exponentialRampToValueAtTime(0.0001, t + 5)
	o.connect(g)
	g.connect(s.filter)
	o.start(t)
	o.stop(t + 5.2)
}

export function current() {
	return session ? session.id : ''
}

export function stop() {
	if (!session) return
	const s = session
	session = null
	if (s.yt) return
	if (s.el) {
		let v = s.el.volume
		const id = setInterval(() => {
			v = Math.max(0, v - 0.08)
			s.el.volume = v
			if (v <= 0) {
				clearInterval(id)
				s.el.pause()
			}
		}, 120)
		return
	}
	s.timers.forEach(clearInterval)
	const t = ctx.currentTime
	s.master.gain.cancelScheduledValues(t)
	s.master.gain.setValueAtTime(s.master.gain.value, t)
	s.master.gain.linearRampToValueAtTime(0, t + 1.5)
	setTimeout(() => s.master.disconnect(), 1800)
}

export function setVolume(v) {
	vol = v
	if (!session || session.yt) return
	if (session.el) session.el.volume = v * 0.75
	else session.master.gain.setTargetAtTime(v * 0.75, ctx.currentTime, 0.1)
}

export function play(id, v) {
	const tr = tracks.find(t => t.id === id)
	if (!tr) return
	stop()
	if (typeof v === 'number') vol = v
	if (tr.yt) {
		session = { id, yt: tr.yt }
		return
	}
	if (tr.src) {
		const el = new Audio(tr.src)
		el.loop = true
		el.volume = vol * 0.75
		el.play().catch(() => {})
		session = { id, el }
		return
	}
	if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
	if (ctx.state === 'suspended') ctx.resume()
	const master = ctx.createGain()
	master.gain.setValueAtTime(0, ctx.currentTime)
	master.gain.linearRampToValueAtTime(vol * 0.75, ctx.currentTime + 2)
	master.connect(ctx.destination)
	const filter = ctx.createBiquadFilter()
	filter.type = 'lowpass'
	filter.frequency.value = 1400
	const verb = ctx.createConvolver()
	verb.buffer = impulse(ctx)
	const wet = ctx.createGain()
	wet.gain.value = 0.7
	filter.connect(master)
	filter.connect(verb)
	verb.connect(wet)
	wet.connect(master)
	const s = { id, master, filter, timers: [] }
	let i = 0
	const chord = () => {
		const t = ctx.currentTime + 0.05
		tr.chords[i % tr.chords.length].forEach(semi =>
			pad(s, t, hz(tr.root, semi), tr.step),
		)
		i += 1
	}
	const chime = () => {
		if (Math.random() < 0.45)
			bell(
				s,
				ctx.currentTime,
				hz(tr.root, tr.bells[Math.floor(Math.random() * tr.bells.length)]),
			)
	}
	chord()
	s.timers.push(setInterval(chord, tr.step * 1000), setInterval(chime, 5200))
	session = s
}
