"use client"

import ActionAreaCard from '@/componets/cardSubasat'
import { Box, Button, Grid } from '@mui/material'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'

const Homepage = () => {
    const [subasta, setSubasta] = useState([])
    const [token, setToken] = useState(null)
    useEffect(()=>{
        setToken(localStorage.getItem('token'))
        axios.get(`http://localhost:3002/api/subasta`,{
            headers:{
                "x-access-token":localStorage.getItem('token')
            }
        }).then(res=>{
            console.log(res.data);
            setSubasta(res.data.result)
        
        })

        nuevosMensajes()
    },[])

    const getSubasta = () => {
        axios.get(`http://localhost:3002/api/subasta`).then(res=>{
            console.log(res.data);
            setSubasta(res.data)
        
        })
    }
    const nuevosMensajes=()=>{
        let nuevoMensaje=[]
        axios.get(`http://localhost:3002/api/subasta/nuevas_Subastas`,{
         headers:{
          "x-access-token":localStorage.getItem("token")
         }
       }).then((data)=>{
        nuevoMensaje=data.data.result
        
       }).finally(()=>{
        console.log(nuevoMensaje)
        setSubasta(nuevoMensaje)
        nuevosMensajes()
       })
    
    
      }
      const router=useRouter()

    
  return (
    <div>
    <Grid sx={{ flexGrow:10}} container spacing={2}>

      <Grid item xs={12}>

      <Button onClick={()=>{
        router.push("/homepage/addsubasta")
      }} variant="contained" color="success">
  Agregar Subasta
</Button>
        <Grid container justifyContent="center" spacing={12}>
        {

         subasta.map((subasta,index)=>{
          return  <Grid key={index} item> <Link href={`homepage/${subasta.idSubasta}`}> <ActionAreaCard imageUrl={subasta.imageSubasta
} key={index} name={subasta.nameSubata} description={subasta.descripcion
} id={subasta.idSubasta}></ActionAreaCard> </Link></Grid>
         }) 
        }
        </Grid>
    

  
        </Grid>
</Grid>

        
    </div>
  )
}

export default Homepage