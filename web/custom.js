// CUSTOM JS

function injectScript(src, idpKey) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.setAttribute('data-key', idpKey);
        script.setAttribute('data-init-only', 'false');
        script.setAttribute("defer", "defer");
        script.addEventListener('load', resolve);
        script.addEventListener('error', e => reject(e.error));
        document.head.appendChild(script);
    });
}
injectScript('https://idp.6ix.com/s/lib.js', 'js.gxwnc116jvz5sus6vw62us.9o4pokhuhig5j1yqk60fxi')
.then(() => {
    const newScript = document.createElement('script');
    newScript.append("window.jitsu = window.jitsu || (function(){(window.jitsuQ = window.jitsuQ || []).push(arguments);})");
    document.head.appendChild(newScript);
    console.log('Script loaded!');
}).catch(error => {
    console.error(error);
});