import React, {CSSProperties, Dispatch, SetStateAction, useEffect, useState} from "react";
import {FC} from "react";
import {
    Dialog, Input, MenuItem, Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField, Typography
} from "@material-ui/core";
import {FoodArea, FoodOnSale} from "../../dataStructure/Food";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {responseHandler} from "../../utility/handler";
import * as FoodType from "../../dataStructure/Food";
import deepcopy from "deepcopy";
import {useAllIngredients} from "../../utility/Hooks";
import {CenterComp} from "../utility/CenterComp";
import {log} from "util";

export const FoodControl = () => {


    const [items,setItem] = useState<FoodOnSale[]>([]);

    useEffect(() => {
        axios.get("/api/foodAreas")
            .then(resp => responseHandler<FoodArea[]>(resp))
            .then(data => setItem(data.flatMap(value => value.items)));
    },[]);

    const [open,setOpen] = useState(false);



    return (
        <div style={{marginTop:'20px'}}>
            <Button color={"primary"} onClick={() => setOpen(true)}>Add Food</Button>
            <FoodTable items={items}/>
            <FoodAddPopWindows open={open} setOpen={setOpen}/>
        </div>
    )
}

interface FoodAddPopWindowsProps {
    open:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
}

export const FoodAddPopWindows:FC<FoodAddPopWindowsProps> = props => {

    const [name,setName] = useState("");
    const [category,setCategory] = useState("");
    const [file,setFile] = useState<string>("");
    const [fileName,setFileName] = useState("")


    function addClick() {

        axios.post("/api/foodBase",{
            name:name,
            category:category,
            fileName:fileName,
            image:file})
            .then(resp => responseHandler<boolean>(resp))
            .then(data => {
                if (data) {
                    alert('success');
                    props.setOpen(false);
                }
            })

    }



    return (
        <Dialog open={props.open} onClose={() => props.setOpen(false)}>

            <div style={{padding:'10px'}}>
                <TextField label={"Name"} onChange={e => setName(e.target.value)}/>
            </div>

            <div style={{padding:'10px'}}>
                <TextField label={"Category"} onChange={e => setCategory(e.target.value)}/>
            </div>

            <div style={{padding:'10px'}}>
                <img src={file} alt={""}/>
            </div>

            <div style={{padding:'10px'}}>
                <input type={"file"} onChange={event =>
                {
                    const reader = new FileReader();


                    reader.addEventListener("load",() => {
                        setFile(reader.result as string);
                    });
                    reader.readAsDataURL(event.target.files[0]);
                    setFileName(event.target.files[0].name);

                }}/>
            </div>

            <div style={{padding:'10px'}}>
                <CenterComp>
                    <Button color={"primary"}
                            variant={"contained"}
                            onClick={addClick}
                    >Add</Button>
                </CenterComp>
            </div>

        </Dialog>
    )


}




interface FoodTableProps{

    items:FoodOnSale[]

}


