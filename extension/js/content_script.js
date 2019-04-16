
const getEnrollments = () => {
    return new Promise(resolve => {
        $.get("/api/v3Enrollment/getList?__timestamp=1555404715727", function (data) {
            resolve(data);
        });
    });
}

const getDepartments = (enrollmentId) => {
    return new Promise(resolve => {
        $.get(`/api/v3Department/getDepartments?__timestamp=1555405567171&enrollmentId=${enrollmentId}`, function (data) {
            resolve(data);
        });
    });
}

const getAccounts = (enrollmentId) => {
    return new Promise(resolve => {
        $.get(`/api/v3Enrollment/getAccounts?__timestamp=1555405677990&enrollmentId=${enrollmentId}`, function (data) {
            resolve(data);
        });
    });
}

const getSubsList = (enrollmentId) => {
    return new Promise(resolve => {
        $.get(`/api/v3Account/getSubsList?__timestamp=1555405727844&enrollmentId=${enrollmentId}`, function (data) {
            resolve(data);
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
        console.log(d);
    });
    
});

