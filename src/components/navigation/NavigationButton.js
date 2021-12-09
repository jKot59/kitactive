import './navigationButton.scss';

function NavigationButton (props) {
    return (
        <div className="navigationButton">
            {props.text}
        </div>
    );
}



export default NavigationButton