const express = require("express") // require importa o express

const app = express() // app cria a minha aplicação (servidor) com o express

const bcrypt = require("bcrypt") // importação para criptografrar a senha 

const cors = require("cors") // importação para cors
app.use(cors())


const jwt = require("jsonwebtoken") // importa o jwt


app.use(express.json()) // permite o servidor ler JSON ou seja dados do usuario

require("dotenv").config() // para  esconder a sebnha do banco de dados


const mysql = require('mysql2') //importa o mysql

const db = mysql.createConnection({ // Cria uma conexão com o banco db = variável que representa o banco

    host: process.env.DB_HOST, // onde está o banco
    user: process.env.DB_USER, // usuário
    password: process.env.DB_PASSWORD, //  senha
    database: process.env.DB_NAME // nome do banco

})

// verificar se conectou com o banco de dados 

db.connect((err) => {                                   // if para verificar erro e dizer se entrou 
    if (err) {
        console.log("Erro:", err);              // console.log mostra no console
    } else {
        console.log("Conectado ao banco!");
    }
});



app.get("/", (req, res) => {                                         // ("/") é o caminho da pagina inicial   req = pedido res = resposta
    res.send("servidor funcionando com express")                     // app.get DEFINE A ROTA DO TIPO get 
})                                                                  // get =  quando eu entro no navegador

// CADASTRO
app.post("/cadastro", async (req, res) => {        // criando o caminho da cadastro AGORA o POST ele envia os dados para o banco de dados, "async" permite usar await dentro da função
    const nome = req.body.nome              //  REQ.BODY Aqui ficam os dados enviados
    const email = req.body.email
    const senha = req.body.senha

    

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10) // transforma a senha trocando os carcteres tirando a senha de texto normal para mudar, o padrão é 10 mas muda conforme for

        const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)"  // comando para puxar os dados do banco, e os ? server para evitar ataques hackers de sql injetc

        db.query(sql, [nome, email, senhaCriptografada], (err, result) => { // um query que coloca os valores digitados 
            if (err) {                                  // if para erro
                console.log(err)
                return res.send("erro ao cadastrar")
            }

            res.send("cadastro realizado com sucesso!")
        })

    } catch (erro) {
        res.send("erro ao criptografar senha")                     // catch no final do try caso de erro 
    }
                                             
})



//LOGIN

app.post("/login", (req, res) => {
    const email = req.body.email // recebe o email 
    const senha = req.body.senha // recebe o senha

    const sql = "SELECT * FROM usuarios WHERE email = ?" //comando para acessar o sql // o  WHERE email = ? AND senha  NÃO FUNCIONA com bcrypt

    db.query(sql, [email], async (err, result) => { //result é a respota do banco de dados
        if (err) {
            console.log(err)
            return res.send("erro no login")
        } 

        if (result.length > 0) { //usando length para verificar a quantidade de carcteres para ter certeza que digitou algo
            
            const usuario = result[0]

            const senhaCorreta = await bcrypt.compare(senha, usuario.senha) // isso compara a senha digitada com a senha do banco de dados

            if (senhaCorreta) {
                const token = jwt.sign(         // jwt.sign isso cria o token 
                    {
                        id: usuario.id,           // sao os dados que sao guardados no token
                        nome : usuario.nome,
                        email: usuario.email
                    },

                    process.env.JWT_SECRET,               // chave para validar o token
                    
                    { expiresIn :"1h"}              // expiresIn faz com que ele expire em 1h 
                )
                
                res.json({                   // res eh o respota em json e cria o token
                mensagem : "login realizado com sucesso!",
                token: token
            })

            } else {
                res.send("senha incorreta")
            } 

        }   else {
                res.send("usuario não encontrado")
            }


    })



})


// home
app.get( "/home", (req, res) => {

    const token = req.headers.authorization // pega o token enviado

    if (!token) { // a ! inverte o valor pra de false para true e de true para false, na pratica se o usuario nao escrever nada o valor vai virar falso e vai exibir a resposta de baixo
        return res.json({
            mensagem : "Token não encontrado"
        })
    }

    try {                              //verifica se o token é valido,  se foi criado pelo servidor e se expirou 
        const decoded = jwt.verify(    // decoded são os dados do token.
            token,
            process.env.JWT_SECRET
        )

        res.json({
            mensagem : "Acesso liberado",
            usuario : decoded
        })

    } catch (erro) {                    //catch sempore acompanha o try para caso de erro
        res.json("Token invalido")
    }

})





app.listen(3000, () => {
    console.log('http://localhost:3000');
});