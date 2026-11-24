(function () {
	var src = document.currentScript && document.currentScript.src
	if (!src) return
	var origin = new URL(src).origin
	var btn = document.createElement('button')
	var frame = document.createElement('iframe')
	btn.setAttribute('aria-label', 'Yordamchi')
	btn.textContent = '?'
	btn.style.cssText =
		'position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;border:0;cursor:pointer;font:600 24px sans-serif;color:#fff;background:#d92d3a;box-shadow:0 8px 24px rgba(0,0,0,.3);z-index:2147483646'
	frame.src = origin + '/?embed=1'
	frame.title = 'Yordamchi'
	frame.style.cssText =
		'position:fixed;right:20px;bottom:88px;width:380px;max-width:calc(100vw - 40px);height:560px;max-height:calc(100vh - 110px);border:0;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.35);display:none;z-index:2147483646'
	btn.onclick = function () {
		frame.style.display = frame.style.display === 'none' ? 'block' : 'none'
	}
	document.body.appendChild(frame)
	document.body.appendChild(btn)
})()
