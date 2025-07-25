import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Aside = () => {
    const [isOpen, setIsOpen] = useState({
        section1: true,
        section2: true,
        section3: true,
        section4: true,
        section5: true
    });

    const toggleSection = (section) => {
        setIsOpen(prevState => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    return (
        <div className="px-10">
            <aside className='w-72'>
                <nav>
                    <ul className='border'>
                        <li
                            className="text-xl p-2 flex justify-between items-center cursor-pointer leading-10"
                            onClick={() => toggleSection('section1')}
                        >
                            <div className="flex items-center">
                                <div className="w-7 h-7">
                                    <img className='block w-full h-auto' src={require("../assets/aside/aside_common_img.png")} alt="user-img" />
                                </div>
                                <p className='ml-2'>Common Table</p>
                            </div>
                            <p className='text-4xl'>
                                {isOpen.section1 ? '-' : '+'}
                            </p>
                        </li>
                        <div
                            className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${isOpen.section1 ? 'max-h-[500px]' : 'max-h-0'}`}
                        >
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/city">Address table</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/category">업종분류</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/">기타</Link>
                            </li>
                        </div>
                    </ul>

                    <ul className='border'>
                        <li
                            className="text-xl p-2 flex justify-between items-center cursor-pointer leading-10"
                            onClick={() => toggleSection('section2')}
                        >
                            <div className="flex items-center">
                                <div className="w-7 h-7">
                                    <img className='block w-full h-auto' src={require("../assets/aside/aside_contents_img.png")} alt="info-img" />
                                </div>
                                <p className='ml-2'>Contents Table</p>
                            </div>
                            <p className='text-4xl'>
                                {isOpen.section2 ? '-' : '+'}
                            </p>
                        </li>
                        <div
                            className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${isOpen.section2 ? 'max-h-[500px]' : 'max-h-0'}`}
                        >
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/commercial2">상권분석</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/loc/info">입지분석</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/loc/store">매장정보</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/rising">뜨는 업종</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/location/context">지역 상황정보(날씨, 환경, 일출몰)</Link>
                            </li>
                        </div>
                    </ul>

                    <ul className='border'>
                        <li
                            className="text-xl p-2 flex justify-between items-center cursor-pointer leading-10"
                            onClick={() => toggleSection('section3')}
                        >
                            <div className="flex items-center">
                                <div className="w-7 h-7">
                                    <img className='block w-full h-auto' src={require("../assets/aside/aside_demographic_img.png")} alt="users-img" />
                                </div>
                                <p className='ml-2'>Demographic Table</p>
                            </div>
                            <p className='text-4xl'>
                                {isOpen.section3 ? '-' : '+'}
                            </p>
                        </li>
                        <div
                            className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${isOpen.section3 ? 'max-h-[500px]' : 'max-h-0'}`}
                        >
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/population">전국 인구 정보</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/cms">썸네일 등록</Link>
                            </li>
                        </div>
                    </ul>
                    <ul className='border'>
                        <li
                            className="text-xl p-2 flex justify-between items-center cursor-pointer leading-10"
                            onClick={() => toggleSection('section4')}
                        >
                            <div className="flex items-center">
                                <div className="w-7 h-7">
                                    <img className='block w-full h-auto' src={require("../assets/aside/aside_cms_img.png")} alt="user-img" />
                                </div>
                                <p className='ml-2'>CMS</p>
                            </div>
                            <p className='text-4xl'>
                                {isOpen.section4 ? '-' : '+'}
                            </p>
                        </li>
                        <div
                            className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${isOpen.section4 ? 'max-h-[500px]' : 'max-h-0'}`}
                        >
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/detail/category/content">세부 업종 공통 정보</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/store/content">매장 추가 정보</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/ads">wizAD</Link>
                            </li>
                        </div>
                    </ul>
                    <ul className='border'>
                        <li
                            className="text-xl p-2 flex justify-between items-center cursor-pointer leading-10"
                            onClick={() => toggleSection('section5')}
                        >
                            <div className="flex items-center">
                                <div className="w-7 h-7">
                                    <img className='block w-full h-auto' src={require("../assets/aside/aside_api_img.png")} alt="user-img" />
                                </div>
                                <p className='ml-2'>API 기능 테스트</p>
                            </div>
                            <p className='text-4xl'>
                                {isOpen.section5 ? '-' : '+'}
                            </p>
                        </li>
                        <div
                            className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${isOpen.section5 ? 'max-h-[500px]' : 'max-h-0'}`}
                        >
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/test/draw/image">이미지 테스트</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/test/edit/image">이미지 편집 테스트</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/test/generate/video">영상 생성, 이미지 배경 생성</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/test/music">음악 생성</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/test/gpt/model">gpt 새 모델 테스트</Link>
                            </li>
                            <li className='p-4 hover:bg-gray-200 text-slate-700 text-lg'>
                                <Link to="/test/face">얼굴 테스트</Link>
                            </li>
                        </div>
                    </ul>
                </nav>

            </aside>
        </div>
    );
};

export default Aside;
