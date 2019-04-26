(function () {
    // $("input.autoSending").prop('checked',  localStorage.getItem('autoSendingStatus')=== 'Open');

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            //  setAutoSendingStatus: status,
            action: 'getAutoSendingStatus',
            data: null
        });
    });

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
            const { action, data } = request;
            switch (action) {
                case 'fetchedAutoSendingStatus': {
                    $("input.autoSending").prop('checked', data === 'Open');
                    sendResponse({ farewell: "goodbye" });
                    break;
                }
                default: break;
            }
            sendResponse();

        });

    $('input.autoSending').click(function () {
        let status = 'Open';
        if (!this.checked) {
            status = 'Close';
        }

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
                //  setAutoSendingStatus: status,
                action: 'setAutoSendingStatus',
                data: status
            });
        });
    });
})()

