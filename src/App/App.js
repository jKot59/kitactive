import './App.scss';
import UserWindow from '../Pages/registration/UserWindow';
import NavigationButton from '../components/navigation/NavigationButton';
import {Routes, Route, NavLink} from "react-router-dom";
import {connect} from 'react-redux';
import { exitAccount } from '../Services/fetch/fetch';
import {actionHideWindow, actionToken, actionSuccess} from '../Redux/action';
import {useState} from 'react';
import Error from '../components/ErrorMessage/ErrorMessage';
import Spinner from '../components/spinner/Spinner';
import PersonalArea from '../Pages/personal-area/PersonalArea';




function App(props) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  /* При нажатии на кнопку "Выход" : открываем окно авторизации, удаляем токен, убираем статус успешного
  входа на false */
  function exit () {
      setLoading(true)
      exitAccount('/api/logout', props.storeToken)
      .then(() => {
          props.actionHideWindow()
          props.actionToken('')
          props.actionSuccess(false)
          setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setError(true)
      })
  }

  function resetSuccess () {
    props.actionSuccess(false)
  }

  const ExitButton = () => {
    return (
      <NavLink 
        style={{textDecoration: 'none', display: props.storeHideWindow ? "block" : "none"}}
        to="/"
        onClick={exit}>
        <NavigationButton text="Выход"/>
      </NavLink>
    )
  }

  return (
    <div className="App">
        {error ? <Error/> : null}
        {/* по дефолту открыть страницу авторизации */}
        {/* при клике на кнопку регистрации открыть окно регистрации */}
        <div className="navigation-wrapper">
          {/* после успешной авторизации скрываем кнопки регистрация и авторизация. Открываем кнопку выход */}
          <NavLink 
            style={{textDecoration: 'none', display: props.storeHideWindow ? "none" : "block"}} 
            to="/registration"
            onClick={resetSuccess}>
            <NavigationButton text="Регистрация"/>
          </NavLink>
          <NavLink 
            style={{textDecoration: 'none', display: props.storeHideWindow ? "none" : "block"}} 
            to="/"
            onClick={resetSuccess}>
            <NavigationButton text="Авторизация"/>
          </NavLink>
          { loading ? <div><Spinner/> Выходим...</div> : <ExitButton/>}
        </div>
        <Routes>
          {/* страница с аккаунтом */}
        <Route exact path="/account" element={<PersonalArea/>}/>
        {/* окно регистрации/авторизации */}
        <Route exact path="/registration" element={<UserWindow/>}/>
        <Route exact path="/" element={<UserWindow type="authorization"/>}/>
        </Routes>
      </div>
  );
}

const mapStateToProps = (store) => {
  return {
      storeToken: store.token,
      storeHideWindow: store.hideWindow
  }
}
const mapDispatchToProps = {
  actionHideWindow,
  actionToken,
  actionSuccess
    
}

export default connect(mapStateToProps, mapDispatchToProps) (App);
