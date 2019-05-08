


(function () {
    $('a.abus-hidden').click(function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            // chrome.tabs.sendMessage(activeTab.id, {
            //     //  setAutoSendingStatus: status,
            //     action: 'setAutoSendingStatus',
            //     data: status
            // });
            chrome.tabs.sendMessage(activeTab.id, {
                // autoSendingStatus: autoSendingStatus,
                action: 'removeBottomInform',
                data: {}
            }, function (response) {
                console.log(response);
            });
        });
    
    });

})()

