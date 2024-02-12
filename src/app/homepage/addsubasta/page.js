"use client"
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useRouter } from "next/navigation"

const Addsubasta = props => {
  const [subasat,setSubasta]=useState({
    nombre:"",
    descripcion:""
  })
  const router=useRouter()
  const [image,setImage]=useState(null)
  const handlecHANGE=(e)=>{
    setSubasta({
      ...subasat,
      [e.target.name]:e.target.value
    })
  }
  const handelfile=(e)=>{
    setImage(e.target.files[0])
  }

  const handelsubmit=(e)=>{
    
    e.preventDefault()
    if(image===null||subasat.nombre===""||subasat.descripcion===""){
        alert("llene todos los campos")
        return
    }

    
    const formData=new FormData()
    formData.append('nameSubast',subasat.nombre)
    formData.append('descripcion',subasat.descripcion)
    formData.append('updatedAt',`2023-12-31 15:30:45`)
    formData.append('timeDurantion',`2023-12-31 15:30:45`)
    formData.append('finidAt',`2023-12-31 15:30:45`)
    formData.append('image',image)
    axios.post('http://localhost:3002/api/subasta',formData,{
      headers:{
        'x-access-token':localStorage.getItem('token')
      }
    }).then(res=>{
      console.log(res.data)
      alert("subasta agregada")
      router.push('/homepage')

    })
    console.log(formData)
  }

  return (
    <div>
      <input name='nombre'  onChange={handlecHANGE}>
      </input>
      <input name='descripcion' onChange={handlecHANGE}>
      </input>
      <input type="file" onChange={handelfile}>
      </input>
     <button onClick={handelsubmit}>Add subasta</button>
    </div>
  )
}


export default Addsubasta