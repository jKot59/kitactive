import React, { useState} from 'react';
import './userWindow.scss';
import {postInfo} from '../../Services/fetch/fetch';
import Spinner from '../../components/spinner/Spinner';
import Error from '../../components/ErrorMessage/ErrorMessage';
import {connect} from 'react-redux';
import {actionHideWindow, actionToken, actionSuccess} from '../../Redux/action';
import { Navigate } from 'react-router-dom';

function UserWindow (props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [redirecting, setRedirecting] = useState(false)


    function onSubmit (e) {
        e.preventDefault()
        setLoading(true)

        // проверяем пропс на тип входа и вызываем окно регистрации / авторизации
        if (props.type){
           requestCicle('/api/login', e.target)
    
        } else {
            requestCicle('/api/register', e.target)
        }
    }

    // делаем запрос на сервер для авторизации / регистрации
    function requestCicle (address, object) {
        // отображаем спинер загрузки
        setLoading(true)
        setError(false)

        postInfo(address, object)
        .then((res) => {
            console.log(res)  // выводим токен в консоль для проверки
            props.actionToken(res.token) // отправляет токен в store
            setLoading(false)
            props.actionSuccess(true) // изменияем успех на true для вывода сообщения
            //чере 1 сек. отправляем экшн для изменения булина закрытия окна после успешной авторизации
            if (res.token) {
                setTimeout(() => {
                    props.actionHideWindow()
                    setRedirecting(true)
                }, 1000)
            }
            
        })
        .catch(e => {
            console.log(e)
            setError(true)
            setLoading(false)
        })
    }

    const SubmitBtn = () => {
        /* меняем текст кнопки при выборе формы регистрации или авторизации */
        return (
            <button type="submit">{props.type ? "Авторизация" : "Регистрация"}</button>
        )
    }
    const Success = () => {
        // в случаи успеха рендерим вместо кнопки сообщение об успехе или успехе регистрации
        return (
            props.storeToken ? <span style={{color: 'green', margin: '10px auto 0', gridColumn: '1 / 3'}}>Успешно!</span> : 
            <span style={{color: 'green', margin: '10px auto 0', gridColumn: '1 / 3', textAlign: "center"}}>Успешно!<div>Теперь выполните авторизацию.</div></span>
        )
    }


    return (
        <div className="userWindow" style={{display: props.storeHideWindow ? "none" : "block"}}> 
            <form onSubmit={onSubmit} className="userWindow__form">
                {/* добавляем/убираем поле с именем для регистрации*/}
                <label htmlFor="name" style={{display: props.type ? "none" : "block" }}>Имя</label>
                <input 
                    id="name" 
                    name="name" 
                    type="text" 
                    className="name" 
                    style={{display: props.type ? "none" : "block" }} />
                <label htmlFor="email">Email</label>
                <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    className="email" />
                <label htmlFor="password">Пароль</label>
                <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    className="password" />
                {error ? <><Error/> <SubmitBtn/></> : null}
                {!loading && !error && props.storeSuccess ? <Success/> : <SubmitBtn/>}
                {!error && loading ? <Spinner/> : null}
                {/* редирект на страницу аккаунта  в случае успешной авторизации*/}
                {redirecting ? <Navigate to='/account'/> : null}

            </form>
        </div>
    )
}

const mapStateToProps = (store) => {
    return {
       storeHideWindow: store.hideWindow,
       storeToken: store.token,
       storeSuccess: store.success
    } 
}

const mapDispatchToProps = {
    actionHideWindow,
    actionToken,
    actionSuccess

}

export default connect(mapStateToProps, mapDispatchToProps) (UserWindow)