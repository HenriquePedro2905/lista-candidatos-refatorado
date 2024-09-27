//v1
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch((error) => {
          console.log('Falha ao registrar o Service Worker:', error);
        });
    });
}


let selectCidades = document.querySelector('#lista-cidades');
let listaCidades = [];

// Função para criar as options do select
function criarOption(listaSet){
    listaCidades = Array.from(listaSet)
    listaCidades.sort((a, b) => a.localeCompare(b)); // Ordena as cidades por ordem alfabética, ignorando os acentos
    
    // Passa por todas as cidades e cria as options do select
    listaCidades.forEach(cidade => {
        let option = document.createElement('option');
        option.value = cidade;
        option.textContent = cidade;
        selectCidades.appendChild(option);
    })
}

// Função para verificar e criar links para as redes sociais
function verificarRedes(linkRedes, isUnique, rede){
    if (linkRedes) {
        const link = document.createElement('a');
        const img = document.createElement('img');
        if (rede == 'instagram') {
            img.src = 'images/instagram.svg'
            img.id = isUnique ? 'uniqueIcon' : 'logo-instagram';
            link.href = linkRedes
            link.appendChild(img);
            return link;
        } else if(rede == 'facebook') {
            img.src = 'images/facebook.svg'
            img.id = isUnique ? 'uniqueIcon' : 'logo-facebook';
            link.href = linkRedes
            link.appendChild(img);
            return link;
        }
    }
    return false; // Retorna falso se não houver link de rede social
}

// Função para criar o perfil do candidato
function criarPerfil(candidato){
     // Variáveis de elementos do perfil
     const perfilDiv = document.createElement('div');
     const foto = document.createElement('img');
     const nomeUrna = document.createElement('span');
     const numeroUrna = document.createElement('span');
     const nomeCompleto = document.createElement('span');
     const cidade = document.createElement('span');
     const partido = document.createElement('span');
     let facebook;
     let instagram;

     const temInstagram = !!candidato.instagram;
     const temFacebook = !!candidato.facebook;
     const isUnique = temInstagram !== temFacebook; // Verifica se apenas uma rede social está presente

     // Definindo id dos elementos do perfil
     perfilDiv.className = 'candidatos-perfil';
     nomeUrna.id = 'nome-urna';
     numeroUrna.id = 'numero-urna';
     nomeCompleto.id = 'nome-completo';
     cidade.id = 'cidade';
     partido.id = 'partido';
     foto.id = 'foto-perfil';

     // Escrevendo os dados nas variaveis
     foto.src = candidato.linkFoto;
     nomeUrna.textContent = candidato.nomeUrna.toUpperCase();
     numeroUrna.textContent = candidato.numUrna;
     cidade.textContent = candidato.cidade;
     partido.textContent = `${candidato.partido} - ${candidato.siglaPartido.toUpperCase()}`;
     instagram = verificarRedes(candidato.instagram, isUnique, 'instagram');
     facebook = verificarRedes(candidato.facebook, isUnique, 'facebook');


     // Expressão Regular para deixar as primeiras letras maiusculas do NomeCompleto
     capitalize = candidato.nomeCompleto.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
     nomeCompleto.textContent = capitalize

    // Adiciona os elementos do perfil na div do perfil
     perfilDiv.appendChild(foto);
     perfilDiv.appendChild(nomeUrna);
     perfilDiv.appendChild(numeroUrna);
     perfilDiv.appendChild(nomeCompleto)
     perfilDiv.appendChild(cidade);
     perfilDiv.appendChild(partido);
     
     if (instagram) { perfilDiv.appendChild(instagram); }  // Verifica e adiciona o ícone do Instagram
     if (facebook) { perfilDiv.appendChild(facebook); }    // Verifica e adiciona o ícone do Facebook

     return perfilDiv; // Retorna a div do perfil preenchida
}

// Evento que ocorre quando o documento é totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    fetch("./candidatos.json").then((response) => {
        response.json().then((dados) => {

            const cidadesSet = new Set();
            
            // Criando a lista de cidades unicas
            dados.candidatos.forEach((candidato) => {
                if (candidato.cidade) {
                    cidadesSet.add(candidato.cidade);
                }

            });

                // Chama a função para criar as options no select
                criarOption(cidadesSet);

                // Evento escutando dentro do select
                selectCidades.addEventListener('change',() => {
                    let divCandidatos = document.querySelector('.candidatos-container');
                            
                    // Pega os candidados com base no valor do select
                    const candidatosFiltrados = dados.candidatos.filter(candidato => candidato.cidade === selectCidades.value);

                    // Função para ordenar os candidatos em ordem alfabética
                    candidatosFiltrados.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));

                    
                    divCandidatos.innerHTML = ''; // Limpando as div para atualizar os dados exibidos

                    // Itereando por cada candidato
                    candidatosFiltrados.forEach((candidato) => {
                        divCandidatos.appendChild(criarPerfil(candidato))  
                    })
                })
        })
    })
})