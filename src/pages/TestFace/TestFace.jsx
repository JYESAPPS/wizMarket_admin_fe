import Aside from '../../components/Aside';
import Header from '../../components/Header';
import React, { useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Select from 'react-select';


const TestFace = () => {

    // 얼굴 바꾸기 테스트
    const [modelImage, setModelImage] = useState(null); // 미리보기용 이미지 URL
    const [personUploadedFile, setPersonUploadedFile] = useState(null); // 실제 업로드할 파일
    const [personPrompt, setPersonPrompt] = useState(""); // 생성할 프롬프트
    const [personChanging, setPersonChanging] = useState(false); // 로딩 상태
    const [modelImageUrl, setModelImageUrl] = useState([]); // 생성된 이미지와 유사도가 담긴 리스트



    // 인물 사진 파일 선택 시 미리보기 및 파일 저장
    const previewModelImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setModelImage(URL.createObjectURL(file)); // 미리보기 URL 저장
            setPersonUploadedFile(file); // 파일 객체 저장
        }
    };

    // 기존 이미지와 생성된 이미지들의 코사인 유사도 비교
    const changeModelImage = async () => {
        if (!personUploadedFile) {
            console.error("파일이 선택되지 않았습니다.");
            return;
        }

        setPersonChanging(true);

        // FormData 생성
        const formData = new FormData();
        formData.append("image", personUploadedFile); // 실제 이미지 파일
        formData.append("prompt", personPrompt); // 사용자가 찾을 객체

        // 1. 폼데이터로 파일 객채 담아서 전송
        // 2. ads_be 서버의 엔드포인트 밑 ads_test 파일 체크

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/test/face`,
                formData,
                {
                    responseType: "json", // 이게 빠지면 이미지 깨짐
                }
            );
            if (response.data) {
                console.log(response.data)
                setModelImageUrl(response.data.image_url);  // <img src={imageUrl} /> 형태로 사용 가능
            } else {
                console.error("이미지 변환 실패:", response.data);
            }
        } catch (err) {
            console.error("저장 중 오류 발생:", err);
        } finally {
            setPersonChanging(false);
        }
    };


    return (
        <div>
            <Header />
            <div className="flex">
                <dir className="mb:hidden">
                    <Aside />
                </dir>
                <main className="flex flex-col gap-4 h-full w-full p-4 overflow-y-auto">
                    <p className="py-2 font-bold text-2xl">얼굴 테스트</p>
                    <div className="flex flex-row h-full w-full gap-4">
                        <div className="flex-1 flex flex-col items-center">
                            <section className=''>
                                <input type="file" accept="image/*" onChange={previewModelImage} />
                            </section>
                            <section className="flex flex-row items-center">
                                {/* 기존 이미지 미리보기 */}
                                {modelImage && (
                                    <div className="items-center mt-4">
                                        <img
                                            src={modelImage}
                                            alt="기존 이미지"
                                            className="max-h-96 rounded-md shadow-md"
                                        />
                                    </div>
                                )}
                            </section>
                            <section className='pt-2'>
                                <p>되도록 세로가 긴 형태의 이미지를 첨부해주세요.</p>
                            </section>
                        </div>
                        <section className="flex-1 flex flex-col items-center justify-center">
                            <textarea
                                className="p-2 border rounded"
                                placeholder="내용을 입력하세요"
                                rows="17"
                                cols="50"
                                value={personPrompt}
                                onChange={(e) => setPersonPrompt(e.target.value)}
                            />

                            <button
                                className={clsx(
                                    'py-2 w-1/3 m-4 rounded-md transition-all flex items-center justify-center',
                                    personChanging
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                )}
                                onClick={changeModelImage}
                                disabled={personChanging}
                            >
                                {personChanging ? (
                                    <>
                                        <span className="animate-spin mr-2">🔄</span>
                                        생성 중...
                                    </>
                                ) : (
                                    '생성 및 비교'
                                )}
                            </button>

                        </section>
                        <section className="flex-1 flex flex-col items-center justify-center pr-20">
                            <div className="p-4">
                                결과 이미지 영역
                            </div>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >다운로드</button>
                        </section>
                    </div>


                </main>
            </div>
        </div >
    );
}

export default TestFace;
