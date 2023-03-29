
export const create = async (params, credentials) => {

    try {
        let response = await fetch('/api/enrollment/new/' + params.courseId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

export const read = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/enrollment/' + params.enrollmentId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}