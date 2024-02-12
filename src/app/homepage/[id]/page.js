"use client"
import UpdateSubasta from '@/componets/UpdateSubasta'
import { Image } from '@mui/icons-material'
import { Box, Button, Grid, Paper, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import {io} from 'socket.io-client'
const Subasta = ({params}) => {
    const [socket,setSocket]=useState(undefined)
    const [subasta,setSubasta]=useState({})
    const [endSubasta,setEndSubasta]=useState(false)
    const [isAdmin,setIsAdmin]=useState(true)
    const [winner,setWinner]=useState({})
    const [pujas,setPujas]=useState([])
    const [precioByuser,setPrecioByUser]=useState(null)
    const [price,setPrice]=useState(0)

   
    useEffect(()=>{
       const socket=io("http://localhost:3002/subastas",{
        auth:{
            token:localStorage.getItem('token')
        }
       })
       socket.emit("join-room",{room:params.id,token:localStorage.getItem('token')})
       socket.on("end-subasta",(data)=>{
            setEndSubasta(data)
       })
       socket.on("winner",(data)=>{
            setWinner(data)
       })
       socket.on("is-admin",(data)=>{
            console.log(data)
       })
       
       socket.on("info-subasta",(data)=>{
        setSubasta(data)
       })
       socket.on("get-pujas",(data)=>{
        console.log(data)
        setPujas(data)
        if(data.length==0){

        }else{
            setPrice(parseInt(data[0].precio))
        }
       })
       socket.on("new-price",(data)=>{
        setPrice(parseInt(data.precio))
       })
       socket.on("error",data=>{
        console.log(data)
       })
       
       setSocket(socket)
       shortPollign()

      axios.get(`http://localhost:3002/api/subasta/isAdmin?room=${params.id}`,{
        headers:{
            "x-access-token":localStorage.getItem('token')
        }
      }).then(res=>{
        if(res.data){
          setIsAdmin(res.data.result)
        }
      })
       
    },[])


    const shortPollign=()=>{
        setInterval(async()=>{
           let response=await fetch(`http://localhost:3002/api/subasta?id=${params.id}`,{
            headers:{
                "x-access-token":localStorage.getItem("token") 
            }
           })
           let data=await response.json()

           setSubasta(data.result)
          
        },5000)
    }

    const handelPrice=(e)=>{
        setPrecioByUser(e.target.value)
    }
    const habdleSubmit=(e)=>{
        e.preventDefault()
        if(price>parseInt(precioByuser)){
            alert("necesitas proponer un precio mas alto")
            return
        }else if(parseInt(precioByuser)<=0){
            alert("agregeun numero mayor a cero")
        }

        socket.emit("add_puja",{room:params.id,token:localStorage.getItem("token"),precio:precioByuser})

    }
    

  return (
    <div>
     <Box sx={{ flexGrow: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={8}>
         <img src={`${subasta.imagesubasta}`}></img>
        </Grid>
        <Grid item xs={4}>
        {isAdmin?
         <UpdateSubasta idsubasta={params.id}  name={subasta.namesubasta}></UpdateSubasta>: <h1>{subasta.namesubasta}</h1>
        }
         
        </Grid>
        <Grid item xs={4}>
          <h3>{subasta.descripcion}</h3>
        </Grid>
        <Grid item xs={8}>
        <Paper
        
                sx={{
                  height: 140,
                  width: 100,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
              >
              {
                endSubasta?<>
                    <h4>precio ganador ${winner.precio}</h4>
                    <p>Usuario ganador {winner.username}</p>
                </>:<h4>oferta actual ${price}</h4>
              }
                
              </Paper>
        </Grid>
       
      </Grid>
    </Box>
    <Grid container spacing={2}>
  
       {
        pujas.length!=0?pujas.map((x,i) => <Grid key={i} item xs={12} md={12}>
            <h2>{x.user.username}</h2>
            <p>${x.precio}</p>
        </Grid>):<></>
       }

        
      </Grid>
    {
        isAdmin || endSubasta?<></>:  <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
        <TextField id="outlined-basic" onChange={handelPrice} label="precio" variant="outlined" type='number' fullWidth />
        </Grid>
        <Grid item xs={6} md={4}>
        <Button onClick={habdleSubmit} variant="contained">Agregar oferta</Button>
        </Grid>
       
      </Grid>
    </Box>
    
    }
     
   

    

        
    </div>
  )
}

export default Subasta