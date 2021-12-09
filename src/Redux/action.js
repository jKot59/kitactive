// экшн для закрытия окна авторизации
const actionHideWindow = () => {
    return {
        type: 'hideWindow'
    }
}

// экшн для отправки токена в стор
const actionToken = (token) => {
    return {
        type: 'token',
        payload: token
    }
}

// экшн для изменения булина выхода
const actionSuccess = (bool) => {
    return {
        type: 'success',
        payload: bool
    }
}

// экшн для изменения булина для открытия окна с отправкой медиа файлов
const actionToggleMediaWindow = (bool) => {
    return {
        type: 'toggleMediaWindow',
        payload: bool
    }
}

// экшн для изменения массив с файлами
const actionFiles = (array) => {
    return {
        type: 'files',
        payload: array
    }
}

// экшн для отображение допустимого количесвта файлов
const actionAmountOfFIles = (bool) => {
    return {
        type: 'amountOfFiles',
        payload: bool
    }
}
// экшн для отображения допустимого размера фалов
const actionDimensionsOfFiles = (bool) => {
    return {
        type: 'dimensionsOfFiles',
        payload: bool
    }
}

export {actionHideWindow, actionToken, actionFiles, actionSuccess, actionToggleMediaWindow, actionAmountOfFIles, actionDimensionsOfFiles}