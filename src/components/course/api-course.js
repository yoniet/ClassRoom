
export const create = async (params, credentials, course) => {
    try {
        let response = await fetch('/api/courses/by/' + params.userId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: course
        })
            return response.json()
    } catch (err) {
        console.log(err)
    }
}

// the fetch method that is needed in order to retrieve a list of courses
// by a specific "instructor" 
export const listByInstructor = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/courses/by/' + params.userId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        
        return response.json()
    } catch (err) {
        console.log(err)
    }
}

export const read = async (params, signal) => {
    try {
        let response = await fetch ('/api/courses/' + params.courseId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

export const update = async (params, credentials, course) => {
    try {
        let response = await fetch('/api/courses/' + params.courseId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: course
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

export const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/courses/' + params.courseId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

export const newLesson = async (params, credentials, lesson) => {
    try {
        let response = await fetch('/api/courses/' + params.courseId + '/lesson/new', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({lesson: lesson})
        })
        return response.json()
    } catch (err) {
        console.log(err)
    }
}

export const listPublished = async (signal) => {
    try {
        let response = await fetch('/api/courses/published', {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}