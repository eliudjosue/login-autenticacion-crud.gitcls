import React from 'react'
import { auth, db } from '../firebase'
import { withRouter } from 'react-router-dom'

const Login = (props) => {
    const [email, setEmail] = React.useState('')
    const [pass, setPass] = React.useState('')
    const [ error, setError] = React.useState(null)
    const [esRegistro, setEsRegistro] = React.useState(true)

    const procesarDatos = (e) => {
        e.preventDefault()
        if(!email.trim()){
            // console.log('Ingrese Email')
            setError('Ingrese Email')
            return
        }
        if(!pass.trim()){
            // console.log('Ingrese Password')
            setError('Ingrese Password')
            return
        }
        if(pass.length < 6){
            // console.log('ingrese password mayor a 6 caracteres')
            setError('ingrese password mayor a 6 caracteres')
            return
        }

        // console.log('Pansando todas las validaciones')

        setError(null)

        if(esRegistro){
            registrar()
        }else{
            Login()
        }
        
    }

    const Login = React.useCallback(async () => {
           try {
               const res = await auth.signInWithEmailAndPassword(email, pass)
               console.log(res.user)
               setEmail('')
               setPass('')
               setError(null)
               props.history.push('/admin')
           } catch (error) {
               console.log(error)
               if(error.code === 'auth/user-not-found'){
                setError('El email no existe')
                }
                if(error.code === 'auth/wrong-password'){
                    setError('La contraseña es invalida')
                }
           }
        }, [email, pass, props.history])

    const registrar = React.useCallback(async () => {
        try {
           const res = await auth.createUserWithEmailAndPassword(email, pass) 
           console.log(res.user)
           await db.collection('usuarios').doc(res.user.email).set({
               email: res.user.email,
               uid: res.user.uid
           })
           props.history.push('/admin')
           await db.collection(res.user.uid).add()
           setEmail('')
           setPass('')
           setError(null)
         
        } catch (error) {
            console.log(error)
            if(error.code === 'auth/invalid-email'){
                setError('El email no es valido')
            }
            if(error.code === 'auth/email-already-in-use'){
                setError('El email ya ha sido registrado')
            }
            
        }
    }, [email, pass, props.history])
    return (
        <div className='mt-5'>
            <h3 className="text-center">
                {
                    esRegistro ? 'Registro de usuarios' : 'Login de Acceso'
                }
            </h3>
            <hr/>
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    
                    <form onSubmit={procesarDatos}>
                        {
                            error ? (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            ) : null
                        }
                        <input 
                            type="email"
                            className='form-control mb-2'
                            placeholder='Ingrese Email'
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                        />
                        <input 
                            type="password"
                            className='form-control mb-2'
                            placeholder='Ingrese password'
                            onChange={e => setPass(e.target.value)}
                            value={pass}
                        />
                        <button 
                        className="btn btn-dark col-12 btn-lg mx-auto mb-2"
                        type='submit'
                        >
                            {
                                esRegistro ? 'Registrarse' : 'Iniciar Sesion'
                            }
                        </button>
                        <button 
                            onClick={() => setEsRegistro(!esRegistro)}
                            className="btn btn-info col-12 btn-sm mx-auto "
                            type='button'>
                                {
                                    esRegistro ? '¿Estas registrado?' : '¿No tienes cuenta?'
                                }
                        </button>
                        {
                            !esRegistro ? (
                                <button 
                            onClick={() => props.history.push('/reset')}
                            className="btn btn-danger col-12 btn-sm mx-auto mt-2 "
                            type='button'>
                                ¿Olvidaste tu Contraseña? 
                        </button>
                            ) : null
                        }
                    </form>
                </div>
            </div>
            
        </div>
    )
}

export default withRouter(Login)
