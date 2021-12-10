import './personalArea.scss';
import {useState, useEffect} from 'react';
import {getMedia, deleteMedia} from '../../Services/fetch/fetch';
import Spinner from '../../components/spinner/Spinner';
import {actionToken, actionFiles, actionToggleMediaWindow, actionChosenForDelete} from '../../Redux/action';
import {connect} from 'react-redux';
import LoadMediaWindow from '../../components/LoadeMediaWindow/LoadMediaWindow';
import { Navigate } from 'react-router-dom';

function PersonalArea (props) {
    const [deleting, setDeleting] = useState(false) 
    useEffect(() => {
        // если токен получен, сделать первоначальный запрос на получение файлов пользователя
        // без токена произойдет редирект на главную
        if(props.storeToken) {
            getMedia('/api/media', props.storeToken)
            .then((res) => props.actionFiles(res.files))
        }
    }, [])
    
    const ItemBuilder = (props) => {
        return props.array.map( item => {
            return (
                <div 
                    key={item.id} 
                    // при клике на карточку отправляем ее id в стор, изменяем класс активности и добавляем возможность удалить фаил с этим id с сервера
                    onClick={() => onActive(item.id)}
                    className={item.id === props.activeItemId ? 'personal-area__show-item active' : 'personal-area__show-item'}>
                    
                    <div><span>Имя файла:</span> {item.name}</div>
                    <div><span>Полное имя:</span> {item.fileName}</div>
                    <div><span>MIME: </span>{item.mimeType}</div>
                    <div><span>Адрес:</span> {item.url}</div>
                    <div><span>Дата создания:</span> {item.createdAt}</div>
                </div>
            )
        })
    }

    function onActive(id) {
        props.actionChosenForDelete(id)
    }
    
    function onDelete() {
        // вывести спинер во время удаления файла
        setDeleting(true)
        deleteMedia('/api/media/' + props.storeChosenForDelete, props.storeToken)
        // запрашиваем новый список файлов с сервера после удаления
        .then(() => getMedia('/api/media', props.storeToken))
        // обновляем в сторе файлы
        .then((res) => props.actionFiles(res.files))
        .then(() => {setDeleting(false)})
        // сбрасываем id удаляемого файла ведь фаил с таким id только что удалили
        .then(() => props.actionChosenForDelete(''))
        .catch((e) => {
            console.log(e)
            setDeleting(false)
        })

    }

    return (
        <div className="personal-area">
            {props.storeToken ?  null : <Navigate to='/'/>}
            {props.storeMediaWindow ? <LoadMediaWindow/> : null}
            <div className="container">
                <div className="personal-area__grid">
                    <div className="personal-area__buttons">
                        <div className="personal-area__counter">Осталось файлов для загрузки <span>{20 - props.storeFiles.length}</span></div>
                        {props.storeFiles.length < 20 ? <div 
                            className="personal-area__loading"
                            // при клике открыть окно для загрузки файлов
                            onClick={() => props.actionToggleMediaWindow(true)}>Загрузить файлы</div> : null}
                            {/* подставляем спинер во время удаления */}
                        {deleting ? <Spinner/> : <div 
                            className="personal-area__remove"
                            // выполняем удалени только если выбран фаил для удаления
                            onClick={props.storeChosenForDelete ? onDelete : null}
                            // делаем кнопку удаления неактивной если не выбран фаил для удаления
                            style={{backgroundColor: props.storeChosenForDelete ? "white" : "grey" }}>Удалить</div>}
                    </div>
                    <div className="personal-area__show">
                        {/* перебираем все полученные файлы и строим карточки*/}
                        { props.storeFiles ? <ItemBuilder array={props.storeFiles} activeItemId={props.storeChosenForDelete}/> : null}
                    </div>
                </div>

            </div>
        </div>
    )
}

const mapStateToProps = (store) => {
    return {
        storeToken: store.token,
        storeFiles: store.files,
        storeMediaWindow: store.mediaWindow,
        storeChosenForDelete: store.chosenForDelete
    }
}

const mapDispatchToProps = {
    actionToken,
    actionFiles,
    actionToggleMediaWindow,
    actionChosenForDelete

}
export default connect (mapStateToProps, mapDispatchToProps) (PersonalArea)