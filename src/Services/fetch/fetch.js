const _base = 'https://test.kitactive.ru:8089'

/* РЕГИСТРАЦИЯ/ АВТОРИЗАЦИЯ  */

async function postInfo (url, data) {
    const res = await fetch(_base + url, {
        method: "POST",
        body: new FormData(data),
    })

    if (!res.ok) {
        throw new Error (`POST to ${_base}${url} has status ${res.status}`)
    }

    return await res.json()
}

/* ВЫЙТИ ИЗ АККАУНТА */

async function exitAccount (url, token) {
    const res = await fetch(_base + url, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) {
        throw new Error (`POST to ${_base}${url} has status ${res.status}`)
    }

    return await res.json()
}

/* ПОЛУЧИТЬ ФАЙЛЫ */

async function getMedia (url, token) {
    const res = await fetch(_base + url, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) {
        throw new Error (`POST to ${_base}${url} has status ${res.status}`)
    }

    return await res.json()
}

/* ОТПРАВИТЬ ФАЙЛЫ  */

async function postMedia (url, token, array) {
    const res = await fetch(_base + url, {
        method: "POST",
        body: array,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

    if (!res.ok) {
        throw new Error (`POST to ${_base}${url} has status ${res.status}`)
    }

    return await res.json()
}

export {postInfo, exitAccount, getMedia, postMedia}