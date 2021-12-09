import './personalArea.scss';
import {useState, useEffect} from 'react';
import {getMedia, postMedia} from '../../Services/fetch/fetch';
import Spinner from '../../components/spinner/Spinner';
import Error from '../../components/ErrorMessage/ErrorMessage';
import {actionHideWindow, actionToken, actionSuccess, actionFiles, actionToggleMediaWindow} from '../../Redux/action';
import {connect} from 'react-redux';
import LoadMediaWindow from '../../components/LoadeMediaWindow/LoadMediaWindow';
import { Navigate } from 'react-router-dom';

function PersonalArea (props) {

    useEffect(() => {
        // если токен получен, сделать первоначальный запрос на получение файлов
        // без токена произойдет редирект на главную
        if(props.storeToken) {
            getMedia('/api/media', props.storeToken)
            .then((res) => {
                props.actionFiles(res.files)
                console.log(props.storeFiles)
            })
        }
    }, [])

    const ItemBuilder = (props) => {
        return props.array.map( item => {
            return (
                <div 
                    key={item.id} 
                    // добавляем/убираем класс активности при клике на карточку файла
                    onClick={(e) => e.target.classList.contains('active') ?
                        e.target.className='personal-area__show-item' : e.target.className='personal-area__show-item active'}>
                    <div>{item.name}</div>
                    <div>{item.filename}</div>
                    <div>{item.mimeType}</div>
                    <div>{item.url}</div>
                    <div>{item.createdAt}</div>
                </div>
            )
        })
    }

    return (
        <div className="personal-area">
            {props.storeToken ?  null : <Navigate to='/'/>}
            {props.storeMediaWindow ? <LoadMediaWindow/> : null}
            <div className="container">
                <div className="personal-area__grid">
                    <div className="personal-area__buttons">
                        <div className="personal-area__counter">Осталось файлов <span>{20 - props.storeFiles.length}</span></div>
                        <div 
                            className="personal-area__loading"
                            // при клике открыть окно для загрузки файлов
                            onClick={() => props.actionToggleMediaWindow(true)}>Загрузить файлы</div>
                        <div className="personal-area__remove">Удалить</div>
                    </div>
                    <div className="personal-area__show">
                        <div className="personal-area__show-item">1</div>
                        <div className="personal-area__show-item">1</div>
                        <div className="personal-area__show-item">1</div>
                        <div className="personal-area__show-item">1</div>
                
                        {/* перебираем все полученные файлы и строим карточки*/}
                        { props.storeFiles ? <ItemBuilder array={props.storeFiles}/> : null}
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
        storeMediaWindow: store.mediaWindow
    }
}

const mapDispatchToProps = {
    actionToken,
    actionFiles,
    actionToggleMediaWindow

}
export default connect (mapStateToProps, mapDispatchToProps) (PersonalArea)