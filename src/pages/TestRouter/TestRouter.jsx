import Aside from '../../components/Aside';
import Header from '../../components/Header';
import React, { useState } from 'react';
import axios from 'axios';

const TestRouter = () => {

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
                </main>



            </div>
        </div >
    );
}

export default TestRouter;
