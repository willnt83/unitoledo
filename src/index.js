import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router, Route } from "react-router-dom"
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import RootReducer from './reducers/RootReducer'
import AdminIndex from './admin/AdminIndex'
import SignIn from './SignIn'
import AlunosIndex from './AlunosIndex'

const store = createStore(RootReducer)

const routes = [
    {
        path: "/",
        exact: true,
        main: () => <SignIn />
	},
	{
		path: "/alunos",
        exact: true,
        main: () => <AlunosIndex />
	},
    {
      path: "/admin",
      main: () => <AdminIndex />
    }
]

class App extends Component {
    render() {
		return (
			<Router>
				<React.Fragment>
					{
						routes.map((route, index) => (
							<Route
								key={index}
								path={route.path}
								exact={route.exact}
								component={route.main}
							/>
						))
					}
				</React.Fragment>
			</Router>
		);
    }
}

export default App

ReactDOM.render(<Provider store={ store }><App /></Provider>, document.getElementById('root'))
serviceWorker.unregister()