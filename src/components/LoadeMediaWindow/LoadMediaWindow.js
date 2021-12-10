import './loadMediaWindow.scss';
import {postMedia, getMedia} from '../../Services/fetch/fetch';
import {connect} from 'react-redux';
import {useState} from 'react';
import {actionToggleMediaWindow, actionFiles, actionAmountOfFIles, actionDimensionsOfFiles} from '../../Redux/action';
import Spinner from '../spinner/Spinner';
import Error from '../../components/ErrorMessage/ErrorMessage';

function LoadMediaWindow (props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    function onCheckFiles (object) {
        // первоначально сбрасываем метки максимального количества файлов и максимального размера отправляемых файлов
        props.actionAmountOfFIles(false)
        props.actionDimensionsOfFiles(false)
        // для хранения общего размера отправляемых файлов
        let totalSize = 0

        //  проверка на количество загружаемых файлов
        if (Object.keys(object).length <= 20 - props.storeFiles.length) {
            // устаовить в стор метку с количаством отправляемых файлов ОК
            props.actionAmountOfFIles(true)
        } else {
            // сбросить метку с количеством OK
            props.actionAmountOfFIles(false)
            return
        } 

        // проверка на размер загружаемых файлов
        for (let key in object) {
            // если размер файла меньше 1мб то продолжаем ссумировать вес следующих файлов
            if (object[key].size < 1048576) {
                totalSize += +object[key].size
            } else if (object[key].size === undefined){
                continue
            } else {
                // обнулить формдату
                return
            }    
        }


        // установить метку с размером файлов ОК если общий вес файлов меньше 1мб
        if(totalSize <= 1048576) {
            props.actionDimensionsOfFiles(true)
        }
    }

    function onSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setError(false)
        // если количество и размер файлов true то передаем форму в форм дата
        if (props.storeAmountOfFiles && props.actionDimensionsOfFiles) {
            let data = new FormData(e.target)

            postMedia('/api/media/upload', props.storeToken, data)
            .then(() => {
                setLoading(false)
                // после успешной отправки файлов делаем запрос для обновления списка файлов и закрываем окно
                getMedia('/api/media', props.storeToken)
                .then((res) => props.actionFiles(res.files))
                .then(() => props.actionToggleMediaWindow(false))
            })
            .catch( e => {
                console.log(e)
                setError(true)
                setLoading(false)
            })

        } else {
            setError(true)
        }
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
            <div className="load-media-window__descr">Общий размер файлов не должен превышать: 1 МБ</div>
            <form 
                className="load-media-window__form"
                onSubmit={onSubmit}>
                <input 
                    name="files[]"
                    type="file" 
                    multiple="multiple"
                    onChange={(e) => onCheckFiles(e.target.files)}/>
                    {error ? <><Error/><LoadButton/></> : null}
                    {!error && loading ? <Spinner/> : null}
                    {!error && !loading ? <LoadButton/> : null}
                
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