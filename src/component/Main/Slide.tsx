import {CSSProperties, FC, LegacyRef, useEffect, useState} from "react";
import style from "../../style/Slide.module.css"


interface SlideProp {


    autoPlay?:boolean
    showDot?:boolean

    preNexStyle?:CSSProperties
    captionTextStyle?:CSSProperties
    dotStyle?:CSSProperties
    leftUpperTextStyle?:CSSProperties

    content:Content[]

}

export interface Content {

    captionText?:string
    imgHref:string
    leftUpperText?:string
    ref?:LegacyRef<HTMLDivElement>


}


export const Slide:FC<SlideProp> = (prop) => {


    const [index,setIndex] = useState(0);


    useEffect(() => {
        const internal = setInterval(() => plusSlides(1),3000);
        return () => clearInterval(internal);
    })



    let dots= () => {
        return (
            <></>
        )
    };


    if (prop.showDot)

        dots = () => {
            return (
                <div style={{textAlign:"center"}}>
                    {prop.content.map((value,i) => {

                        let activeStyle = "";
                        if (i === index)
                            activeStyle = style.active;

                        return (
                            <span key={i} className={`${style.dot} ${activeStyle}`} onClick={() => showSlide(i)}/>
                        )
                    })}
                </div>
            )
        }




    // Next/previous controls
    function plusSlides(n:number) {
        setIndex(index => {
            const newIndex = index + n;
            if (newIndex >= prop.content.length)
                return 0;
            else if (newIndex < 0)
                return prop.content.length - 1;
            else
                return newIndex;
        });
    }

    function showSlide(n: number) {
        setIndex(n);
    }


    return(
        <>
            {/*{-- Slideshow container }*/}
            <div className={style['slideshow-container']} style={{boxSizing:"border-box"}}>

                {/*Full-width images with number and caption text */}
                {prop.content.map((value,i) => {

                    const displayStyle=(i===index)?'block':'none';

                        return (
                            <div className={`${style.fade}`} ref={value.ref} key={i} style={{display:displayStyle,boxSizing:"border-box"}}>
                                <div className={style.numbertext}>{value.leftUpperText}</div>
                                <img src={value.imgHref} style={{width:"100%",boxSizing:"border-box"}} alt=""/>
                                <div className={style.text}>{value.captionText}</div>
                            </div>
                        )

                })}






                <a className={style.prev} onClick={() => plusSlides(-1)}>&#10094;</a>

                <a className={style.next} onClick={()=> plusSlides(1)}>&#10095;</a>
            </div>
            <br/>


                {dots()}
        </>
    )
}

Slide.defaultProps = {
    autoPlay:false,
    showDot:false,

    preNexStyle:{},
    captionTextStyle:{},
    dotStyle:{},
    leftUpperTextStyle:{}

}
