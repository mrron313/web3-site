/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import { CButton } from '@coreui/react';
import { ClipLoader } from 'react-spinners';
import { css } from "@emotion/react";

export default function Store(props) {
    const { pdf, protectedPDF, saveButtonDisabled, saveProject } = props;
    const logindata = localStorage.getItem('user');
    const logindatameta = localStorage.getItem('usermeta');
    const data = JSON.parse(logindata);
    const [userExist, setUserExist] = useState();
    const [loading, setLoading] = useState(false);

    const override = css`
        position: absolute;
        border-color: "#007cc3";
        top: 9px;
        left: 9px;
        width: 20px;
        height: 20px;
    `;

    const getUser = async () => {
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

    const updateProjects = async (e, data) => {
      console.log(data);
        setLoading(true);
        e.preventDefault();
        let updatedData = data;
        let projects = data.projects || [];
        projects.push({
          pdf: pdf,
          protectedPDF: protectedPDF,
          filename: 'Project',
        });
        updatedData.projects = projects;
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/updateUser`, {
                data: updatedData,
                id: data._id
            });

            if (response) {
                saveProject();
                getUser();
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
        
    }

    useEffect(() => {
      console.log(protectedPDF);
        getUser();
    }, [protectedPDF]);

    return (
        <CButton disabled={saveButtonDisabled || loading} onClick={(e) => updateProjects(e, userExist)} style={{ backgroundColor: "#ddd", width: '120px', position: 'relative' }}>
            <ClipLoader color="#007cc3" loading={loading} css={override} /> Save
        </CButton>
    )
}
