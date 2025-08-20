import Aside from '../../components/Aside';
import Header from '../../components/Header';
import React, { useState } from 'react';
import axios from 'axios';

// 컴포넌트 상단부에 추가
const SCENE_PROMPTS = {
  marble: "Marble floor background, bright daylight, elegant, minimal reflections",
  wood: "Warm wooden tabletop, soft ambient light, cozy atmosphere",
  industrial: "Industrial concrete wall background, soft diffuse light",
  linen: "Neutral linen fabric backdrop, soft daylight",
  brick: "Brick wall background, soft daylight",
  counter: "Kitchen counter background, natural soft lighting"
};


const TestBackground = () => {

    const [bgImage, setBgImage] = useState(null);
    const [bgFile, setBgFile] = useState(null)

    const [bgPrompt, setBgPrompt] = useState('')
    const [bgRemoveImage, setBgRemoveImage] = useState(null);
    const [bgLoading, setBgLoading] = useState(false)
    const [type, setType] = useState('')    // 스타일 선택 or 직접 입력
    const [scene, setScene] = useState('')  // 선택한 스타일 값



    const bgviewImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBgImage(URL.createObjectURL(file)); // 미리보기 URL 저장
            setBgFile(file); // 파일 객체 저장
        }
    };


    const BgEditChange = (event) => {
        setBgPrompt(event.target.value); // 상태 업데이트
    };


    // 배경 AI 변경
    const onSubmit = async (e) => {
        e?.preventDefault?.();

        if (!bgFile) {
            console.error("파일이 선택되지 않았습니다.");
            alert("이미지 파일을 선택하세요.");
            return;
        }
        setBgLoading(true);

        try {
            const prompt =
                type === "style"
                    ? (SCENE_PROMPTS[scene] || scene || "Clean neutral background, soft daylight")
                    : (bgPrompt?.trim() || "Clean neutral background, soft daylight");

            // 서버에 파일 + 프롬프트 전송
            const fd = new FormData();
            fd.append("file", bgFile);   
            fd.append("prompt", prompt); 

            const base = process.env.REACT_APP_FASTAPI_ADS_URL || ""; 
            const steps = 75; // 필요하면 입력값으로 바꿔도 됨
            const url = `${base}/ads/test/background?steps=${encodeURIComponent(steps)}`;

            const res = await axios.post(url, fd, {
                responseType: "blob", // 반응: PNG/JPEG 
                
            });

            // 결과 미리보기 URL로 표시
            const blobUrl = URL.createObjectURL(res.data);
            setBgRemoveImage(blobUrl);
        } catch (err) {
            console.error("저장 중 오류 발생:", err);
            alert("배경 생성에 실패했습니다.");
        } finally {
            setBgLoading(false);
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

                    <div className='flex flex-col pt-2'>
                        {/* 배경 생성 */}
                        <div className='w-full flex flex-row gap-4 pt-10'>

                            <div className='flex flex-col'>
                                <p className="pb-8 font-bold text-2xl">배경 생성</p>
                                <section className='flex'>
                                    <input type="file" accept="image/*" onChange={bgviewImage} />
                                </section>
                                <section className="">
                                    {/* 기존 이미지 미리보기 */}
                                    {bgImage && (
                                        <div className="items-center mt-4">
                                            <img
                                                src={bgImage}
                                                alt="기존 이미지"
                                                className="max-h-96 rounded-md shadow-md"
                                            />
                                        </div>
                                    )}
                                </section>
                            </div>
                            <section className="items-center justify-center flex flex-col">
                                <select
                                    name="type"
                                    className="border-4"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="" disabled>
                                        타입을 선택해주세요
                                    </option>
                                    <option value="style">스타일 선택</option>
                                    <option value="write">직접 입력</option>
                                </select>

                                {type === "style" && ( 
                                    <div className='pt-8'>
                                        <select
                                            name="scene"
                                            className="p-2 border rounded"
                                            value={scene}
                                            onChange={(e) => setScene(e.target.value)}
                                        >
                                            <option value="" disabled>
                                                스타일을 선택해주세요
                                            </option>
                                            <option value="marble">marble</option>
                                            <option value="wood">wood</option>
                                            <option value="industrial">industrial</option>
                                            <option value="linen">linen</option>
                                            <option value="brick">brick</option>
                                            <option value="counter">counter</option>
                                        </select>
                                    </div>
                                )}

                                {type === "write" && (
                                    <div className='pt-8 pb-6 flex flex-col'>
                                        <textarea
                                            className="p-2 border"
                                            placeholder="프롬프트를 영어로 입력하세요."
                                            rows="8"
                                            cols="50"
                                            value={bgPrompt} 
                                            onChange={BgEditChange} 
                                        ></textarea>
                                    </div>
                                )}
                                <button
                                    className="py-2 m-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all flex items-center justify-center"
                                    onClick={onSubmit}
                                    disabled={bgLoading}
                                >
                                    {bgLoading ? (
                                        <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "배경 생성"
                                    )}
                                </button>
                            </section>
                            <section>
                                {bgRemoveImage && (
                                    <div className="items-center mt-4">
                                        <img src={bgRemoveImage} alt="Generated Background" className="max-h-96 rounded-md shadow-md" />
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div >
    );
}

export default TestBackground;
