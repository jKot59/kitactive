const _base = 'https://test.kitactive.ru:8089'

/* главная функция для переиспользования */

async function general (url, data = null, token = null, method) {
    const res = await fetch(_base + url, {
        method: method,
        body: data,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) {
        throw new Error (`POST to ${_base}${url} has status ${res.status}`)
    }

    return await res.json()
}

/* РЕГИСТРАЦИЯ/ АВТОРИЗАЦИЯ  */

async function postInfo (url, data) {
    return await general(url, new FormData(data), null, "POST")
}

/* ВЫЙТИ ИЗ АККАУНТА */

async function exitAccount (url, token) {
    return await general(url, null, token, "POST")
}

/* ПОЛУЧИТЬ ФАЙЛЫ */

async function getMedia (url, token) {
    return await general(url, null, token, "GET")
}

/* ОТПРАВИТЬ ФАЙЛЫ  */

async function postMedia (url, token, data) {
    return await general(url, data, token, "POST") // в data уже должен приходить формат FormData
}

/* УДАЛИТЬ ФАЙЛЫ */

async function deleteMedia (url, token) {
    return await general(url, null, token, "DELETE")
}

export {postInfo, exitAccount, getMedia, postMedia, deleteMedia}