export const FoodTable:FC<FoodTableProps> = props => {


    const [open,setOpen] = useState(false);
    const [selected,setSelected] = useState<FoodOnSale>(null);

    function modifyAndDetail(value) {
        setOpen(true);
        setSelected(value);
    }



    return (
        <React.Fragment>

            <TableContainer>


                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>FoodBase ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Ingredients</TableCell>
                            <TableCell>Operation</TableCell>
                        </TableRow>
                    </TableHead>


                    <TableBody>
                        {
                            props.items.map(value => (
                                <TableRow key={value.FoodBase_id}>
                                    <TableCell>{value.FoodBase_id}</TableCell>
                                    <TableCell>{value.name}</TableCell>
                                    <TableCell><img src={value.image} alt=""/></TableCell>
                                    <TableCell>{value.category}</TableCell>
                                    <TableCell>{value.ingredients.join(",")}</TableCell>
                                    <TableCell>
                                        <Button
                                            color={"primary"}
                                            onClick={() => modifyAndDetail(value)}>
                                            Modify & Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                )
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {
                selected?<OperationPopUp
                    open={open}
                    setOpen={setOpen}
                    selectedItem={selected}
                    setSelectedItem={setSelected}
                />:null
            }

        </React.Fragment>
    )
}

interface OperationPopUpProps {
    open:boolean
    setOpen:React.Dispatch<SetStateAction<boolean>>
    selectedItem:FoodOnSale
    setSelectedItem:Dispatch<SetStateAction<FoodOnSale>>
}

interface IngModification {
    FoodBase_id:number
    add:string[],
    rm:string[]
}

interface SpeModification {
    add:{
        style:string,
        size:string,
        price:number
    }[],
    rm:{
        id:number,
        style:string,
        size:string,
        price:number
    }[],
}




const OperationPopUp:FC<OperationPopUpProps> = props => {






    const [rs,setRs] = useState<FoodOnSale>(deepcopy(props.selectedItem));
    const [allIn,setAllIn] = useAllIngredients();
    const [specMody,setSpecMody] = useState<SpeModification>({
        add:[],
        rm:[]
    });

    const [ingMody,setIngMody] = useState<IngModification>({
        FoodBase_id:props.selectedItem.FoodBase_id,
        add:[],
        rm:[]
    });

    const list = [];
    for (let style in props.selectedItem.style_size_price)
        for (let size in props.selectedItem.style_size_price[style])

            list.push({
                style: style,
                size: size,
                price: props.selectedItem.style_size_price[style][size].price,
                id: props.selectedItem.style_size_price[style][size].id
            });

    const [l,setList] = useState<{style:string,size:string,price:number,id:number}[]>(list);


    useEffect(() => {
        setRs(deepcopy(props.selectedItem));
        setIngMody({
            FoodBase_id:props.selectedItem.FoodBase_id,
            add:[],
            rm:[]
        });
        setSpecMody({
            add:[],
            rm:[]
        });

        const list2 = [];
        for (let style in props.selectedItem.style_size_price)
            for (let size in props.selectedItem.style_size_price[style])

                list2.push({
                    style: style,
                    size: size,
                    price: props.selectedItem.style_size_price[style][size].price,
                    id: props.selectedItem.style_size_price[style][size].id
                });

        setList(list);

    },[props.selectedItem]);


    function setIngredients(newIng:string[]) {
        setRs(prevState => ({...prevState,ingredients:newIng}));
    }


    function save() {
        const t = {
            FoodBase_id:rs.FoodBase_id,
            name:rs.name,
            category:rs.category,
            ingredients:{
                add:ingMody.add,
                rm:ingMody.rm
            },

            specification:{
                add:specMody.add,
                rm:specMody.rm.map(value => value.id)
            }
        }

        axios.put("/api/FoodBase",t)
            .then(resp => responseHandler<boolean>(resp))
            .then(data => {
                if (data) {
                    alert('success');
                    props.setOpen(false);
                }
            });
    }


    function deleteClick() {

        axios.delete("/api/FoodBase/" + rs.FoodBase_id)
            .then(resp => responseHandler<boolean>(resp))
            .then(data => {
                if (data) {
                    alert('success');
                    props.setOpen(false);
                }
            })



    }



    return (
        <React.Fragment>
            <Dialog open={props.open}
                    onClose={() => props.setOpen(false)}
                    fullWidth>

                    <div style={{margin:'10px'}}>
                        <TextField label={"FoodBase ID"}
                                   value={rs.FoodBase_id}
                        />
                    </div>

                    <div style={{margin:'10px'}}>
                        <TextField label={"Name"}
                                   value={rs.name}
                                   onChange={e => setRs(prevState => ({...prevState,name:e.target.value}))}
                        />
                    </div>


                    <div style={{padding:'10px'}}>
                        <img src={rs.image} alt=""/>
                    </div>


                    <div style={{margin:'10px'}}>
                        <TextField label={"Category"}
                                   value={rs.category}
                                   onChange={e => setRs(prevState => ({...prevState,category:e.target.value}))}
                        />
                    </div>

                    <div style={{margin:'10px'}}>
                        <IngredientSelector
                            setIngMody={setIngMody}
                            ingMody={ingMody}
                            ingredients={rs.ingredients}
                            setIngredients={setIngredients}
                            allIngredients={allIn}/>
                    </div>


                <div style={{margin:'10px'}}>
                    <SpecificationSelector
                        list={l}
                        setList={setList}
                        specMody={specMody}
                        setSpecMody={setSpecMody}/>
                </div>


                    <Button color={"primary"} variant={"contained"} onClick={save}>Save</Button>
                    <Button color={"secondary"} variant={"contained"} onClick={deleteClick}>Delete</Button>

            </Dialog>
        </React.Fragment>
    )
}



interface specificationSelector {
    list:{style:string,size:string,price:number,id:number}[]
    setList:Dispatch<SetStateAction<{style:string,size:string,price:number,id:number}[]>>
    specMody:SpeModification
    setSpecMody:Dispatch<SetStateAction<SpeModification>>
}


const SpecificationSelector:FC<specificationSelector> = props => {


    function deleteClick(value,index) {
        props.setList(prevState => {
            const t = [...prevState];
            t.splice(index,1);
            return t;
        });

        let rm = props.specMody.rm;
        let add = props.specMody.add;


        const i = add.findIndex(value1 =>
            value1.price === value.price
            && value1.size === value.size
            && value1.style === value.style
        );


        if (i === -1)
            rm.push(value);
        else
            add.splice(i,1);

        console.log('add:')
        console.log(add);
        console.log(rm);

        props.setSpecMody({add:add,rm:rm});
    }


    const left = props.list.map((value,index) => (
        <div key={value.id} style={{display:'flex',alignItems:'center'}}>

            <div style={{margin:'2px'}}>{value.style}</div>
            <div style={{margin:'2px'}}>{value.size}</div>
            <div style={{margin:'2px'}}>{value.price}BYN</div>
            <div style={{margin:'2px'}}>
                <Button
                    color={"secondary"}
                    onClick={() => deleteClick(value,index)}
                >
                    Delete</Button>
            </div>
        </div>
    ));


    function addClick(style,size,price:number) {

        const add = [...props.specMody.add];
        const rm = [...props.specMody.rm];

        let i = rm.findIndex(value =>
            value.style === style
            && value.size === size
            && value.price.toFixed(2) === price.toFixed(2)
        );

        if (i == -1)
            props.setList(prevState => prevState.concat({style,size,price,id:null}));
        else
            props.setList(prevState => prevState.concat(rm[i]));


        if (i == -1)
            add.push({style:style,size:size,price:price});
        else
            rm.splice(i,1);

        props.setSpecMody({add:add,rm:rm});


        console.log('add:')
        console.log(add)
        console.log(rm);


    }


    const right = () => {
        let style;
        let size;
        let price:number;

        return (
            <React.Fragment>

                <div style={{marginTop:'30px',padding:'5px'}}>
                    <CenterComp>
                        <TextField
                            label={"style"}
                            onChange={e => style = e.target.value}
                            value={style}
                        />
                        <TextField
                            label={"size"}
                            onChange={e => size = e.target.value}
                            value={size}
                        />
                        <TextField
                            label={"price"}
                            onChange={e => price = Number(e.target.value)}
                            value={price}
                        />
                    </CenterComp>

                    <CenterComp>
                        <Button
                            color={"primary"}
                            onClick={() => addClick(style,size,price)}
                        >Add</Button>
                    </CenterComp>
                </div>



            </React.Fragment>
        )


    }


    return (
        <React.Fragment>
            <Typography variant={"h5"} align={"center"} style={{marginBottom:'15px'}}>Specification</Typography>
            <Selector left={left} right={right()}/>
        </React.Fragment>
    )

}



interface IngredientSelectorProps {
    ingredients:string[],
    setIngredients:(newIng:string[]) => void
    allIngredients:string[]
    ingMody:IngModification
    setIngMody:Dispatch<SetStateAction<IngModification>>
}

const IngredientSelector:FC<IngredientSelectorProps> = props => {


    function deleteClick(val) {
        props.setIngredients(props.ingredients.filter(value1 => value1 !== val))
        props.setIngMody(prevState => {


            let add = [...prevState.add];
            let rm = [...prevState.rm];

            const index = add.indexOf(val);

            if (index === -1)
                rm.push(val);
            else
                add.splice(index,1);

            return {
                ...prevState,
                rm:rm,
                add:add
            }
        });
    }

    function addClick(val) {
        if (!val)
            return;

        props.setIngredients(props.ingredients.concat(selectedVal));
        props.setIngMody(prevState => {


            let rm = [...prevState.rm];
            let add = [...prevState.add];

            const index = rm.indexOf(val);

            if (index !== -1)
                rm.splice(index,1);
            else
                add.push(val);


            return {
                ...prevState,
                add:add,
                rm:rm
            };
        })

    }


    const left = props.ingredients.map(value => (
        <div key={value} style={{display:'flex',alignItems:'center'}}>
            <div>{value}</div>
            <div>
                <Button
                    color={"secondary"}
                    onClick={() => deleteClick(value)}
                >
                    Delete</Button>
            </div>
        </div>
    ));


    let selectedVal:string;


    const right = (
            <div style={{marginTop:'20px'}}>
                <CenterComp style={{width:'100%'}}>
                    <Select
                        defaultChecked
                        onChange={(e) => selectedVal = e.target.value as string}>
                        {
                            props.allIngredients.filter(value => !props.ingredients.includes(value))
                                .map(value => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))
                        }
                    </Select>
                </CenterComp>
                <CenterComp style={{width:'100%'}}>
                    <Button
                        color={"primary"}
                        onClick={() => addClick(selectedVal)}
                    >add new Ingredient</Button>
                </CenterComp>
            </div>
    )
    return (
        <React.Fragment>
            <Typography variant={"h5"} align={"center"} style={{marginBottom:'15px'}}>Ingredients</Typography>
            <Selector left={left} right={right}/>
        </React.Fragment>
    )

};


interface SelectorProps {
    left:any
    right:any
    style?:CSSProperties
}



const Selector:FC<SelectorProps> = props => {


    let defaultStyle:CSSProperties = {
        display:'flex',
    };


    const leftCss:CSSProperties = {
        borderRight:"solid 2px",
        flexGrow:0

    };

    const rightCss:CSSProperties = {
        borderLeft:"solid 2px",
        flexGrow:1
    };



    return (
        <div style={{...defaultStyle,...props.style}}>

            <div style={leftCss}>
                {props.left}
            </div>

            <div style={rightCss}>
                {props.right}
            </div>
        </div>
    )
}

Selector.defaultProps = {
    style:{}
};



