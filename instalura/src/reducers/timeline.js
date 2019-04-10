import {List} from 'immutable';

function trocaFoto(lista, fotoId, callback) {
    const fotoEstadoAntigo = lista.find(foto => foto.id === fotoId);

    const propriedades = callback(fotoEstadoAntigo);
    const fotoEstadoNovo = Object.assign({}, fotoEstadoAntigo, propriedades);

    const indiceDaLista = lista.findIndex(foto => foto.id === fotoId);
    const novaLista = lista.set(indiceDaLista, fotoEstadoNovo);

    return novaLista;
}

//REDUCER
export function timeline(state = new List(), action) {
  
    if (action.type === 'LISTAGEM') {
      console.log(action.fotos);
      return new List(action.fotos);
    }

    if (action.type === 'COMENTARIO') {
        return trocaFoto(state, action.fotoId, (fotoEstadoAntigo => {
            const novosComentarios = fotoEstadoAntigo.comentarios.concat(action.novoComentario);
            return {comentarios:novosComentarios};
        }));
    }

    if (action.type === 'LIKE') {
        const fotoEstadoAntigo = state.find(foto => foto.id === action.fotoId);

        return trocaFoto(state, action.fotoId, (fotoEstadoAntigo) => {
            const likeada = !fotoEstadoAntigo.likeada;
        
            const possivelLike = fotoEstadoAntigo.likers.find(likerAtual => likerAtual.login === action.liker.login);
    
            let novosLikers;
            if (possivelLike === undefined) {
                novosLikers = fotoEstadoAntigo.likers.concat(action.liker);
            } else {
                novosLikers = fotoEstadoAntigo.likers.filter(likerAtual => likerAtual.login !== action.liker.login);
            }

            return {likeada, likers:novosLikers}
        });
    }
  
    return state;
  }