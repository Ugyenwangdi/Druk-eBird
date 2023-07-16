export const hideAlert = () => {
    const el = document.querySelector('.alert')
    if(el) el.parentElement.removeChild(el)
}

// //type is 'success' or 'error'
// export const showAlert = (type, msg) =>{
//     hideAlert()
//     const markup = `<div class="alert alert--${type}">${msg}</div>`
//     document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
//     window.setTimeout(hideAlert, 5000)
// }

export const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}" style="position: fixed; top: 80%; left: 50%; transform: translate(-50%, -50%); background-color: #f5f5f5; padding: 10px;">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};
