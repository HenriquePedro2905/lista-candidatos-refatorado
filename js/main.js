//v1
let selectCidades = document.querySelector('#lista-cidades');
let listaCidades = [];

function criarOption(listaSet){
    listaCidades = Array.from(listaSet)
    listaCidades.sort((a, b) => a.localeCompare(b)); // Ordena as cidades por ordem alfabética, ignorando os acentos
    
    listaCidades.forEach(cidade => {
        let option = document.createElement('option');
        option.value = cidade;
        option.textContent = cidade;
        selectCidades.appendChild(option);
    })
}

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
    return false;
}

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
     const isUnique = temInstagram !== temFacebook;

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

     perfilDiv.appendChild(foto);
     perfilDiv.appendChild(nomeUrna);
     perfilDiv.appendChild(numeroUrna);
     perfilDiv.appendChild(nomeCompleto)
     perfilDiv.appendChild(cidade);
     perfilDiv.appendChild(partido);
     if (instagram) {
        perfilDiv.appendChild(instagram);
    }
    if (facebook) {
        perfilDiv.appendChild(facebook);
    }

     return perfilDiv;
}

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