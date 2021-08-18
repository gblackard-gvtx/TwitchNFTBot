import React from "react";
import ReactDom from "react-dom";
import ButtonAppBar from "./components/Nav";
const APP = ()=>{
    return(
        <div>
          <ButtonAppBar></ButtonAppBar>
        </div>
    )
}
ReactDom.render(<APP />, document.querySelector("#root"));