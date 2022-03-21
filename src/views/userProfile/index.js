import React, { useState, useEffect } from 'react'
import { Inputfield } from '../../mydmdi-components/styles'
import { CButton, CCard, CCardBody } from '@coreui/react'
import axios from 'axios';
import UpdateUser from './updateUser';

import {
    Worker,
    Viewer,
    SpecialZoomLevel
} from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const UserProfile = () => {
    const logindata = localStorage.getItem('user')
    const logindatameta = localStorage.getItem('usermeta')
    const data = JSON.parse(logindata)
    const [useExist, setUserExist] = useState()
    const [Updateuserpage, setUpdateuserpage] = useState(true)
    const [userInfo, setUserInfo] = useState({
        firstname: "",
        lastname: "",
        phone: "" || data?.data?.to,
        wallet: "" || logindatameta,
        username: "",
        email: ""
    })
    const InputHandler = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }
    const getbyphone = async () => {
        if (logindata !== null) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/getUserbyphone`, {
                    phone: data.data.to
                });
                if (response) {
                    setUserExist(response.data)
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/getUserbywallet`, {
                    wallet: logindatameta
                });
                if (response) {
                    setUserExist(response.data)
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    useEffect(() => {
        getbyphone()
    }, [])
    const saveUserInfo = async () => {
        if (userInfo.firstname !== "" && userInfo.lastname !== "" && userInfo.phone !== "" && userInfo.email !== "" && userInfo.wallet !== "" && userInfo.username !== "") {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/userProfile`, {
                    userInfo
                });
                if (response) {
                    getbyphone()
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("fill all fields")
        }
    }

    const UpdateUsers = async (data) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/updateUser`, {
                data,
                id: data._id
            });
            if (response) {
                getbyphone()
            }
        } catch (error) {
            console.error(error);
        }
    }
    const getFilePluginInstance = getFilePlugin({
        fileNameGenerator: (file) => {
            const fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
            return `${fileName}`;
        },
    });
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;
    const [id, setid] = useState(0)
    return (
        <>
            {Updateuserpage ? (
                <>
                    <h3>User Profile Information</h3>
                    {!useExist ? (
                        <div style={{ width: '50%', margin: 'auto' }}>
                            <p style={{ marginBottom: '5px' }}>First Name</p>
                            <Inputfield type="text" value={userInfo.firstname} name="firstname" onChange={(e) => InputHandler(e)} />
                            <br />
                            <p style={{ marginBottom: '5px' }}>Last Name</p>
                            <Inputfield type="text" value={userInfo.lastname} name="lastname" onChange={(e) => InputHandler(e)} />
                            <br />
                            <p style={{ marginBottom: '5px' }}>Username</p>
                            <Inputfield type="text" value={userInfo.username} name="username" onChange={(e) => InputHandler(e)} />
                            <br />
                            <p style={{ marginBottom: '5px' }}>Email</p>
                            <Inputfield type="text" value={userInfo.email} name="email" onChange={(e) => InputHandler(e)} />
                            <br />
                            <p style={{ marginBottom: '5px' }}>Metamsk Wallet Address</p>
                            <Inputfield type="text" value={userInfo.wallet} name="wallet" onChange={(e) => InputHandler(e)} />
                            <br />
                            <p style={{ marginBottom: '5px' }}>Phone #</p>
                            <Inputfield type="text" value={userInfo.phone} name="phone" onChange={(e) => InputHandler(e)} />
                            <CButton style={{ width: '100%' }} component="input" type="button" onClick={() => saveUserInfo()} color="primary" className="px-4">Save</CButton>
                        </div>
                    ) : (
                            <CCard>
                                <CCardBody>
                                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', margin: 'auto' }}>

                                        <div>
                                            <div>
                                                <p>FirstName: {useExist?.firstname}</p>
                                                <p>LastName: {useExist?.lastname}</p>
                                                <p>Email: {useExist?.email}</p>
                                            </div>
                                            <div>
                                                <p>Metamask Wallet: {useExist?.wallet}</p>
                                                <p>Username: {useExist?.username}</p>
                                                <p>Phone: {useExist?.phone}</p>
                                            </div>
                                            <CButton style={{ width: '100%' }} component="input" type="button" color="primary" className="px-4" onClick={() => setUpdateuserpage(false)}>Update User</CButton>

                                        </div>
                                        <div>
                                            {useExist.projects.map((el, i) => (
                                                <>
                                                    {i == id ? (
                                                        <>
                                                            <Toolbar />
                                                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                                                                <div style={{ height: '400px', width: '100%' }}>
                                                                    <Viewer
                                                                        fileUrl={el.pdf}
                                                                        plugins={[
                                                                            getFilePluginInstance,
                                                                            toolbarPluginInstance
                                                                        ]}
                                                                        defaultScale={SpecialZoomLevel.PageFit}
                                                                    />
                                                                </div>
                                                                {useExist.projects.length > 1 && (
                                                                    <CButton style={{ width: '100%' }} component="input" type="button" color="primary" className="px-4" onClick={() => useExist.projects.length == i + 1 ? setid(i - 1) : setid(i + 1)}>{useExist.projects.length == i + 1 ? "Back" : "Next"}</CButton>
                                                                )}
                                                            </Worker>
                                                        </>
                                                    ) : null}
                                                </>
                                            ))}
                                        </div>

                                    </div>
                                </CCardBody>
                            </CCard>
                        )}
                </>
            ) : <UpdateUser UpdateUsers={UpdateUsers} setUpdateuserpage={setUpdateuserpage} userInfo={useExist} />}
        </>
    )
}
export default UserProfile