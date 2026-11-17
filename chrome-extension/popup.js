const SITE = "https://mipolash-prog.github.io/polash-ai-os/";

function openRoute(route) {
    chrome.tabs.create({
        url: SITE + "#" + route
    });
    window.close();
}

document.getElementById("open").addEventListener("click", function() {
    chrome.tabs.create({
        url: SITE
    });
    window.close();
});

document.querySelectorAll("[data-route]").forEach(function(button) {
    button.addEventListener("click", function() {
        openRoute(button.dataset.route);
    });
});

const field = document.getElementById("q");
const status = document.getElementById("status");

function searchTools() {
    const term = field.value.trim();
    if (!term) {
        field.focus();
        return;
    }
    const target = SITE + "?toolq=" + encodeURIComponent(term) + "#tools";
    chrome.tabs.query({
        url: SITE + "*"
    }, function(tabs) {
        const tab = tabs[0];
        if (!tab) {
            chrome.tabs.create({
                url: target
            });
            window.close();
            return;
        }
        chrome.tabs.update(tab.id, {
            active: true
        });
        chrome.tabs.sendMessage(tab.id, {
            type: "polash-search",
            q: term
        }, function() {
            if (chrome.runtime.lastError) {
                chrome.tabs.update(tab.id, {
                    url: target
                });
            }
            window.close();
        });
    });
}

document.getElementById("find").addEventListener("click", searchTools);
field.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchTools();
    }
});
status.textContent = "প্রস্তুত — Polash AI OS";
