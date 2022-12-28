//JS

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

function getKeyFunction() {

    let shopName = window.top.Shopify.shop;

    fetch(`https://${shopName}/apps/6ix-app/api/idpkey/fetch`).then(function (response) {
        return response.json();
    })
        .then((data) => {

            let idpKey = data.data.idpkey;

            injectScript('https://idp.6ix.com/s/lib.js', idpKey)
                .then(() => {
                    const newScript = document.createElement('script');
                    newScript.append("window.jitsu = window.jitsu || (function(){(window.jitsuQ = window.jitsuQ || []).push(arguments);})");
                    document.head.appendChild(newScript);
                    console.log('Script loaded!');
                }).catch(error => {
                    console.error(error);
                });

        }).catch(error => {
            console.error(error);
        });
}

getKeyFunction();
