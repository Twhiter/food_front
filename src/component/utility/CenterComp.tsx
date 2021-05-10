import React,{CSSProperties, FC} from "react";
import style from "../../style/CenterComProps.module.css"
interface CenterCompProps {
    style?:CSSProperties;
}


export const CenterComp:FC<CenterCompProps> = props => {

    return(
        <React.Fragment>
            <div className={style.container} style={props.style}>
                {props.children}
            </div>
        </React.Fragment>
    )
}

CenterComp.defaultProps = {
    style:{}
}
