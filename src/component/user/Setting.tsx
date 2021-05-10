import React from "react";
import {useParams} from "react-router";
import {CenterComp} from "../utility/CenterComp";
import {Grid, TextField} from "@material-ui/core";
import {fetchUserInfo} from "../../utility/Hooks";
import Button from "@material-ui/core/Button";

export function Setting() {

    const user_id = Number((useParams<{ user_id: string }>()).user_id);

    const [baseInfo, setBaseInfo] = fetchUserInfo(user_id);


    return (
        <React.Fragment>


            <CenterComp style={{marginTop: '250px'}}>

                <div>
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField label={"user_id"} value={baseInfo.user_id}/>
                        </Grid>


                        <Grid item xs={12}>
                            <TextField label={"username"} value={baseInfo.username}/>
                        </Grid>


                        <Grid item xs={12}>
                            <TextField label={"phone"} value={baseInfo.phone}/>
                        </Grid>

                        <Grid item={12}>
                            <Button color={"primary"}>change mobile phone number</Button>
                        </Grid>


                    </Grid>
                </div>


            </CenterComp>

        </React.Fragment>
    )

}
