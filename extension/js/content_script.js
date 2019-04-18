
const getEnrollments = () => {
    const timestamp = (new Date()).getTime();
    return new Promise(resolve => {
        $.get(`/api/v3Enrollment/getList?__timestamp=${timestamp}`, function (data) {
            resolve(data);
        });
    });
}

const getDepartments = (enrollmentId) => {
    const timestamp = (new Date()).getTime();
    return new Promise(resolve => {
        $.get(`/api/v3Department/getDepartments?__timestamp=${timestamp}&enrollmentId=${enrollmentId}`, function (data) {
            resolve(data);
        });
    });
}

const getAccounts = (enrollmentId) => {
    const timestamp = (new Date()).getTime();
    return new Promise(resolve => {
        $.get(`/api/v3Enrollment/getAccounts?__timestamp=${timestamp}&enrollmentId=${enrollmentId}`, function (data) {
            resolve(data);
        });
    });
}

const getSubsList = (enrollmentId) => {
    const timestamp = (new Date()).getTime();
    return new Promise(resolve => {
        $.get(`/api/v3Account/getSubsList?__timestamp=${timestamp}&enrollmentId=${enrollmentId}`, function (data) {
            resolve(data);
        });
    });
}



const putData = (input) => {
    var enc = new TextEncoder(); // always utf-8
    // const array = enc.encode();
    // const timestamp = (new Date()).getTime();
    return new Promise(resolve => {
        $.ajax({
            url: 'http://localhost:56621/crawler/cache', // your api url
            contentType: 'application/json; charset=utf-8',
            
            // jQuery < 1.9.0 -> use type
            // jQuery >= 1.9.0 -> use method
            method: 'PUT', // method is any HTTP method
            data: JSON.stringify(input), // data as js object
            success: function(data) {
                resolve(data);
            }
        });
    });
}


getEnrollments().then(data => {
    console.log(data);
    const enroll = data[0];
    const { id } = enroll;
    Promise.all([
        getDepartments(id),
        getAccounts(id),
        getSubsList(id)
    ]).then(d =>{
        putData({
            enrollmentEntity: enroll,
            departmentResult: d[0],
            acctResult: d[1],
            subResult: d[2]
        });
        console.log(d);
    });
    
});

