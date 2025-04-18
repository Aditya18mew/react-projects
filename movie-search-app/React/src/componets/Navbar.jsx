import axios from "axios"
import {memo, useEffect, useState } from "react"
import { useCustomcontext } from "./useCustomcontext"
import { useCallback } from "react"





 // eslint-disable-next-line react/prop-types
 function Navbar({setisloading,setmessage,setiserror}){
  const [search,setsearch]=useState({
    name:"",
    value:""
  })
  const {setcurrent}=useCustomcontext()
  const debounce=useDebounce(search.value,500)

    function handlechange(event){
       const {name,value}=event.target
       setsearch({name:name,value:value})
    }
    
   const fetchsearch=useCallback(
    async (name)=>{
        try{
        setisloading(true)
        setiserror(false)
    const response=await axios.post("http://localhost:5000/api/searchmovie",{name:name})
       if(!response.data.success){
          setiserror(true)
          setmessage("Network error")
          return
       }
        setisloading(false)
        setcurrent(response.data.arr)
        }catch(err){
            setiserror(true)
            setmessage(`Network error`)
        }
    },[]) 

  async function fetchwishlist(){
    try {
      setisloading(true)
      setiserror(false)
          const   response=await axios.post("http://localhost:5000/api/getwishlist",{name:"user"})
      if(!response.data.success){
        setiserror(true)
        setmessage('Network error')
      }
      setisloading(false)
      setcurrent(response.data.results)
    } catch (err) {
      setiserror(true)
      setmessage("Network error")
    }
  }
  async function fetchfavorites(){
    try {
      setisloading(true)
      setiserror(false)
          const   response=await axios.post("http://localhost:5000/api/getfavorites",{name:"user"})
      if(!response.data.success){
        setiserror(true)
        setmessage('Network error')
      }
      setisloading(false)
      setcurrent(response.data.results)
    } catch (err) {
      setiserror(true)
      setmessage("Network error")
    }
  }



useEffect(()=>{
if(debounce){
    fetchsearch(debounce)
}
},[debounce,fetchsearch])
  


    return <nav className="navbar">
        <h2 onClick={()=>{
          window.location.href="/home"
        }}>Movie search</h2>
   <div className="div_input"> <input type="search" value={search.value} id="search" onChange={handlechange} name="search" placeholder="Search"/>
        <div className="input-with-icon"></div> </div> 
        <div onClick={()=>{
      fetchwishlist()
        }} className="div_btn">Wishlist</div>
        <div onClick={()=>{
          fetchfavorites()
        }} className="div_btn">Favorites</div>
    </nav>
}


function useDebounce(value,delay){
  const [debounce,setdebounce]=useState(value)

  useEffect(()=>{
    const timer=setTimeout(()=>{
          setdebounce(value)
    },delay)

  return ()=>clearTimeout(timer)
  },[value,delay])

  return debounce
}



export const MemorizedNavbar=memo(Navbar)