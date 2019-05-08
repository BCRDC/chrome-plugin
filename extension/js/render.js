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
            const { action, data: status } = request;
            switch (action) {
                case 'fetchedAutoSendingStatus': {
                    $(`input[name='exampleRadios'][value=${status}]`).prop('checked', true);
                    if (status === '0') {
                        $("p.syncButton")[0].style.display = '';
                    } else {
                        $("p.syncButton")[0].style.display = 'none';
                    }
                    sendResponse({ farewell: "goodbye" });
                    break;
                }
                default: break;
            }
            sendResponse();

        });

    $("input[name='exampleRadios']").click(function () {
        let status = $("input[name='exampleRadios']:checked").val();
        if (status === '0') {
            $("p.syncButton")[0].style.display = '';
        } else {
            $("p.syncButton")[0].style.display = 'none';
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

    $('a.manuallySendingButton').click(function () {

        let select = $("input[name='exampleRadios']:checked").val();

        if (select === "0") {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                // chrome.tabs.sendMessage(activeTab.id, {
                //     //  setAutoSendingStatus: status,
                //     action: 'setAutoSendingStatus',
                //     data: status
                // });
                chrome.tabs.sendMessage(activeTab.id, {
                    // autoSendingStatus: autoSendingStatus,
                    action: 'syncDataToAbus',
                    data: {}
                }, function (response) {
                    console.log(response);
                });
            });
        }
    });

})()

