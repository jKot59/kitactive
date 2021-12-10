const initialState = {
    token: '',
    hideWindow: false, 
    success: false,
    files: [],
    mediaWindow: false,
    amountOfFiles: false,
    dimensionsOfFiles: false,
    chosenForDelete: null
}


function reducer (state = initialState, action) {

    switch (action.type) {
        case 'hideWindow':
            return {
                ...state,
                hideWindow: !state.hideWindow
            }

        case 'token':

            return {
                ...state,
                token: action.payload
            }
        case 'success':
            return {
                ...state,
                success: action.payload
            }
        case 'files':
            return {
                ...state,
                files: action.payload
            }
        case 'toggleMediaWindow':
            return {
                ...state,
                mediaWindow: action.payload
            }
        case 'amountOfFiles':
            return {
                ...state,
                amountOfFiles: action.payload
            }
        case 'dimensionsOfFiles':
            return {
                ...state,
                dimensionsOfFiles: action.payload
            }
        case 'chosenForDelete':
            return {
                ...state,
                chosenForDelete: action.payload
            }
        default:
            return state
    }
}

export default reducer