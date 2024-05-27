import React, { Component } from 'react';
import {kc,getUser} from './UserManager';
import { Container, Message, Button, Divider } from 'semantic-ui-react';

class LoginPage extends Component {

    state = {
        disabled: true,
        loading: true,
    };

    componentDidMount() {
        this.appLogin();
    };

    appLogin = () => {
        getUser((user) => {
            if(user) {
                console.log("Got user: ", user)
                this.setState({loading: false});
                this.props.checkPermission(user);
            } else {
                this.setState({disabled: false, loading: false});
            }
        });
    };

    userLogin = () => {
        this.setState({disabled: true, loading: true});
        kc.login({redirectUri: window.location.href});
    };


    render() {

        const {disabled, loading} = this.state;

        let login = (<Button size='massive' primary onClick={this.userLogin} disabled={disabled} loading={loading}>Login</Button>);
        //let enter = (<Button size='massive' color='green' onClick={() => this.props.enter()} disabled={disabled} loading={loading}>Enter</Button>);

        return (
            <Container textAlign='center' >
                <br />
                <Message size='massive'>
                    <Divider horizonta />
                    {this.props.user === null ? login : this.props.enter}
                    <p />
                </Message>
            </Container>
        );
    }
}

export default LoginPage;
