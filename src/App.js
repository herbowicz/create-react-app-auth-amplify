import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AppContext from './AppContext';
import {AmplifyAuthenticator, AmplifySignIn, AmplifySignUp, AmplifySignOut} from '@aws-amplify/ui-react';
import {Auth, DataStore, Hub} from 'aws-amplify';
import {Button, ChakraProvider, Container, Flex, IconButton} from '@chakra-ui/react';
import {PlusSquareIcon, SettingsIcon, TriangleDownIcon} from '@chakra-ui/icons'

import News from './News';
import Profile from './Profile';
import Add from './Add';

import {User} from './models';

export default function App() {
  const [user, updateUser] = React.useState(null);
  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(() => console.log('No signed in user.'));

    Hub.listen('auth', async (data) => {
      switch (data.payload.event) {
        case 'signIn':
          return updateUser(data.payload.data);
        case 'signOut':
          return updateUser(null);
        default:
          return;
      }
    });
  }, []);

  if (user) {

    Hub.listen('auth', async (data) => {
      if (data.payload.event === 'signUp' && data.payload.data.userConfirmed) {
        console.log('to jest signup!!!', data)
        await DataStore.save(
            new User({
                id: user.username,
                username: user.attributes.name,
                profilePic: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
            }));
      }
    });

    return (
      <Router>
        <AppContext.Provider value={user}>
          <ChakraProvider>
            <Container>
              <Flex justifyContent='space-around' alignItems='center'>
                  <Link to="/">
                    <IconButton w={75} icon={<TriangleDownIcon />} />
                  </Link>
                  <Link to="/add">
                    <IconButton w={75} icon={<PlusSquareIcon />} />
                  </Link>
                  <Link to="/profile">
                    <IconButton w={75} icon={<SettingsIcon />} />
                  </Link>
                  <AmplifySignOut />
              </Flex>

              <Switch>
                <Route exact path="/">
                  <News />
                </Route>
                <Route path="/add">
                  <Add />
                </Route>
                <Route path="/profile">
                  <Profile />
                </Route>
              </Switch>
            </Container>

          </ChakraProvider>
        </AppContext.Provider>
      </Router>
    )
  }

  return (
    <ChakraProvider>
      <Flex justifyContent='center' flexDirection='column' bgGradient='linear(to-l, #7928CA, #FF0080)'>
        <AmplifyAuthenticator usernameAlias="email">
          <AmplifySignUp
            headerText="Sign up to Code Wroclaw"
            slot="sign-up"
            usernameAlias="email"
            formFields={[
              {
                type: "name",
                label: "Name",
                placeholder: "Enter your username"
              },
              { type: "email" },
              { type: "password" },
            ]}
          />
          <hr/>
          <AmplifySignIn
            headerText="Sign in to the Code"
            slot="sign-in"
            formFields={[
              {
                type: "email",
                label: "Email",
                placeholder: "Enter your email"
              },
              {
                type: "password",
                label: "Password",
                placeholder: "Enter your password"
              }
            ]}
          >
            <div slot="federated-buttons">
              <Button onClick={() => Auth.federatedSignIn({
                provider: "Facebook"
              })}>
                Sign in with Facebook
              </Button>
            </div>
          </AmplifySignIn>
        </AmplifyAuthenticator>
      </Flex>
    </ChakraProvider>
  );
}
