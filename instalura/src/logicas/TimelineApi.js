import {listagem, comentario, like, notifica} from '../actions/actionCreator'

export default class TimelineApi {

    static lista(urlPerfil) {
        return dispatch => {
            fetch(urlPerfil)
                .then(response => response.json())
                .then(fotos => {
                    dispatch(notifica(`Encontrado ${fotos.length} registro(s).`));
                    dispatch(listagem(fotos));
                    return fotos;
                });
        }
    }

    static like(fotoId) {
        return dispatch => {
            fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {
                method:'POST'
            })
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível realizar o like no momento.");
                }
            })
            .then(liker => {
                dispatch(like(fotoId, liker));
                return liker;
            })
            .catch(ex => {
                console.log(ex.message);
            });
        }
    }

    static comenta(fotoId, texto) {
        return dispatch => {
            const requestInfo = {
                method:'POST',
                body:JSON.stringify({texto}),
                headers:new Headers({
                    'Content-type':'application/json'     
                })
            };

            fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível realizar o comentário no momento.");
                }
            })
            .then(novoComentario => {
                dispatch(comentario(fotoId, novoComentario));
                return novoComentario;
            })
            .catch(ex => {
                console.log(ex.message);
            });
        }
    }

    static pesquisa(login) {
        return dispatch => {
            fetch(`https://instalura-api.herokuapp.com/api/public/fotos/${login}`)
            .then(response => {
                console.log(response);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível realizar a pesquisa no momento");
                }
            })
            .then(fotos => {
                if (fotos.length === 0) {
                    dispatch(notifica('Nenhum registro encontrado.'));
                } else {
                    dispatch(notifica(`Encontrado ${fotos.length} registro(s).`));
                }
                dispatch(listagem(fotos));
                return fotos;
            })
            .catch(ex => {
                console.log(ex.message)
            });
        }
    }
}