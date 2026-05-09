function entrar(){
   // alert("cliclou") // teste maroto


    const email = document.getElementById("email").value // document.getElementById pega o foi digitado no input pelo id do html
    const senha = document.getElementById("senha").value // .value pega oq foi digitado

    if (!email || !senha) {
    alert("Preencha todos os campos")
    return
}



    fetch("http://localhost:3000/login", {
        method : "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify ({
            email: email,
            senha: senha
        })
    })

    .then(res => res.json())
    .then(data => {

        console.log("resposta: ", data)

        
        if (data.token) {  // verifica se login deu certo
            
            localStorage.setItem("token", data.token) // salva no navegador os dados do usuario
            
            alert("login feito")

  
            window.location.href = "home.html"  // aqui manda o usuário pra próxima tela
        } else {
            alert(data)
        }

    })
    .catch(err => {
        console.log("erro: ", err)
        alert("erro ao conectar com servidor")
    })




}


function irCadastro() {  //função que linca com a classe do html, para cadastrar
    window.location.href = "cadastro.html"
}