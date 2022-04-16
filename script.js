let mensagens = [];
let pegou = {};
let naoPegou ={};
let usuario = {};
let conectou ={};
let tokenMensagens = 0;
let renovaStatus =0;
let texto = 0;

const renovaChat = renova => {
    renovaStatus = renova.status;
    clearInterval(tokenMensagens);
    pegarMensagens();
}
const trataErro = erro => naoPegou= erro.response;
const mantemConectado = acerto => conectou = acerto;
const trataAcerto = acerto =>{
    pegou = acerto;
    tokenMensagens = setInterval(pegarMensagens,3000) ;
    manterConectado();
};
const pegaDados = resposta =>{
    mensagens = resposta.data;
    setTimeout(renderizaMensagens, 300);
} ;


function pegarMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages",usuario);
    promessa.then(pegaDados);
};

function enviarMensagem(){
    texto = document.querySelector(".enviamensagem").value;
    const objetoMensagem = {
        from: usuario.name,
        to: "Todos",
        text: texto,
        type: "message"
    };

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",objetoMensagem);
    promessa.then(renovaChat);
    promessa.catch(trataErro);
    if(naoPegou){
        console.log(naoPegou);
    }
    document.querySelector(".enviamensagem").value = '';
}

function renderizaMensagens(){
    const documento = document.querySelector(".boxmensagens");
    documento.innerHTML = ``;
    console.log('entrei aqui');
    console.log(mensagens);
    for (let index = 0; index < mensagens.length; index++) {
        if(mensagens[index].type ==='status'){
            documento.innerHTML += `
            <div class="mensagens login">
                <h1>(${mensagens[index].time}) <span>${mensagens[index].from} </span>${mensagens[index].text} </h1>
            </div>`
        }

        if(mensagens[index].type ==='message'){
            documento.innerHTML += `
            <div class="mensagens publica">
                <h1>(${mensagens[index].time}) <span>${mensagens[index].from}</span> para <span>${mensagens[index].to}</span>: ${mensagens[index].text} </h1>
            </div>`
        }

        if(mensagens[index].type ==='private_message'){
            documento.innerHTML += `
            <div class="mensagens privada">
                <h1>(${mensagens[index].time}) <span>${mensagens[index].from}</span> resevardamente para <span>${mensagens[index].to}</span>: ${mensagens[index].text} </h1>
            </div>`
        }
        
        documento.scrollIntoView(false);
    }

}

function manterConectado() {
    let promessa = {};
    let acerto = {};
    let erro = {};
    const conectado = setInterval(() => {
        promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
        acerto = promessa.then(mantemConectado);
        erro = promessa.catch(trataErro);
    },4000);

    if(naoPegou.status === 400){
        alert("usuario não logado relogue o usuario");
        clearInterval(conectado);
        clearInterval(tokenMensagens);
    }
    
}

function sair(conectado){
    clearInterval(conectado);
}

function logar(){
    let nome = prompt("Digite seu usuario");
    usuario ={
        name: nome
    } ;
    let promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    promessa.then(trataAcerto);
    promessa.catch(trataErro);

}

logar();