const usuarios = [
    { usuario: "prueba@prueba.com", contraseña: "Contraseña123" },
    { usuario: "admin@test.com", contraseña: "admin2025" }
]

function abrirModalLogin() {
    document.getElementById('ModalLogin').style.display = 'block'
}

function cerrarModalLogin() {
    document.getElementById('ModalLogin').style.display = 'none'
}
function loginUp() {
    
}

document.addEventListener('DOMContentLoaded', function () {
    const modalLOGIN = `
        <div id="ModalLogin" class="modal-login">
          <div class="modal-login-content">
            <div class="p-4" style="border: 2px black solid; border-radius: 10px;">                                                                                                                                                                                                                                                                    
                <h2>LOGIN</h2>
                <form id="form-login">
                <div class="cont-inputs my-3">
                    <input id="usuer" type="email" class="inputLogin" placeholder="Ingrese su Correo" required>
                    <input id="pass" class="inputLogin" type="password" placeholder="Ingrese su contraseña" required>
                </div>
                <button class="btn-voice my-3" type="submit">Ingresar</button>
                </form>
                <p id="resultado"></p>
            </div>
           </div>
        </div>
      `

    document.body.insertAdjacentHTML('beforeend', modalLOGIN)


    const btnLogin = document.querySelector('.btnLOG')
    const form = document.getElementById("form-login")
    const resultado = document.getElementById("resultado")



    if (btnLogin) {
        btnLogin.addEventListener('click', abrirModalLogin)
    }

    window.addEventListener('click', function (event) {
        const modal = document.getElementById('ModalLogin')
        if (event.target === modal) {
            cerrarModalLogin()
        }
    })

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            cerrarModalLogin()
        }
    })

    form.addEventListener("submit", e => {
        e.preventDefault()

        const usuario_Info = document.getElementById("usuer").value
        const contraseña_Info = document.getElementById("pass").value

        const estado = usuarios.find(
            u => u.usuario === usuario_Info && u.contraseña === contraseña_Info
        )

        if (estado) {
            resultado.textContent = `Bienvenido, ${usuario_Info}!`
            resultado.style.color = "green"
           document.getElementById('log-change').style.display= "none"
           document.getElementById("log-icon").innerHTML='<img class="icon-login" src="/Proyecto Mapa Universidad/Resources/usuario.png" alt="">'
            setTimeout(cerrarModalLogin, 1500)

        } else {
            resultado.textContent = "Usuario o contraseña incorrectos"
            resultado.style.color = "red"
        }
    })
})
