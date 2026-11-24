const paths = {
	sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m0-11.4L4.9 4.9m14.2 14.2-1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z',
	moon: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z',
	send: 'M5 12h14m-6-6 6 6-6 6',
	plus: 'M12 5v14M5 12h14',
	gear: 'M12 15a3 3 0 100-6 3 3 0 000 6zm7-3 2-1-2-3-2 .5a7 7 0 00-1.5-1L15 5h-4l-.5 2.5a7 7 0 00-1.5 1L7 8 5 11l2 1a7 7 0 000 2l-2 1 2 3 2-.5a7 7 0 001.5 1L11 21h4l.5-2.5a7 7 0 001.5-1l2 .5 2-3-2-1a7 7 0 000-2z',
	x: 'M6 6l12 12M18 6 6 18',
	menu: 'M4 7h16M4 12h16M4 17h16',
	out: 'M15 4h4v16h-4M10 8l-4 4 4 4m-4-4h11',
	bot: 'M12 3v3m-6 4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm3 4v2m6-2v2',
}

export default function Icon({ name, size = 20 }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.8'
			strokeLinecap='round'
			strokeLinejoin='round'
			aria-hidden='true'
		>
			<path d={paths[name]} />
		</svg>
	)
}
