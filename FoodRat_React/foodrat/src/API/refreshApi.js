import axios from 'axios'
import {createRefresh} from 'react-auth-kit'
const serverURL = process.env.REACT_APP_SERVER_URL;

const refreshApi = createRefresh({
    interval: 8,   // Refreshs the token in every 8 minutes
    refreshApiCallback: async (
        {   // arguments
            authToken,
            refreshToken,
        }) => {
        try {
            const response = await axios.post(`${serverURL}/application/refresh`, {'refresh': refreshToken}, {
                headers: {'Authorization': `Bearer ${authToken}`}}
            )
            return {
                isSuccess: true,
                newAuthToken: response.data.newAuthToken,
                newAuthTokenExpireIn: response.data.newAuthTokenExpireIn,
            }
        }
        catch(error){
            console.error(error)
            return {
                isSuccess: false
            }
        }
    }
})

export default refreshApi