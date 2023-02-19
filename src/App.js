import { useState, useEffect} from 'react';
import './App.css';

const useValidation = (value, validations) => {
    const [isEmpty, setIsEmpty] = useState(true);
    const [minLengthError, setMinLengthError] = useState(false);
    const [maxLengthError, setmaxLengthError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
                case 'minLength':
                    value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false);
                    break;
                case 'isEmpty':
                    value ? setIsEmpty(false) : setIsEmpty(true);
                    break;
                case 'maxLength':
                    value.length > validations[validation] ? setmaxLengthError(true) : setmaxLengthError(false);
                    break;
                case 'isEmail':
                    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    re.test(String(value).toLowerCase()) ? setEmailError(false) : setEmailError(true);
                default:
            }
        }
    }, [value])

    useEffect(() => {
        if (isEmpty || minLengthError || maxLengthError || emailError) {
            setFormValid(false);
        } else {
            setFormValid(true);
        }
    }, [isEmpty, minLengthError, maxLengthError, emailError])

    return {
        isEmpty,
        minLengthError,
        maxLengthError,
        emailError,
        formValid
    }
}


const useInput = (initialValue, validations) => {
    const [value, setValue] = useState(initialValue);
    const [isDirty, setDirty] = useState(false);
    const valid = useValidation(value, validations);

    const onChange = (e) => {
        setValue(e.target.value);
    }

    const onBlur = (e) => {
        setDirty(true)
    }

    return {
        value,
        onChange,
        onBlur,
        isDirty,
        ...valid
    }
}


export default function App() {
    const email = useInput('', {isEmpty: true, minLength: 3, isEmail: true});
    const password = useInput('', {isEmpty: true, minLength: 5, maxLength: 10});

    return (
        <div className='App'>
            <form>
                <h1>Регистрация</h1>

                {(email.isDirty && email.isEmpty) && <div style={{color: 'red'}}> Поле не может быть пустым </div>}
                {(email.isDirty && email.minLengthError) && <div style={{color: 'red'}}> email должен быть больше 3 </div>}
                {(email.isDirty && email.emailError) && <div style={{color: 'red'}}> некорректный email </div>}
                <input value={email.value} onChange={email.onChange} onBlur={email.onBlur} name='email' type="text" placeholder='Введите email' />

                {(password.isDirty && password.isEmpty) && <div style={{color: 'red'}}> Поле не может быть пустым </div>}
                {(password.isDirty && password.minLengthError) && <div style={{color: 'red'}}> пароль должен быть больше 3 </div>}
                {(password.isDirty && password.maxLengthError) && <div style={{color: 'red'}}> пароль должен быть меньше 10 </div>}
                <input value={password.value} onChange={password.onChange} onBlur={password.onBlur} name='password' type="password" placeholder='Введите пароль' />

                <button disabled={!email.formValid || !password.formValid} type='submit'>Click</button>
            </form>
        </div>
    )
}

