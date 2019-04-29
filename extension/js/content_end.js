
(function () {

    var iFrame = document.createElement("iframe");
    iFrame.src = chrome.extension.getURL("./../html/contentInform.html");

    iFrame.style.position = 'fixed';
    iFrame.style.bottom = '50px';
    iFrame.style.right = '20px';
    iFrame.style.width = '500px';   
    iFrame.style.height = '140px';
    iFrame.style.border = '0';
    // iFrame.style.backgroundColor = 'darkred';

    iFrame.style.zIndex = 1000;


    const Status = {
        Open: "Open",
        Close: "Close"
    }

    const autoInformStatus = localStorage.getItem('autoInformStatus') || Status.Open;


    if (autoInformStatus === Status.Open){
        document.body.insertBefore(iFrame, document.body.firstChild);
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

            const { action, data } = request;
            switch (action) {
                case 'removeBottomInform': {
                    localStorage.setItem('autoInformStatus', Status.Close)
                    document.body.firstChild.remove();
                    break;
                }
            }
            sendResponse();

        });





})()

