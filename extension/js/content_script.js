

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
                    syncData().then(function(){
                        sendResponse({ farewell: "goodbye" });
                    });
                    
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
                return response.json();
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

        return createPut('https://abusapi-dev.chinacloudsites.cn/crawler/cache', JSON.stringify(input));

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
            Promise.all([
                getDepartments(id),
                getAccounts(id),
                getSubsList(id)
            ]).then(d => {
                return putData({
                    enrollmentEntity: enroll,
                    departmentResult: d[0],
                    acctResult: d[1],
                    subResult: d[2]
                });
                console.log(d);
            });

        });
    }


    if (autoSendingStatus === Status.Open) {
        syncData();
    }


})()




