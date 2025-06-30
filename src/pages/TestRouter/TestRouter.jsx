import Aside from '../../components/Aside';
import Header from '../../components/Header';
import React, { useState } from 'react';
import axios from 'axios';

const TestRouter = () => {

    const connect = () => {
        const formData = {
            name : "장세민"
        }
        try {
            const response = axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/test/router`,
                formData
            );
            console.log(response.data)
        }
        catch(err){
            console.error("저장 중 오류 발생:", err);
        }
        finally{

        }
    }

    return (
        <div>
            <Header />
            <div className="flex">
                <dir className="mb:hidden">
                    <Aside />
                </dir>
                <main>
                    <div>
                        <p>라우터 테스트 페이지 입니다.</p>
                    </div>
                    <div>
                        <button className='border border-gray-500 px-2 py-2'>
                            fastAPI 통신
                        </button>
                    </div>
                </main>



            </div>
        </div >
    );
}

export default TestRouter;
