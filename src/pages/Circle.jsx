import React, { useContext, useEffect, useState } from 'react'
import SearchIcon from '../assets/images/BiSearch.svg'
import CardCircle from '../assets/components/CardCircle'
import circleicon from '../assets/images/circleicon.svg'
import { BiMessageSquareAdd, BiSearch } from 'react-icons/bi'
import { RxCross2 } from 'react-icons/rx'
import CardSearch from '../assets/components/CardSearch'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import CardNote from '../assets/components/CardNote'
import { RiStickyNoteAddLine } from 'react-icons/ri'
import { addNewNoteAPI, getCircleDataAPI, getUserDataAPI, joinCircleAPI } from '../services/allAPI'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CircleAvatarComponent from '../assets/components/CircleAvatarComponent'
import { Flip, toast, ToastContainer } from 'react-toastify'
import NotesGrid from '../assets/components/NotesGrid'
import { FiUsers } from 'react-icons/fi'
import { HiOutlineViewGridAdd, HiViewGrid } from 'react-icons/hi'
import UserContext from '../assets/ContextAPI/UserContext'
import UserAvatarComponent from '../assets/components/UserAvatarComponent'


function Circle() {

  let { id } = useParams();
  const navigate = useNavigate();

  const [circleData,setCircleData]=useState({})

  const [userResponse, setuserResponse] = useContext(UserContext);
  console.log("userresponse",userResponse);

  const[change,setChange]=useState(false)



  const [newNote,setNewNote] = useState({
    noteTitle : "",
    noteDes : "",
  })

  const getCircleData = async () => {

      try {
        const result = await getCircleDataAPI(id);
        console.log("Get Circler Data Result:", result);
        if (result.status === 200) {
          setCircleData(result.data)

        } else {
          console.log("Get Circle Data Error:", result.response.data);
        }
      } catch (err) {
        console.log("Get circle Data Catch Error:", err);
      }

  };

  const handleAddNewNotes = async (e) => {
    e.preventDefault();

    const {noteTitle,noteDes}=newNote;

    if (noteTitle == "" || noteDes == "" ) {
      toast.info("Please fill the missing field");
    } else {
      const reqBody = new FormData();
      reqBody.append("cityId", sessionStorage.getItem("selectedCityId"));
      reqBody.append("circleId", id);
      reqBody.append("noteTitle", noteTitle);
      reqBody.append("noteDes", noteDes);
      const token = sessionStorage.getItem("token");
      console.log("Token:", token);
      if (token) {
        const reqHeader = {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        try {
          const result = await addNewNoteAPI(reqBody, reqHeader);
          console.log("Add Note Result:", result);
          if (result.status === 200) {
            getCircleData()
            toast.success("Note Added Successfully");
            document.getElementById("modalAdd").classList.toggle("hidden");
            setNewNote({
              noteTitle : "",
              noteDes : "",
            });
            navigate(0)

          } else {
            console.log("Add Note Error:", result.response.data);
          }
        } catch (err) {
          console.log("Add Note Catch Error:", err);
        }
      }
    }
  };

  const getUserData = async () => {
    const reqBody = new FormData();
    const token = sessionStorage.getItem("token");
    console.log("Token:", token);
    if (token) {
      const reqHeader = {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      try {
        const result = await getUserDataAPI(reqBody, reqHeader);
        console.log("Get User Data Result:", result);
        if (result.status === 200) {
          setuserResponse(result.data);
        } else {
          console.log("Get User Data Error:", result.response.data);
        }
      } catch (err) {
        console.log("Get User Data Catch Error:", err);
      }
    }
  };

  const handlejoinCircle = async (e) => {
    e.preventDefault();


      const token = sessionStorage.getItem("token");
      console.log("Token:", token);
      if (token) {
        const reqHeader = {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        try {
          const result = await joinCircleAPI( id,reqHeader);
          console.log("join Circle Result:", result);
          if (result.status === 200) {
            console.log("Circle joined/exited Successfully");
            setChange(!change)
          } else {
            console.log("join/exit Circle Error:", result.response.data);
          }
        } catch (err) {
          console.log("join/exit Circle Catch Error:", err);
        }
      }

  };


  useEffect(()=>{
    getUserData();
    getCircleData()
  },[change])

  useEffect(() => {
    console.log("Updated circleData:", circleData);
  }, [circleData]);

  const handleCopyUrl = () => {
    // Create the full URL
    const fullUrl = `${window.location}`;

    // Copy to clipboard
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };


  return (
    <>
    <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />
     <div className='w-[100vw] md:h-[85vh] h-[82vh] md:px-40 px-3 overflow-x-hidden'>
        <div className="w-full h-full bg-primary rounded-t-xl ">

        <div className="w-full flex justify-between pt-10 items-center ">
          <div className="md:text-3xl text-xl font-semibold text-info flex items-center gap-5 ps-10 pb-7 md:pb-0">
          {/* <img src={circleicon} alt="" className='md:w-16 w-10' /> */}
          <CircleAvatarComponent seed={circleData.circlePic} size={"lg"}/>
            <h2>{circleData.circleName}</h2>
          </div>

        </div>

        <div className="flex gap-3 justify-end items-center px-5 relative bottom-3 ">



          <button className='rounded-full p-2 bg-info text-sm font-semibold flex items-center gap-2 text-secondary px-3  flex justify-center items-center px-2' onClick={()=>document.getElementById('modalMembers').classList.toggle('hidden')} >

            {circleData.circleMembers?.length} <FiUsers className='text-xl'/>
            </button>

            <button className='rounded-full p-2 bg-info text-sm font-semibold flex items-center gap-2 text-secondary px-3  flex justify-center items-center' onClick={e=>handlejoinCircle(e)} >

            { circleData?.circleMembers?.some(obj => Object.values(obj).includes(userResponse?._id)) ? <HiViewGrid className='text-xl' />
            : <HiOutlineViewGridAdd className='text-xl'/>}
            </button>


            {/* modal Members  */}
            <div className="fixed z-10 top-0 left-0 w-[100vw] h-[100vh] hidden justify-center items-center backdrop-blur-sm   flex justify-center items-center  " id="modalMembers">

              <button className='md:relative fixed z-20 left-80 mb-[90vh] md:mb-0 md:bottom-64 md:left-2/4 md:me-10 text-white ms-5 md:ms-0' onClick={()=>document.getElementById('modalMembers').classList.toggle('hidden')} >
                <RxCross2/>
              </button>
              <div className="md:w-2/4 md:h-5/6 w-full h-full bg-success md:rounded-lg flex flex-col justify-center  p-5">

              <p className='text-2xl text-info font-semibold pt-8 ps-10'>Members </p>

              <div className='w-full flex justify-center h-[93%]'>
              <div className=' md:w-[43vw] w-[85vw] mt-10 overflow-y-scroll'>

                {
                  circleData?.circleMembers?.map(user=>{
                    return(
                      <Link key={user?._id} to={`/userpage/${user?._id}`}>
                    <div  className="bg-info w-full rounded-lg flex p-4 items-center gap-3 mb-3">
                    {/* <img src={avatar} alt="" /> */}
                    <UserAvatarComponent seed={user?.userPic}/>
                    <p className=' font-semibold text-secondary'>{user?.userName}</p>
                  </div>
                  </Link>
                    )
                  })
                }


              </div>
              </div>

              </div>

              </div>

              <button className='rounded-full p-2 bg-info text-sm font-semibold flex items-center gap-2 text-secondary px-3  flex justify-center items-center' onClick={handleCopyUrl} >
            <IoPaperPlaneOutline className='text-xl'/>

            </button>


            <button className='rounded-full p-2 bg-info text-sm font-semibold flex items-center gap-2 text-secondary px-3  flex justify-center items-center' onClick={()=>document.getElementById('modalAdd').classList.toggle('hidden')} >
            <RiStickyNoteAddLine className='text-xl'/>

            </button>


            {/* modal Add */}
            <div className="fixed z-10 top-0 left-0 w-[100vw] h-[100vh] hidden justify-center items-center backdrop-blur-sm   flex justify-center items-center  " id="modalAdd">

              <button className='md:relative fixed z-20 left-80 mb-[90vh] md:mb-0 md:bottom-64 md:left-2/4 md:me-10 text-white ms-5 md:ms-0' onClick={()=>document.getElementById('modalAdd').classList.toggle('hidden')} >
                <RxCross2/>
              </button>
              <div className="md:w-2/4 md:h-5/6 w-full h-full bg-success md:rounded-lg pt-20 p-5">

              <p className='text-2xl text-info font-semibold'>Create New Post </p>

              {/* heading */}
              <div className='bg-info w-full rounded-lg flex flex-col gap-3 mt-5 p-3'>
                <input value={newNote.noteTitle} onChange={e=>setNewNote({...newNote,noteTitle:e.target.value})} name="" id="" className='w-full outline-none bg-transparent rounded-lg ' placeholder='add Heading...'/>
              </div>

              {/* add content */}
              <div className='bg-info w-full rounded-lg flex flex-col gap-3 mt-5 p-3'>
                <textarea  value={newNote.noteDes} onChange={e=>setNewNote({...newNote,noteDes:e.target.value})} name="" id="" className='w-full outline-none bg-transparent rounded-lg h-80 ' placeholder='add Details...'></textarea>

                <div className="flex w-full justify-end">

                  <button onClick={(e)=>handleAddNewNotes(e)} className='h-9 rounded-full p-2 bg-secondary text-sm font-semibold flex items-center gap-2 text-info px-3  flex justify-center items-center'>
                  <RiStickyNoteAddLine className='text-xl'/>
                        Add Note
                  </button>
                </div>

              </div>

              </div>

              </div>




          </div>

        {/* <div className=" bg-gradient-to-b from-primary to-transparent w-full h-5 relative top-6 "></div> */}

        {/* cards group*/}
        <div className="w-[100%] h-[78%] md:h-[78.9%] mt-2  overflow-y-scroll pt-5 bg-secondary md:px-5 ">

          {/* <div className=' w-full md:flex grid gap-3 pb-3 md:pb-0 md:gap-0  '>
          <CardNote className=" h-[100%]" note="Anyone up for coffee this Saturday? New to the city and looking to meet some people " like="75" />
          <CardNote className=" h-[100%]" note="Looking for a part-time web developer. DM me for details!" like="5" />
          </div> */}
          <div className=' w-full md:flex grid gap-3 pb-3 md:pb-0 md:gap-0  '>
          <NotesGrid circleNotes={circleData.circleNotes || []} getCircleData />
          </div>

        </div>

        </div>
      </div>
    </>
  )
}

export default Circle