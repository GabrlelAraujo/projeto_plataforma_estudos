
// verifica se o usuario esta logado
const usuario = localStorage.getItem("usuario") // localStorage guarda os dados do usuario mesmo quando ele da f5

if (!usuario) {
    // se nao estar logado volta pro login
    window.location.href = "login.html"
}

function sair() { // função para sair da home
    localStorage.removeItem("usuario")  // removeItem deslouga ele
    window.location.href = "login.html" // leva ele de volta ao login 
}



const token = localStorage.getItem("token") // pega o token salvo 

fetch("http://localhost:3000/home", {

    headers: {
        Authorization: token // envia para o backend e o jwt.verify() verifica no server.js
    }  
})

.then(res => res.text()) // isso para o codigo terminar e dar uma resposta no console 

.then(data => {
    console.log(data) // data é a respota que colocamos no /home
})
