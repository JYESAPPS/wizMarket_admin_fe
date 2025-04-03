import Aside from '../../components/Aside';
import Header from '../../components/Header';
import React, { useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination"; // pagination 스타일 추가
import { Pagination, Navigation } from "swiper/modules"; // pagination 모듈 추가


const TestStory = () => {

    // GPT 이미지 스토리 생성 테스트
    const [oldImage, setOldImage] = useState(null); // 미리보기용 이미지 URL
    const [uploadedFile, setUploadedFile] = useState(null); // 실제 업로드할 파일
    const [telling, setTelling] = useState(false); // 스토리 생성된 이미지 URL
    const [storyRole, setStoryRole] = useState(""); // 스토리 역할
    const [story, setStory] = useState(null); // 스토리 
    const [storyPrompt, setStoryPrompt] = useState(story || ""); // 초기값을 story로 설정
    const [storyImage, setStoryImage] = useState([]); // 스토리 생성된 이미지 URL
    const [imageLoading, setImageLoading] = useState(false); // 이미지 로딩 상태

    // 파일 선택 시 미리보기 및 파일 저장
    const previewImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOldImage(URL.createObjectURL(file)); // 미리보기 URL 저장
            setUploadedFile(file); // 파일 객체 저장
        }
    };

    // 이미지 파일을 Base64로 변환하는 함수
    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
        });
    };

    // 스토리 생성 함수
    const generateStory = async () => {
        if (!uploadedFile) {
            console.error("파일이 선택되지 않았습니다.");
            return;
        }
        setTelling(true);

        let base64Image = null;
        if (uploadedFile) {
            base64Image = await convertImageToBase64(uploadedFile);
        }

        if (storyRole === null || storyRole === "") {
            setStoryRole("Analyze the image"); // 기본값 설정
        }

        const basicInfo = {
            story_role: storyRole,
            example_image: base64Image,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/test/generate/story`,
                basicInfo
            );

            if (response.data.story) {
                setStory(response.data.story);
                setStoryPrompt(response.data.story); // 스토리 프롬프트 업데이트
            } else {
                console.error("비디오 생성 실패:", response.data);
            }
        } catch (err) {
            console.error("저장 중 오류 발생:", err);
        } finally {
            setTelling(false);
        }
    };



    // 유사 이미지 생성 함수
    const generateImage = async () => {
        setImageLoading(true);

        const basicInfo = {
            prompt: storyPrompt,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/test/generate/story/image`,
                basicInfo
            );

            if (response.data.images) {
                setStoryImage(response.data.images || []);
            } else {
                console.error("이미지 생성 실패:", response.data);
            }
        } catch (err) {
            console.error("저장 중 오류 발생:", err);
        } finally {
            setImageLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="flex">
                <dir className="mb:hidden">
                    <Aside />
                </dir>

                <main className="flex flex-col gap-4 min-h-screen p-4 overflow-x-hidden">
                    {/* 상단 텍스트 */}
                    <section className="w-full text-center">
                        <h4 className=''>GPT로 이미지 스토리텔링 테스트</h4>
                        <h4 className=''>이미지 생성 모델은 IMAGEN-3 으로 설정</h4>
                    </section>
                    <div>
                        <div className='flex flex-row gap-4'>
                            <div className='flex flex-col items-center '>
                                <section className=''>
                                    <input type="file" accept="image/*" onChange={previewImage} />
                                </section>
                                <section className="">
                                    {/* 기존 이미지 미리보기 */}
                                    {oldImage && (
                                        <div className="items-center mt-4">
                                            <img
                                                src={oldImage}
                                                alt="기존 이미지"
                                                className="max-h-96 rounded-md shadow-md"
                                            />
                                        </div>
                                    )}
                                </section>
                                <section className='py-4'>
                                    <textarea
                                        className="border-2 border-black p-3 w-full h-full overflow-auto resize-none whitespace-pre-line"
                                        rows={5}
                                        cols={35}
                                        value={storyRole}
                                        onChange={(e) => setStoryRole(e.target.value)}
                                        placeholder={"해당 이미지에 대한 역할을 설정해주세요.\n빈칸으로 입력 시 Analyze the image 로 설정됩니다."}
                                    />

                                </section>
                                <section className="py-4">
                                    <button
                                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all flex items-center justify-center"
                                        onClick={generateStory}
                                        disabled={telling}
                                    >
                                        {telling ? (
                                            <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            "이미지 분석"
                                        )}
                                    </button>
                                </section>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                {/* story가 있을 때만 렌더링 */}
                                {story && (
                                    <textarea
                                        className="border-2 border-black p-3 w-full h-full overflow-auto resize-none"
                                        value={storyPrompt}
                                        rows={8}
                                        cols={50}
                                        onChange={(e) => setStoryPrompt(e.target.value)}
                                        placeholder="스토리를 입력하세요..."
                                    />
                                )}
                                {/* story가 있을 때만 버튼 표시 */}
                                {story && (
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition"
                                        onClick={generateImage}
                                        disabled={imageLoading}
                                    >
                                        {imageLoading ? (
                                            <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            "유사 이미지 생성"
                                        )}
                                    </button>
                                )}
                            </div>
                            <div>
                                <section className="items-center justify-center">
                                    {Array.isArray(storyImage) && storyImage.length > 0 && (
                                        <Swiper
                                            modules={[Navigation, Pagination]}
                                            navigation
                                            pagination={{ clickable: true }}
                                            spaceBetween={30}
                                            slidesPerView={1}
                                            className="max-w-[300px]"
                                        >
                                            {storyImage.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <img
                                                        src={image}
                                                        alt={`Generated ${index + 1}`} // "Image" 단어 제거
                                                        className="max-w-[300px] object-cover rounded-md shadow-md"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    )}
                                </section>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </div >
    );
}

export default TestStory;
