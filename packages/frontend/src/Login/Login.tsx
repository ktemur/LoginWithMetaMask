import * as React from 'react';
import Web3 from 'web3';

import { Auth } from '../types';
import './Login.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


interface Props {
  onLoggedIn: (auth: Auth) => void;
}

let web3: Web3 | undefined = undefined; 

export class Login extends React.Component<Props> {
  state = {
    loading: false 
  };

  handleAuthenticate = ({
    publicAddress,
    signature
  }: {
    publicAddress: string;
    signature: string;
  }) =>
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());

  handleClick = async () => {
    const { onLoggedIn } = this.props;

  
    if (!(window as any).ethereum) {
      window.alert('Please install MetaMask first.');
      return;
    }

    if (!web3) {
      try {
       
        await (window as any).ethereum.enable();

        web3 = new Web3((window as any).ethereum);
      } catch (error) {
        window.alert('You need to allow MetaMask.');
        return;
      }
    }

    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert('Please activate MetaMask first.');
      return;
    }

    const publicAddress = coinbase.toLowerCase();
    this.setState({ loading: true });

    fetch(
      `${
        process.env.REACT_APP_BACKEND_URL
      }/users?publicAddress=${publicAddress}`
    )
      .then(response => response.json())
      .then(users =>
        users.length ? users[0] : this.handleSignup(publicAddress)
      )
      .then(this.handleSignMessage)
      .then(this.handleAuthenticate)
      .then(onLoggedIn)
      .catch(err => {
        window.alert(err);
        this.setState({ loading: false });
      });
  };

  handleSignMessage = async ({
    publicAddress,
    nonce
  }: {
    publicAddress: string;
    nonce: string;
  }) => {
    try {
      const signature = await web3!.eth.personal.sign(
        `İmzalanacak rastgele sayı: ${nonce}`,
        publicAddress,
        '' 
      );

      return { publicAddress, signature };
    } catch (err) {
      throw new Error('You need to sign the message to be able to log in.');
    }
  };

  handleSignup = (publicAddress: string) => {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        <MuiThemeProvider>
          <div>
          <AppBar
             title="Login"
           />
           <TextField
             hintText="Enter your Username"
             floatingLabelText="Username"
             />
           <br/>
             <TextField
               type="password"
               hintText="Enter your Password"
               floatingLabelText="Password"
               />
             <br/>
             <RaisedButton label="Login with MetaMask" primary={true} style={style} onClick={this.handleClick}/>
         </div>
         </MuiThemeProvider>
      </div>
      
    );
  }
}

const style = {
  margin: 15,
 };
 export default Login;