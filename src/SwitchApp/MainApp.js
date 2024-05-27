import React, { Component, Fragment } from 'react';
import {Button, Confirm, Divider, Grid, GridColumn, Header, Loader, Segment} from "semantic-ui-react";
import LoginPage from './components/LoginPage';
import {kc} from "./components/UserManager";
import mqtt from "./libs/mqtt";

class MainApp extends Component {

    state = {
        open: false,
        pass: false,
        user: null,
        roles: [],
        current: "fetching...",
        switchto: "",
    };

    checkPermission = (user) => {
        const trl_public = kc.hasRealmRole("bb_user");
        if(trl_public) {
            this.setState({user, roles: user.roles});
            this.initApp(user);
        } else {
            alert("Access denied!");
            kc.logout();
        }
    };

    initApp = (user) => {
        this.initMQTT(user);
        this.getStatus();
    }

    getStatus = () => {
        setTimeout(() => {
            this.setState({current: "Hot"})
        }, 1000)
    }

    showConfirm = (isp) => {
        this.setState({switchto: isp, open: true})
    }

    changeStatus = () => {
        const {switchto} = this.state;
        this.setState({open: false, current: "changing..."})
        setTimeout(() => {
            this.setState({current: switchto})
        }, 3000)
    }

    initMQTT = (user) => {
        mqtt.init(user, (data) => {
            console.log("[mqtt] init: ", data, user);
            mqtt.watch((message) => {
                //this.handleMessage(message);
            });
        });
    };

    sendMessage = () => {
        let msg = {type: "test", text: "content"};
        mqtt.send(JSON.stringify(msg), false, "test/in");
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    render() {

        const {user, roles, current, switchto} = this.state;

        let opt = roles.map((role,i) => {
            if(role === "bb_user") {
                return (
                    <Fragment>
                        <Header>
                            ISP: {current === "changing..." ? <Loader active inline /> : current}
                        </Header>
                    <Segment>
                        <Grid columns={2} relaxed='very'>
                            <GridColumn>
                                <Button loading={current === "fetching..."}
                                        disabled={current !== "Hot"}
                                        fluid key={i} size='massive' color='green' onClick={() => this.showConfirm("Bezeq")} >
                                    Bezeq
                                </Button>
                            </GridColumn>
                            <GridColumn>
                                <Button loading={current === "fetching..."}
                                        disabled={current !== "Bezeq"}
                                        fluid key={i} size='massive' color='green' onClick={() => this.showConfirm("Hot")} >
                                    Hot
                                </Button>
                            </GridColumn>
                        </Grid>
                        <Confirm
                            size='mini'
                            open={this.state.open}
                            header={"ISP going to be switch to: " + switchto }
                            onCancel={this.close}
                            onConfirm={this.changeStatus}
                        />
                        <Divider vertical>.</Divider>
                    </Segment>
                    </Fragment>
                )
            }
            return null
        });

        return (
            <Fragment>
                <LoginPage user={user} enter={opt} checkPermission={this.checkPermission} />
            </Fragment>

        );
    }
}

export default MainApp;
