import { showAlert } from './alert.js'
export const resetPassword = async (data) => 
{
    
    try {
        const res = await axios({
            method: 'POST',
            url: window.location.href,
            data
        })
        console.log(res)
        if (res.status === 200) 
        {
            showAlert("message","Password reset successful") 
        }
    } catch (err) {
        let message =
        typeof err.response !== 'undefined'
        ? err.response.data.message
        : err.message
        showAlert('error', message )
    }
}

const userDataForm = document.querySelector('.resetPassword')

userDataForm.addEventListener('submit',(e)=>
{
    e.preventDefault()
    const password = document.getElementById('password').value
    console.log("password ", password);
    resetPassword({password})

})

