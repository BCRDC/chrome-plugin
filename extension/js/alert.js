


(function () {
    $('a.abus-alert-hidden').click(function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            // chrome.tabs.sendMessage(activeTab.id, {
            //     //  setAutoSendingStatus: status,
            //     action: 'setAutoSendingStatus',
            //     data: status
            // });
            chrome.tabs.sendMessage(activeTab.id, {
                // autoSendingStatus: autoSendingStatus,
                action: 'removeBottomAlert',
                data: {}
            }, function (response) {
                console.log(response);
            });
        });

    });


    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        // chrome.tabs.sendMessage(activeTab.id, {
        //     //  setAutoSendingStatus: status,
        //     action: 'setAutoSendingStatus',
        //     data: status
        // });
        chrome.tabs.sendMessage(activeTab.id, {
            // autoSendingStatus: autoSendingStatus,
            action: 'getAbusResponse',
            data: {}
        }, function (response) {
            console.log(response);
        });
    });


    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            // console.log(sender.tab ?
            //     "from a content script:" + sender.tab.url :
            //     "from the extension");
            const { action, data } = request;
            switch (action) {
                case 'fetchedAbusResponse': {
                    const now = new Date();
                    var trArr = [];
                    trArr.push(`<table class="table table-hover table-sm">
                    <tr><th>订阅名称</th><th>订阅ID</th><tr>`);
                    const len = data.length;
                    if (len === 0) {
                        trArr.push(`<tr><td colspan="2"> <p style="color:red">刷新时间${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}， 数据已经同步或者没有需要同步的订阅。 </p> </td></tr>`);
                    } else {
                        for (i = 0; i < len; i++) {
                            const { item1, item2 } = data[i];
                            trArr.push(`<tr>
                            <td>${item2}</td>
                            <td>${item1}</td>
                            </tr>`);
                        }
                    }


                    trArr.push('</table>');
                    console.log(data);
                    $('#table-entry').html(trArr.join(''));
                    sendResponse({ farewell: "sync subscritions is done!" });
                    break;
                }
                default: break;
            }
        });

})()

