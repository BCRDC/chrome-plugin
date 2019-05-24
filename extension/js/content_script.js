

// var Request = require("sdk/request").Request;


(function () {

    const localStorage = window.localStorage;

    const Status = {
        Open: "1",
        Close: "0"
    }

    const autoSendingStatus = localStorage.getItem('autoSendingStatus') || Status.Open;



    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

            const { action, data } = request;
            switch (action) {
                case 'setAutoSendingStatus': {
                    localStorage.setItem('autoSendingStatus', data)
                    sendResponse({ farewell: "goodbye" });
                    break;
                }

                case 'syncDataToAbus': {
                    // localStorage.setItem('autoSendingStatus', data)
                    syncData().then(function (res) {
                        alertHtml(res);
                        sendResponse({ farewell: "goodbye" });
                    });

                    break;
                }

                case 'removeBottomAlert': {
                    alertRemove();
                    sendResponse();
                    break;
                }

                case 'getAutoSendingStatus': {
                    const currentAutoSendingStatus = localStorage.getItem('autoSendingStatus') || Status.Open;
                    chrome.runtime.sendMessage({
                        // autoSendingStatus: autoSendingStatus,
                        action: 'fetchedAutoSendingStatus',
                        data: currentAutoSendingStatus
                    }, function (response) {
                        sendResponse();
                        console.log(response);
                    });
                    break;
                }

                case 'getAbusResponse': {
                    chrome.runtime.sendMessage({
                        // autoSendingStatus: autoSendingStatus,
                        action: 'fetchedAbusResponse',
                        data: _responseCache
                    }, function (response) {
                        // sendResponse();
                        console.log(_responseCache);
                    });

                }
            }


        });



    const createGet = url => {
        let headers = new Headers({ "Accept": "application/json" });
        let init = { method: 'GET', headers };
        let request = new Request(url, init);

        return fetch(request).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return Promise.reject('Something went wrong on api server!');
            }
        });

    }

    const createPut = (url, input) => {

        let headers = new Headers({
            "Accept": "application/json",
            contentType: 'application/json; charset=utf-8'
        });
        let init = { method: 'PUT', headers, body: input };
        let request = new Request(url, init);

        return fetch(request // body data type must match "Content-Type" header
        ).then(response => {
            if (response.status === 200) {
                return response.text().then(function (text) {
                    const result = text ? JSON.parse(text) : {};
                    // errorInfo.ajaxStatus = response.status;
                    return Promise.resolve(result);
                });

            } else {
                return Promise.reject('Something went wrong on api server!');
            }
        }).catch(e => {
            return Promise.reject('Something went wrong on api server!');
        })
            ;

    }

    const getEnrollments = () => {
        const timestamp = (new Date()).getTime();
        return createGet(`/api/v3Enrollment/getList?__timestamp=${timestamp}`);
        // return new Promise(resolve => {
        //     $.get(`/api/v3Enrollment/getList?__timestamp=${timestamp}`, function (data) {
        //         resolve(data);
        //     });
        // });
    }

    const getDepartments = (enrollmentId) => {
        const timestamp = (new Date()).getTime();
        return createGet(`/api/v3Department/getDepartments?__timestamp=${timestamp}&enrollmentId=${enrollmentId}`);
        // return new Promise(resolve => {
        //     $.get(`/api/v3Department/getDepartments?__timestamp=${timestamp}&enrollmentId=${enrollmentId}`, function (data) {
        //         resolve(data);
        //     });
        // });
    }

    const getAccounts = (enrollmentId) => {
        const timestamp = (new Date()).getTime();
        return createGet(`/api/v3Enrollment/getAccounts?__timestamp=${timestamp}&enrollmentId=${enrollmentId}`);
        // return new Promise(resolve => {
        //     $.get(`/api/v3Enrollment/getAccounts?__timestamp=${timestamp}&enrollmentId=${enrollmentId}`, function (data) {
        //         resolve(data);
        //     });
        // });
    }

    const getSubsList = (enrollmentId) => {
        const timestamp = (new Date()).getTime();
        return createGet(`/api/v3Account/getSubsList?__timestamp=${timestamp}&enrollmentId=${enrollmentId}`);
        // return new Promise(resolve => {
        //     $.get(`/api/v3Account/getSubsList?__timestamp=${timestamp}&enrollmentId=${enrollmentId}`, function (data) {
        //         resolve(data);
        //     });
        // });
    }



    const putData = (input) => {

        // https://abusapi.chinacloudsites.cn/crawler/cache
        // https://abusapi-test.chinacloudsites.cn/crawler/cache
        return createPut('https://abusapi.chinacloudsites.cn/crawler/cache', JSON.stringify(input));
        // return createPut('https://abusapi-test.chinacloudsites.cn/crawler/cache', JSON.stringify(input));

        // var enc = new TextEncoder(); // always utf-8
        // // const array = enc.encode();
        // // const timestamp = (new Date()).getTime();
        // return new Promise(resolve => {
        //     $.ajax({
        //         url: 'http://localhost:56621/crawler/cache', // your api url
        //         contentType: 'application/json; charset=utf-8',

        //         // jQuery < 1.9.0 -> use type
        //         // jQuery >= 1.9.0 -> use method
        //         method: 'PUT', // method is any HTTP method
        //         data: JSON.stringify(input), // data as js object
        //         success: function(data) {
        //             resolve(data);
        //         }
        //     });
        // });
    }

    function syncData() {
        return getEnrollments().then(data => {
            console.log(data);
            const enroll = data[0];
            const { id } = enroll;
            return Promise.all([
                getDepartments(id),
                getAccounts(id),
                getSubsList(id)
            ]).then(d => {
                console.log(d);
                return putData({
                    enrollmentEntity: enroll,
                    departmentResult: d[0],
                    acctResult: d[1],
                    subResult: d[2]
                });

            });

        });
    }


    if (autoSendingStatus === Status.Open) {
        syncData();
    }


    var _responseCache = [];

    function alertHtml(abusResp) {
        const frame = $( "iframe[name='alertFrame']" )
        if (frame && frame.length > 0) {
            chrome.runtime.sendMessage({
                // autoSendingStatus: autoSendingStatus,
                action: 'fetchedAbusResponse',
                data: abusResp
            }, function (response) {
                // sendResponse();
                console.log(_responseCache);
            });
        } else {
            var iFrame1 = document.createElement("iframe");
            iFrame1.src = chrome.extension.getURL("./../html/alertInfo.html");
            iFrame1.name = "alertFrame";
            iFrame1.style.position = 'fixed';
            iFrame1.style.bottom = '30px';
            iFrame1.style.right = '20px';
            iFrame1.style.width = '600px';
            iFrame1.style.height = '270px';
            iFrame1.style.border = '0';
            iFrame1.style.zIndex = 9999;
            document.body.insertBefore(iFrame1, document.body.firstChild);
        }



        _responseCache = abusResp;

        // setTimeout(function(){
        //     chrome.runtime.sendMessage({
        //         // autoSendingStatus: autoSendingStatus,
        //         action: 'fetchedAbusResponse',
        //         data: abusResp
        //     }, function (response) {
        //         // sendResponse();
        //         console.log(abusResp);
        //     });
        // } ,2000);



        // $('a.abus-alert-hidden', top.frames["alertFrame"].document).click(function () {

        //     chrome.runtime.sendMessage({
        //         // autoSendingStatus: autoSendingStatus,
        //         action: 'removeBottomAlert',
        //         data: {}
        //     }, function (response) {
        //         sendResponse();
        //         console.log(response);
        //     });
        // });

        // 




    }

    function alertRemove() {
        // ('#frame_id',top.frames["frame_name"].document)
        // top.frames["frame_name"].remove();
        const frame = $( "iframe[name='alertFrame']" )
        frame.remove();
    }

})()




