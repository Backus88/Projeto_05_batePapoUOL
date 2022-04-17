let mensagens = [];
let usuariosAtivos = [];
let pegou = {};
let naoPegou ={};
let usuario = {};
let conectou ={};
let tokenMensagens = 0;
let renovaStatus =0;
let texto = 0;
let conectado = 0;
let selecionado = 0;
let userAtivo = 0;
let mensagemTipo = 0;

function filtra(mensagens){
    if (mensagens.type === "private_message" ){
        if(mensagens.from != usuario){
            return false;
        }
        if(mensagens.to != usuario || mensagens.to != 'Todos'){
            return false;
        }
    }
    return true;
}

function filtrarUser(user){
    if(user.name === usuario){
        return false;
    }
    return true;
}

const renovaChat = renova => {
    renovaStatus = renova.status;
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

const usersAtivos = ativos => {
    usuariosAtivos = ativos.data;
    renderizaAtivos();
};


function pegarMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages",usuario);
    promessa.then(pegaDados);
};

function enviarMensagem(){
    texto = document.querySelector(".enviamensagem").value;
    let tipoMessage = 0;
    if(mensagemTipo === 'Resevardamente'){
        tipoMessage = "private_message";
    }else{
        tipoMessage = "message";
    }

    if(!userAtivo){
        userAtivo = 'Todos';
    }
    const objetoMensagem = {
        from: usuario.name,
        to: userAtivo,
        text: texto,
        type: tipoMessage
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
    let mensagemFiltrada = mensagens.filter(filtra);
    console.log(mensagemFiltrada);
    for (let index = 0; index < mensagemFiltrada.length; index++) {
        if(mensagemFiltrada[index].type ==='status'){
            documento.innerHTML += `
            <div class="mensagens login">
                <h1>(${mensagemFiltrada[index].time}) <span>${mensagemFiltrada[index].from} </span>${mensagemFiltrada[index].text} </h1>
            </div>`
        }

        if(mensagemFiltrada[index].type ==='message'){
            documento.innerHTML += `
            <div class="mensagens publica">
                <h1>(${mensagemFiltrada[index].time}) <span>${mensagemFiltrada[index].from}</span> para <span>${mensagemFiltrada[index].to}</span>: ${mensagemFiltrada[index].text} </h1>
            </div>`
        }

        if(mensagemFiltrada[index].type ==='private_message'){
            documento.innerHTML += `
            <div class="mensagens privada">
                <h1>(${mensagemFiltrada[index].time}) <span>${mensagemFiltrada[index].from}</span> resevardamente para <span>${mensagemFiltrada[index].to}</span>: ${mensagemFiltrada[index].text} </h1>
            </div>`
        }
        
        documento.scrollIntoView(false);
    }

}

function manterConectado() {
    let promessa = {};
    let promise = 0;
    conectado = setInterval(() => {
        promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
        promessa.then(mantemConectado);
        promessa.catch(trataErro);
        console.log('conectado');
        if(naoPegou.status === 400){
            promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
            console.log('erro de usuario');
        }
    },5000);

    
    
}
function pegarAtivos(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promessa.then(usersAtivos);
}
function renderizaAtivos(){
    let documentoUser = document.querySelector(".contatos");
    documentoUser.innerHTML = `
        <div role="button" class="contato" onclick = 'seleciona(this,"seleciona-contato")'>
            <ion-icon name="people"></ion-icon>
            <h2>Todos</h2>
        </div>` 
    let auxFiltro = usuariosAtivos.filter(filtrarUser);
    let filtroUser = auxFiltro.filter(filtrarUser)
    for (let index = 0; index < filtroUser.length; index++) {
        documentoUser.innerHTML += `
        <div role="button" class="contato" onclick = 'seleciona(this,"seleciona-contato")'>
            <ion-icon name="people-circle-outline"></ion-icon>
            <h2>${filtroUser[index].name}</h2>
        </div>`   
    }

    document.querySelector(".ativos").classList.add("mostrausers");
}

function selecionarAtributos(){
    const selContato = document.querySelector(".seleciona-contato");
    const selVisibilidade =document.querySelector(".seleciona-visibilidade");
    userAtivo = selContato.querySelector("h2").innerHTML;
    mensagemTipo = selVisibilidade.querySelector("h3").innerHTML;
    documentoSel = document.querySelector(".enviavariado h4");
    documentoSel.innerHTML = `Enviando para ${userAtivo}(${mensagemTipo})`;
    document.querySelector(".ativos").classList.remove("mostrausers"); 
}

function seleciona(elemento, usuarioMensagem){
    selecionado = document.querySelector("."+ usuarioMensagem);
    if(selecionado != null){
        selecionado.classList.remove(usuarioMensagem);
    };
    if(selecionado === elemento){
        selecionado.classList.remove(usuarioMensagem);
    }else{
        elemento.classList.add(usuarioMensagem);
    };
    if(document.querySelector(".seleciona-contato")&&document.querySelector(".seleciona-visibilidade")){
        selecionarAtributos();
    };
   
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