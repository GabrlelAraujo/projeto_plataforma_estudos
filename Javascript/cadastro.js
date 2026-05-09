function cadastrar() { // Função para cadastrar 

   // alert("cliclou") // teste


    const nome = document.getElementById("nome").value // document.getElementById pega o foi digitado no input pelo id do html
    const email = document.getElementById("email").value // .value pega oq foi digitado
    const senha = document.getElementById("senha").value

    if (!nome || !email || !senha) {
    alert("Preencha todos os campos")
    return
}

    fetch("http://localhost:3000/cadastro", { // fetch faz uma requisição pro servidor pegando ou colocando dados no banco
        method: "POST", // method (metodo) que eh o POST = post envia os dados ao banco 
        headers : { // headers fala para o servidor, estou enviando arquivos JSON
            "Content-Type":  "application/json"
        },
        body: JSON.stringify ({ //JSON.stringify tranforma o  nome: nome, em JSON = 'nome': 'nome',
            nome: nome,
            email: email,
            senha: senha
        })
    })

    .then(res => res.text()) //pega a resposta do servidor 
    .then(data => { //mostra a resposta do servidor 
        console.log("resposta:", data)
        alert(data)
        window.location.href = "login.html"
    })
    .catch(err => {
        console.log("erro:", err)
        alert("deu erro")
    })
}


function irLogin() {    //função que linca com a classe do html, para login
    window.location.href = "login.html"
}