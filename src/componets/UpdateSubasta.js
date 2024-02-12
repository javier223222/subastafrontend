import { Button, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'

import DeleteIcon from "@mui/icons-material/Delete"
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
const UpdateSubasta = ({name,description,idsubasta}) => {
    const [showupdate,setShowUpdate]=useState(false)
    const [update,setUpdate]=useState(null)
    const handleShow=()=>{
        setShowUpdate(x=>!x)
    }

    const handleChange=(e)=>{
       setUpdate(e.target.value)

    }
    const handelclose=()=>{
        handleShow()
        setUpdate(null)
    }

    const handelSubmit=(e)=>{
        e.preventDefault()
        if(update){
         axios.patch(`http://localhost:3002/api/subasta`,{
             idSubasta:parseInt(idsubasta),
             type:"name",
             nameSubast:update
         },{
            headers:{
                "x-access-token":localStorage.getItem("token")
            }
         }).then(res=>{
            console.log(res.data)
            handelclose()

         })


        
        }else{
            alert("necesitas escribiur algo")
            return
        }
    }
  return (
    <>
    {
        showupdate?<>
        <TextField id="outlined-basic" onChange={handleChange} label="Actualizar descripcion" variant="outlined" />
        <Stack direction="row" spacing={2}>
      <Button onClick={handelclose} variant="outlined" startIcon={<DeleteIcon />}>
        Cancelar
      </Button>
      <Button onClick={handelSubmit}  variant="contained" endIcon={<SendIcon />}>
        Actualizar
      </Button>
    </Stack>

        </>: <h1 onClick={handleShow}>{name}</h1>
    }
       
    </>
  )
}


export default UpdateSubasta