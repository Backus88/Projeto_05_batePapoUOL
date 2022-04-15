const trataErro = erro => erro.response;
const trataAcerto = acerto => acerto;

function manterConectado(usuario) {
    let promessa = {};
    let acerto = {};
    let erro = {};
    const conectado = setInterval(() => {
        promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
        acerto = promessa.then(trataAcerto);
        erro = promessa.catch(trataErro);
    console.log(acerto.status);
    },4000);
    

    if(erro.status === 400){
        alert("usuario não logado relogue o usuario");
        clearInterval(conectado);
    }
    
}

function sair(conectado){
    clearInterval(conectado);
}

function logar(){
    let nome = prompt("Digite seu usuario");
    let usuario ={
        name: nome
    } ;
    let promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    let acerto = promessa.then(trataAcerto);
    let erro = promessa.catch(trataErro);
    console.log(erro);
    console.log(acerto);

    if(erro.status == 400){
        alert("relogue a página e escolha outro usuário.");
    }

    manterConectado(usuario);
}

logar();