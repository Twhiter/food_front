import React from 'react';
import {MainWrapper} from "./component/Main/MainWrapper";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {Setting} from "./component/user/Setting";


function App() {




    return (
        <React.Fragment>
           <Router>
               <Switch>
                   <Route path="/" exact>
                       <MainWrapper/>
                   </Route>
                   <Route path="/user/setting/:user_id">
                       <Setting/>
                   </Route>
               </Switch>
           </Router>
        </React.Fragment>

    );
}

export default App;
