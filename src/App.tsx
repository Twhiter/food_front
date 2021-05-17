import React from 'react';
import {MainWrapper} from "./component/Main/MainWrapper";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {Setting} from "./component/user/Setting";
import {DetailOrder} from "./component/order/DetailOrder";
import {AdminLogin, OrderCompWrapper} from "./component/admin/Admin";
import {FoodControl} from "./component/admin/FoodControl";


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
                   <Route path={"/order/:order_id"}>
                       <DetailOrder/>
                   </Route>
                   <Route path={"/adminLogin"}>
                       <AdminLogin/>
                   </Route>
                   <Route path={"/admin"}>
                       <OrderCompWrapper/>
                   </Route>
                   <Route path={"/foodControl"}>
                       <FoodControl/>
                   </Route>
               </Switch>
           </Router>
        </React.Fragment>

    );
}

export default App;
