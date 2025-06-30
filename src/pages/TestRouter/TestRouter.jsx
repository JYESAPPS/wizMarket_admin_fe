import Aside from '../../components/Aside';
import Header from '../../components/Header';
import React, { useState } from 'react';
import axios from 'axios';

const TestRouter = () => {

    const connect = async () => {
        const formData = {
            name: "장세민",
        };
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_BASE_URL}/test/router`,
                formData
            );
            console.log(response.data.name); // ✅ 응답 본문은 `.data` 안에 들어 있음
        } catch (err) {
            console.error("저장 중 오류 발생:", err);
        }
    };


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
                        <button onClick={connect} className='border border-gray-500 px-2 py-2'>
                            fastAPI 통신
                        </button>
                    </div>
                </main>
            </div>
        </div >
    );
}

export default TestRouter;
