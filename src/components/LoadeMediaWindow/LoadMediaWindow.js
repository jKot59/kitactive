import './loadMediaWindow.scss';
import {postMedia, getMedia} from '../../Services/fetch/fetch';
import {connect} from 'react-redux';
import {useState, useEffect} from 'react';
import {actionToggleMediaWindow, actionFiles, actionAmountOfFIles, actionDimensionsOfFiles} from '../../Redux/action';
import Spinner from '../spinner/Spinner';
import Error from '../../components/ErrorMessage/ErrorMessage';

function LoadMediaWindow (props) {
    // const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    function onCheckFiles (object) {
        // первоначально сбрасываем метки
        props.actionAmountOfFIles(false)
        props.actionDimensionsOfFiles(false)

        //  проверка на количество загружаемых файлов
        if (Object.keys(object).length < 20) {
            // устаовить в стор метку с длиной ОК
            console.log('length ok')
            props.actionAmountOfFIles(true)
        } else {
            // сбросить метку с длинной OK
            console.log('length big')
            props.actionAmountOfFIles(false)
            return
        } 

        // проверка на размер загружаемых файлов
        for (let key in object) {
            if (object[key].size < 1048576) {
                console.log('ok', object[key].size)
            } else if (object[key].size === undefined){
                continue
            } else {
                // обнулить формдату
                return
            }
            
        }
        // установить метку с размером файлов ОК
        props.actionDimensionsOfFiles(true)
    }

    function onSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setError(false)
        // если количество и размер файлов true то передаем форму в форм дата
        if (props.storeAmountOfFiles && props.actionDimensionsOfFiles) {
            let data = new FormData(e.target)
            console.log(e.target)
            // data.append('files', e.target.files)
            console.log(data.getAll('files'))

            postMedia('/api/media/upload', props.storeToken, data)
            .then( res => {
                console.log(res)
                setLoading(false)
            })
            .catch( e => {
                console.log(e)
                setError(true)
                setLoading(false)
            })


        }
        // getMedia('/api/media', props.storeToken)
        // .then((res) => console.log(res))
    }

    const LoadButton = () => {
        return (
            <button type="submit">Загрузить фаил</button>
        )
    }

    return (
        <div className="load-media-window">
            <div 
                className="cross"
                // при клике на крестик закрыть окно для загрузки файлов
                onClick={() => props.actionToggleMediaWindow(false)}>&#x2716;</div>
            <div className="load-media-window__descr">Размер каждого файла не должен превышать: 1 МБ</div>
            <form 
                className="load-media-window__form"
                onSubmit={onSubmit}>
                <input 
                    name="files"
                    type="file" 
                    multiple="multiple"
                    onChange={(e) => onCheckFiles(e.target.files)}/>
                    {error ? <Error/> : null}
                    {!error && loading ? <Spinner/> : <LoadButton/>}
                
            </form>
        </div>
    )
}

const mapStateToProps = (store) => {
    return {
        storeToken: store.token,
        storeFiles: store.files,
        storeAmountOfFiles: store.amountOfFiles,
        storeDimensionsOfFiles: store.dimensionsOfFiles,

    }
}

const mapDispatchToProps = {
    actionToggleMediaWindow,
    actionFiles,
    actionDimensionsOfFiles,
    actionAmountOfFIles
}

export default connect(mapStateToProps, mapDispatchToProps) (LoadMediaWindow)