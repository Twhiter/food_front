import React, {CSSProperties, Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {
    createMuiTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Icon,
    Link,
    makeStyles,
    Menu,
    MenuItem,
    TextField
} from "@material-ui/core";
import {green} from "@material-ui/core/colors";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import logo from "../../pic/test2.png";
import Button from "@material-ui/core/Button";
import {ThemeProvider} from "@material-ui/core/styles";
import axios from "axios";
import {responseHandler} from "../../utility/handler"
import {CheckRespData, LoginRegisterRespData, UserInfo} from "../../dataStructure/UserInfo";
import {useLocalUserInfo} from "../../utility/Hooks";


const theme = createMuiTheme({
    palette: {
        primary: green
    }
});

const useWhiteBg = makeStyles({
    colorPrimary: {
        backgroundColor: '#F5F5F5'
    }
});


function handleNavClick(label: string) {
    document.getElementById(label).scrollIntoView({behavior: 'smooth'});
}


export const TopBar: FC = () => {


    const [list, setList] = useState(['PIZZA', 'HOT', 'DRINK', 'SAUCE', 'DESSERT', 'COMBO']);

    useEffect(() => {

        axios.get("/api/foodBase/categories").then(resp => responseHandler<string[]>(resp))
            .then(data => setList(data));
    }, []);


    const toolbarStyle: CSSProperties = {

        marginLeft: "100px",
        marginRight: "100px"
    }

    const classes = useWhiteBg();

    const [anchorEl, setAnchorEl] = useState(null);
    const [userInfo, setUserInfo] = useLocalUserInfo();


    console.log(userInfo)


    return (
        <React.Fragment>
            <ThemeProvider theme={createMuiTheme()}>
                <AppBar position="sticky" color={"primary"} classes={{colorPrimary: classes.colorPrimary}}>

                    <Toolbar style={toolbarStyle}>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Icon>
                                <img src={logo} alt="logo"/>
                            </Icon>
                        </IconButton>

                        <div style={{flexGrow: 1, marginLeft: "20px"}}>
                            {list.map(value =>
                                <Button
                                    style={{marginLeft: "5px", marginRight: "5px"}}
                                    color="primary" key={value}
                                    onClick={() => handleNavClick(value)}>
                                    {value}
                                </Button>
                            )}
                        </div>

                        <ThemeProvider theme={theme}>
                            <Button color="primary" onClick={e => setAnchorEl(e.currentTarget)}>
                                <Icon>account_circle</Icon>
                                <span
                                    style={{textTransform: "none"}}>{userInfo == null ? "" : userInfo.username}</span>
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={(e) => setAnchorEl(null)}
                            >
                                <MenuItems
                                    setAnchorEl={setAnchorEl}
                                    userInfo={userInfo}
                                    setUserInfo={setUserInfo}
                                />
                            </Menu>
                        </ThemeProvider>

                    </Toolbar>

                </AppBar>
            </ThemeProvider>
        </React.Fragment>
    )
}


interface MenuItemsProps {

    setAnchorEl: React.Dispatch<any>
    userInfo: UserInfo
    setUserInfo: Dispatch<SetStateAction<UserInfo>>
}

const MenuItems: FC<MenuItemsProps> = (props) => {


    const logoutHandler = (e) => {
        localStorage.clear();
        props.setAnchorEl(null);
        props.setUserInfo(null);
    }

    const settingHandler = (e) => {

        window.location.href = `/user/setting/${props.userInfo.user_id}`;
        props.setAnchorEl(null);
    }


    const isLogin = props.userInfo != null;
    let view

    if (isLogin)
        view = () => {
            return (
                <React.Fragment>
                    <MenuItem onClick={settingHandler}>Setting</MenuItem>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </React.Fragment>
            )
        }
    else
        view = () => {

            const [isLogin, setIsLogin] = useState(false);
            const [isRegister, setIsRegister] = useState(false);

            const loginHandler = (e) => {
                setIsLogin(true)
                props.setAnchorEl(null)
            }

            const registerHandler = e => {
                setIsRegister(true);
                props.setAnchorEl(null);
            }


            return (
                <React.Fragment>
                    <MenuItem onClick={loginHandler}>Login</MenuItem>
                    <MenuItem onClick={registerHandler}>Register</MenuItem>
                    <Login
                        open={isLogin}
                        setOpen={setIsLogin}
                        setUserInfo={props.setUserInfo}
                    />

                    <Register open={isRegister}
                              setOpen={setIsRegister}
                    />

                </React.Fragment>
            )
        }


    return (
        <React.Fragment>
            {view()}
        </React.Fragment>
    )
}


interface LoginProps {
    open: boolean,
    setOpen: React.Dispatch<SetStateAction<boolean>>
    setUserInfo: Dispatch<SetStateAction<UserInfo>>
}

const Login: FC<LoginProps> = props => {


    let account, password;

    function handleAccountChange(e) {
        account = e.target.value;
    }

    function handlePwdChange(e) {
        password = e.target.value;
    }

    function handleLogin(e) {
        axios.post("/api/user/login", {account: account, password: password})
            .then(resp => responseHandler<LoginRegisterRespData>(resp))
            .then(data => {
                if (data == undefined)
                    return
                if (!data.isOk)
                    window.alert("username/phone or password is incorrect");
                else {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
                    props.setUserInfo(data.userInfo);
                    alert('login successfully');
                }
            })
    }


    return (
        <React.Fragment>

            <ThemeProvider theme={createMuiTheme()}>
                <Dialog open={props.open} onClose={() => props.setOpen(false)}>
                    <DialogTitle>Login</DialogTitle>
                    <DialogContent>

                        <TextField label={"username/phone"}
                                   fullWidth
                                   onChange={handleAccountChange}/>
                        <TextField
                            label={"password"}
                            fullWidth
                            type={"password"}
                            onChange={handlePwdChange}
                            style={{marginBottom: '10px'}}/>
                        <Link href={""}>forget your password</Link>

                    </DialogContent>

                    <DialogActions>
                        <Button color="primary" onClick={handleLogin}>
                            Login
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>

        </React.Fragment>
    )
}


interface RegisterProps {
    open: boolean,
    setOpen: React.Dispatch<SetStateAction<boolean>>
}

interface RegisterForm {
    data: {
        username: string,
        phone: string,
        pwd: string
    },
    errorMsg: {
        error: boolean,
        helperText: string
    }[]
}


const Register: FC<RegisterProps> = props => {


    const [form, setForm] = useState<RegisterForm>({
        data: {
            username: '',
            phone: '',
            pwd: ''
        },
        errorMsg: [
            {error: false, helperText: ''},
            {error: false, helperText: ''},
            {error: false, helperText: ''},
        ]
    });



    async function checkNameExis(value) {
        const resp = await axios.get("/api/checkUsername/" + value);
        const data = await responseHandler<CheckRespData>(resp);

        if (data == undefined)
            return true;
        updateUsernameAndError(value,data.error,data.msg);
        return data.error;
    }


    function nameRule(value) {

        if (value == '') {
            updateUsernameAndError(value,true,"Empty username");
            return false;
        } else if (value.length >= 45) {
            updateUsernameAndError(value,true,"Exceed max length of username");
            return false;
        } else if (!Number.isNaN(Number(value))) {
            updateUsernameAndError(value,true,"Username must contain at least one character");
        } else
            return true;
    }


    function updateUsernameAndError(value:string,error:boolean,helperText:string) {
        setForm(prevState => (
            {
                data: {...prevState.data,username:value},
                errorMsg: [
                    {error:error,helperText:helperText},
                    prevState.errorMsg[1],
                    prevState.errorMsg[2]
                ]

            })
        );
    }

    function updatePhoneAndError(value: string, error: boolean, helperText: string) {
        setForm(prevState => (
            {
                data: {...prevState.data,phone:value},
                errorMsg: [
                    prevState.errorMsg[0],
                    {error:error,helperText:helperText},
                    prevState.errorMsg[2]
                ]

            })
        );
    }


    function usernameOnBlur(e) {
        const value = e.target.value;

        if (nameRule(value))
            checkNameExis(value);
    }

    async function checkPhoneExis(value) {
        const resp = await axios.get("/api/checkPhone/" + value);
        const data = await responseHandler<CheckRespData>(resp);

        if (data == undefined)
            return true;
        updatePhoneAndError(value,data.error,data.msg);
        return data.error;
    }


    function phoneRule(value) {
        if (value.length !== 9) {
            updatePhoneAndError(value,true,"incorrect phone length");
            return false
        } else if (Number.isNaN(Number(value))) {
            updatePhoneAndError(value,true,"incorrect phone number");
            return false;
        } else
            return true;
    }




    function phoneOnBlur(e) {
        const value = e.target.value;
        if (phoneRule(value))
            checkPhoneExis(value);
    }

    function updatePwdAndError(value, error, helperText) {
        setForm(prevState => (
            {
                data: {...prevState.data,pwd:value},
                errorMsg: [
                    prevState.errorMsg[0],
                    prevState.errorMsg[1],
                    {error:error,helperText:helperText},
                ]

            })
        );
    }


    function pwdRule(value) {
        if (!(value.length >= 5 && value.length <= 15)) {
            updatePwdAndError(value,true,"password length must between 5 and 15");
            return false;
        }
        else {
            updatePwdAndError(value,false,"");
            return true;
        }
    }

    function pwdOnBlur(e) {
        const value = e.target.value;
        pwdRule(value);
    }

    async function registerEvent() {

        const data = {username:form.data.username,password:form.data.pwd,phone:form.data.phone};

        if (nameRule(data.username) && phoneRule(data.phone) && pwdRule(data.password)
            && await checkNameExis(data.username)
            && await checkPhoneExis(data.phone))
            return;


       const resp =  await axios.post("/api/user",data);
       await responseHandler(resp);
       alert('register successfully');
       props.setOpen(false);
    }





    return (
        <React.Fragment>
            <ThemeProvider theme={createMuiTheme()}>
                <Dialog open={props.open} onClose={() => props.setOpen(false)}>
                    <DialogTitle>Register</DialogTitle>
                    <DialogContent>

                        <TextField
                            label={"username"}
                            fullWidth
                            error={form.errorMsg[0].error}
                            helperText={form.errorMsg[0].helperText}
                            onBlur={usernameOnBlur}
                        />

                        <TextField
                            label={"phone"}
                            fullWidth
                            type={"phone"}
                            error={form.errorMsg[1].error}
                            helperText={form.errorMsg[1].helperText}
                            onBlur={phoneOnBlur}

                        />

                        <TextField
                            label={"password"}
                            fullWidth
                            type={"password"}
                            error={form.errorMsg[2].error}
                            helperText={form.errorMsg[2].helperText}
                            onBlur={pwdOnBlur}
                        />

                    </DialogContent>

                    <DialogActions>
                        <Button color="primary" onClick={() => registerEvent()}>
                            Register
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>

        </React.Fragment>
    )

}


