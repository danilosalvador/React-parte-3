import React, { Component } from 'react';
import FotoItem from './Foto';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import TimelineApi from '../logicas/TimelineApi';
import {connect} from 'react-redux';

class Timeline extends Component {
    
    constructor(props) {
        super(props);
        this.login = this.props.login;
    }

    // componentWillMount() {
    //     this.props.store.subscribe(() => {
    //         console.log('subscribe');
    //         this.setState({fotos:this.props.store.getState().timeline});
    //     });
    // }

    componentDidMount() {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.login !== this.login) {
            
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }

    carregaFotos() {

        let urlPerfil;

        if (this.login === undefined) {
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
        }

        this.props.lista(urlPerfil);
    }

    render() {
        console.log("render");
      return (
            <div className="fotos container">
                <TransitionGroup
                    className="timeline">
                    {
                        this.props.fotos.map(item => (
                            <CSSTransition
                                key={item.id}
                                timeout={500}
                                classNames="timeline">
                                <FotoItem 
                                    key={item.id} 
                                    foto={item}
                                    like={this.props.like}
                                    comenta={this.props.comenta}/>
                            </CSSTransition>
                        ))
                    }
                </TransitionGroup>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {fotos : state.timeline}
}

const mapDispatchToProps = dispatch => {
    return {
        like : (fotoId) => {
            dispatch(TimelineApi.like(fotoId));
        },
        comenta : (fotoId, texto) => {
            dispatch(TimelineApi.comenta(fotoId, texto));
        },
        lista : (urlPerfil) => {
            dispatch(TimelineApi.lista(urlPerfil));
        }
    }
}

const TimelineContainer = connect(mapStateToProps, mapDispatchToProps)(Timeline);

export default  TimelineContainer;