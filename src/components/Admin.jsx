import React from 'react'
import { auth } from '../firebase'
import { withRouter } from 'react-router-dom'
import Firebase from './Firebase'

const Admin = (props) => {

    const [user, setUser] = React.useState(null)
    React.useEffect(() => {
        if (auth.currentUser) {
            console.log('existe un usuario')
            setUser(auth.currentUser)
        }else{
            console.log('no existe un usuario')
            props.history.push('/login')
        }
    }, [props.history])
    return (
        <div>
          {
              user && (
                 <Firebase user={user}/>
              )
          } 
        </div>
    )
}

export default withRouter(Admin)
