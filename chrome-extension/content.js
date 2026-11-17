(function() {
    function apply(term) {
        const input = document.getElementById("toolSearch");
        if (!input) return false;
        input.value = term;
        if (typeof window.setToolSearch === "function") {
            window.setToolSearch(term);
        } else {
            input.dispatchEvent(new Event("input", {
                bubbles: true
            }));
        }
        input.focus();
        return true;
    }

    function waitFor(term, tries) {
        if (apply(term)) return;
        if (tries <= 0) return;
        setTimeout(function() {
            waitFor(term, tries - 1);
        }, 100);
    }

    function go(term) {
        if (location.hash !== "#tools") location.hash = "#tools";
        waitFor(term, 60);
    }

    const initial = new URLSearchParams(location.search).get("toolq");
    if (initial) go(initial);

    chrome.runtime.onMessage.addListener(function(message, sender, reply) {
        if (message && message.type === "polash-search") {
            go(message.q);
            reply({
                ok: true
            });
        }
    });
})();
