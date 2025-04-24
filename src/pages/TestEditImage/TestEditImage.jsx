import Aside from '../../components/Aside';
import Header from '../../components/Header';
import React, { useState } from 'react';
import axios from 'axios';
import GuideChageImage from './Guide/GuideChageImage';
import GuidePersonImage from './Guide/GuidePersonImage';
import Select from 'react-select';
import ImageCompare from './Compare/ImageCompare';

const TestEditImage = () => {

    // 이미지 내용 바꾸기 테스트
    const [oldImage, setOldImage] = useState(null); // 미리보기용 이미지 URL
    const [uploadedFile, setUploadedFile] = useState(null); // 실제 업로드할 파일
    const [guide, setGuide] = useState(false); // 가이드

    const [find, setFind] = useState(""); // 찾을 것
    const [change, setChange] = useState(""); // 바꿀 것
    const [changing, setChanging] = useState(false); // 로딩 상태
    const [imageUrl, setImageUrl] = useState(null); // 생성된 이미지 URL


    // 인물 사진 바꾸기 테스트
    const [personImage, setPersonImage] = useState(null); // 미리보기용 이미지 URL
    const [personUploadedFile, setPersonUploadedFile] = useState(null); // 실제 업로드할 파일
    const [personGuide, setPersonGuide] = useState(false); // 인물 이미지 가이드
    const [personStyle, setPersonStyle] = useState(""); // 인물 스타일
    const [personChanging, setPersonChanging] = useState(false); // 로딩 상태
    const [personImageUrl, setPersonImageUrl] = useState(null); // 생성된 이미지 URL



    // 가이드 보기/숨기기
    const toggleGuide = () => {
        setGuide((prev) => !prev);
    };

    // 파일 선택 시 미리보기 및 파일 저장
    const previewImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOldImage(URL.createObjectURL(file)); // 미리보기 URL 저장
            setUploadedFile(file); // 파일 객체 저장
        }
    };

    // 생성 함수
    const changeImage = async () => {
        if (!uploadedFile) {
            console.error("파일이 선택되지 않았습니다.");
            return;
        }

        setChanging(true);

        // FormData 생성
        const formData = new FormData();
        formData.append("image", uploadedFile); // 실제 이미지 파일
        formData.append("find", find); // 사용자가 찾을 객체
        formData.append("change", change); // 변경할 객체

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/test/edit/image`,
                formData,
                {
                    responseType: "blob", // 이게 빠지면 이미지 깨짐
                }
            );

            if (response.data) {
                const imageBlob = new Blob([response.data], { type: "image/png" });
                const imageUrl = URL.createObjectURL(imageBlob);
                console.log("변환된 이미지 URL:", imageUrl);
                setImageUrl(imageUrl);  // <img src={imageUrl} /> 형태로 사용 가능
            } else {
                console.error("이미지 변환 실패:", response.data);
            }
        } catch (err) {
            console.error("저장 중 오류 발생:", err);
        } finally {
            setChanging(false);
        }
    };

    // 인물 사진 바꾸기 가이드 보기/숨기기
    const togglePersonGuide = () => {
        setPersonGuide((prev) => !prev);
    };



    // 인물 사진 파일 선택 시 미리보기 및 파일 저장
    const previewPersonImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPersonImage(URL.createObjectURL(file)); // 미리보기 URL 저장
            setPersonUploadedFile(file); // 파일 객체 저장
        }
    };

    // 인물 사진 스타일 변경 함수
    const changePersonImage = async () => {
        if (!personUploadedFile) {
            console.error("파일이 선택되지 않았습니다.");
            return;
        }
    
        setPersonChanging(true);
    
        // FormData 생성
        const formData = new FormData();
        formData.append("image", personUploadedFile); // 실제 이미지 파일
        formData.append("style", personStyle); // 사용자가 찾을 객체
    
        // FormData 로그 출력 (실제 데이터를 확인)
        // for (let [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/test/change/person`,
                formData,
                {
                    responseType: "json", // 이게 빠지면 이미지 깨짐
                }
            );
            if (response.data) {
                console.log(response.data)
                setPersonImageUrl(response.data.image_url);  // <img src={imageUrl} /> 형태로 사용 가능
            } else {
                console.error("이미지 변환 실패:", response.data);
            }
        } catch (err) {
            console.error("저장 중 오류 발생:", err);
        } finally {
            setPersonChanging(false);
        }
    };
    

    // 지원 가능 API 목록 보기
    const GuideModal = () => {
        const guideWindow = window.open(
          "", // 빈 페이지 열기
          "_blank", // 새 탭 (또는 새 창)
          "width=800,height=600,resizable=yes,scrollbars=yes"
        );
      
        // 새 창에 이미지 삽입
        guideWindow.document.write(`
          <html>
            <head>
              <title>API 가이드</title>
              <style>
                body { margin: 0; padding: 20px; font-family: sans-serif; background: #f9f9f9; }
                img { max-width: 100%; height: auto; display: block; margin-bottom: 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              </style>
            </head>
            <body>
              <h2>지원 가능한 기능</h2>
              <img src="${require("../../assets/guide/guide_person_sw_1.png")}" alt="guide1" />
              <img src="${require("../../assets/guide/guide_person_sw_2.png")}" alt="guide2" />
              <img src="${require("../../assets/guide/guide_person_sw_3.png")}" alt="guide3" />
            </body>
          </html>
        `);
    };
      

    return (
        <div>
            <Header />
            <div className="flex">
                <dir className="mb:hidden">
                    <Aside />
                </dir>
                <main className="flex flex-col gap-4 min-h-screen p-4">
                    <div className='flex flex-row'>
                        <div className='flex flex-row gap-4'>
                            <div className='flex flex-col items-center min-w-96'>
                                <h4 className='text-lg font-semibold'>이미지 속 내용물 바꾸기</h4>
                                <section className='py-4'>
                                    <div className="flex items-center gap-2 pb-2">
                                        <p className="text-lg font-medium">가이드 보기</p>
                                        <button
                                            onClick={toggleGuide}
                                            className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            {guide ? "닫기" : "열기"}
                                        </button>
                                    </div>

                                </section>
                                <section className='pb-4'>
                                    {guide && (
                                        <div className="p-2 bg-gray-100 rounded text-sm text-gray-800">
                                            <GuideChageImage />
                                        </div>
                                    )}
                                </section>
                                <section className=''>
                                    <input type="file" accept="image/*" onChange={previewImage} />
                                </section>
                                <section className="flex flex-row items-center gap-4">
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
                                    {imageUrl && (
                                        <div className="items-center mt-4">
                                            <img
                                                src={imageUrl}
                                                alt="생성된 이미지"
                                                className="max-h-96 rounded-md shadow-md"
                                            />
                                        </div>
                                    )}
                                </section>
                                <section className='py-4'>
                                    <textarea
                                        className="border-2 border-black p-3 w-full h-full overflow-auto resize-none whitespace-pre-line"
                                        rows={1}
                                        cols={25}
                                        value={find}
                                        onChange={(e) => setFind(e.target.value)}
                                        placeholder={"이미지 속 찾을 것 객체 작성"}
                                    />
                                </section>
                                <section className='py-4'>
                                    <textarea
                                        className="border-2 border-black p-3 w-full h-full overflow-auto resize-none whitespace-pre-line"
                                        rows={1}
                                        cols={25}
                                        value={change}
                                        onChange={(e) => setChange(e.target.value)}
                                        placeholder={"해당 객체를 무엇으로 바꿀 지 작성"}
                                    />
                                </section>
                                <section className="py-4">
                                    <button
                                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all flex items-center justify-center"
                                        onClick={changeImage}
                                        disabled={changing}
                                    >
                                        {changing ? (
                                            <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            "이미지 바꾸기"
                                        )}
                                    </button>
                                </section>

                            </div>
                            <div className='flex flex-col items-center min-w-96'>
                                <h4 className='text-lg font-semibold'>인물 이미지 스타일 바꾸기</h4>
                                <section className='pt-4'>
                                    <div className="flex items-center gap-2 pb-2">
                                        <p className="text-lg font-medium">가이드 보기</p>
                                        <button
                                            onClick={togglePersonGuide}
                                            className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            {personGuide ? "닫기" : "열기"}
                                        </button>
                                    </div>
                                </section>
                                <section className='pb-4'>
                                    {personGuide && (
                                        <div className="p-2 bg-gray-100 rounded text-sm text-gray-800">
                                            <GuidePersonImage />
                                        </div>
                                    )}
                                </section>
                                <section className=''>
                                    <div className="flex items-center gap-2 pb-2">
                                        <a
                                            className="text-lg font-medium text-blue-600 underline hover:text-blue-800"
                                            href="https://www.ailabtools.com/ko"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            참조 사이트
                                        </a>
                                    </div>
                                </section>
                                <section className='pb-2'>
                                    <button
                                        className="text-lg font-medium text-blue-600 underline hover:text-blue-800 cursor-pointer"
                                        onClick={GuideModal}
                                    >
                                        지원 가능 API 목록
                                    </button>
                                </section>
                                <section className=''>
                                    <input type="file" accept="image/*" onChange={previewPersonImage} />
                                </section>
                                <section className="flex flex-row items-center gap-4">
                                    {/* 기존 이미지 미리보기 */}
                                    {personImage && (
                                        <div className="items-center mt-4">
                                            <img
                                                src={personImage}
                                                alt="기존 이미지"
                                                className="max-h-96 rounded-md shadow-md"
                                            />
                                        </div>
                                    )}
                                    {personImageUrl && (
                                        <div className="items-center mt-4">
                                            <img
                                                src={personImageUrl}
                                                alt="생성된 이미지"
                                                className="max-h-96 rounded-md shadow-md"
                                            />
                                        </div>
                                    )}
                                </section>
                                <section className='py-4'>
                                    <Select
                                        options={[
                                            { value: 'jpcartoon', label: '일본 만화 (I)' },
                                            { value: 'anime', label: '일본 만화 (II)' },
                                            { value: 'claborate', label: '중국식 섬세한 붓놀림의 그림' },
                                            { value: 'hongkong', label: '홍콩식 만화 스타일' },
                                            { value: 'comic', label: '만화' },
                                            { value: 'animation3d', label: '3D 애니메이션' },
                                            { value: 'handdrawn', label: '손으로 그린' },
                                            { value: 'sketch', label: '연필 드로잉 (I)' },
                                            { value: 'full', label: '연필 드로잉 (II)' },
                                            { value: 'artstyle', label: '예술적 효과' },
                                            { value: 'classic_cartoon', label: '레트로 만화' },
                                            { value: 'tccartoon', label: '모에 만화' },
                                            { value: 'hkcartoon', label: '중국 만화' },
                                            { value: '3d_cartoon', label: '3D 만화' },
                                            { value: 'pixar', label: '픽사' },
                                            { value: 'pixar_plus', label: '픽사 프로' },
                                            { value: 'angel', label: '엔젤' },
                                            { value: 'angel_plus', label: '엔젤 프로' },
                                            { value: 'demon', label: '악마' },
                                            { value: 'ukiyoe_cartoon', label: '우키요에' },
                                            { value: 'amcartoon', label: '미국 만화' },
                                            { value: '3d', label: '3D 효과' },
                                            { value: '3d_game', label: '3D 게임 효과' },
                                            { value: 'western', label: '서양' },
                                            { value: 'avatar', label: '아바타' },
                                            { value: 'head', label: '연필 드로잉(머리)' },
                                        ]}
                                        onChange={(selected) => setPersonStyle(selected?.value || "")}
                                        isSearchable
                                        placeholder="기능 선택..."
                                        className="w-full"
                                    />
                                </section>

                                <section className="py-4">
                                    <button
                                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all flex items-center justify-center"
                                        onClick={changePersonImage}
                                        disabled={personChanging}
                                    >
                                        {personChanging ? (
                                            <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            "이미지 바꾸기"
                                        )}
                                    </button>
                                </section>
                                <section className="py-4">
                                    <ImageCompare/>
                                </section>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div >
    );
}

export default TestEditImage;
