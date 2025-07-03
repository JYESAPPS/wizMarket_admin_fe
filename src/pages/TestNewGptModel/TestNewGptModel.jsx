import Aside from '../../components/Aside';
import Header from '../../components/Header';
import React, { useState } from 'react';
import axios from 'axios';

const TestNewGptModel = () => {

    const [oldPrompt, setOldPrompt] = useState('');
    const [selectedValue, setSelectedValue] = useState("");
    const [oldRole, setOldRole] = useState('user');
    const [oldResultLoding, setOldResultLoading] = useState(false)
    const [oldResult, setOldResult] = useState('');


    const handleOldPromptChange = (event) => {
        setOldPrompt(event.target.value); // 상태 업데이트
    };

    // 셀렉트 선택 시 oldRole 기본 텍스트 변경
    const handleSelectChange = (e) => {
        const value = e.target.value;
        setSelectedValue(value);

        let defaultText = "";
        switch (value) {
            case "channel":
                defaultText = `당신은 온라인 광고 전문가 입니다. 
오프라인 점포를 하는 매장에서 다음과 같은 내용으로 홍보 콘텐츠를 제작하여 포스팅하려고 합니다. 
이 매장에서 가장 좋은 홍보 방법 무엇이 좋겠습니까? 
제시된 상황에 따라 채널과  디자인 스타일 중에 하나를 선택해주고 그 이유와 홍보전략을 200자 내외로 작성해주세요.`;
                break;
            case "auto":
                defaultText = "당신은 온라인 광고 콘텐츠 기획자입니다. 아래 조건을 바탕으로 SNS 또는 디지털 홍보에 적합한 콘텐츠를 제작하려고 합니다.";
                break;
            case "feed":
                defaultText = `1. '{문구}' 를 100~150자까지 {광고채널} 인플루언서가 $대분류$ 을 소개하는 듯한 느낌으로 광고 문구 만들어줘 
2. 광고 타겟들이 흥미를 갖을만한 내용의 키워드를 뽑아서 검색이 잘 될만한 해시태그도 최소 3개에서 6개까지 생성한다`;
                break;
            case "text":
                defaultText = `일차3.5숙성고기 업체의 인스타그램 피드를 위한 광고 콘텐츠를 제작하려고 합니다. 
이미지 분석 후  돼지고기 구이/찜, 2025/05/28, 비, 19도, 남자40대, 여자 40대 내용으로 광고 카피문구를 다음과 같은 형식으로 작성해주세요.`;
                break;
            case "user":
                defaultText = "";
                break;
            default:
                defaultText = "";
        }
        setOldRole(defaultText);
    };



    const handleOldRoleChange = (event) => {
        setOldRole(event.target.value); // 상태 업데이트
    };

    const onOldGenerate = async () => {
        if (!selectedValue) {
            alert("옵션을 선택하세요!");
            return; // 중단
        }

        setOldResultLoading(true)
        
        const basicInfo = {
            role: oldRole,
            prompt: oldPrompt,
        };
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/generate/test/old/content`,
                basicInfo,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setOldResult(response.data.content); // 성공 시 서버에서 받은 데이터를 상태에 저장
        } catch (err) {
            console.error('저장 중 오류 발생:', err);
        } finally {
            setOldResultLoading(false)
        }
    }


    return (
        <div>
            <Header />
            <div className="flex">
                <dir className="mb:hidden">
                    <Aside />
                </dir>

                <main className="flex flex-col gap-4 min-h-screen p-4 overflow-x-hidden ">
                    {/* 상단 텍스트 */}
                    <section className="w-full text-center">
                        <h4 className="text-lg font-bold">테스트를 위해 글자 수 제한 없음</h4>
                    </section>

                    {/* 좌우 영역 컨테이너 */}
                    <div className="flex flex-row gap-4">
                        
                        <div className="flex-1 flex flex-col gap-2 items-center justify-center">
                            <section className='text-center'>
                                <h4 className='text-2xl font-bold pb-2'>GPT 테스트</h4>
                                <h4>용도 설정 - 역할 자동 선택되게끔</h4>
                            </section>

                            <section className="flex justify-center items-center p-4">
                                <select
                                    className="border border-gray-500 p-2"
                                    onChange={handleSelectChange}
                                >
                                    <option value="">선택</option>
                                    <option value="channel">채널 추천</option>
                                    <option value="auto">자동 마케팅</option>
                                    <option value="feed">피드 게시물 텍스트</option>
                                    <option value="text">홍보 문구 생성</option>
                                    <option value="user">단순 질의 응답</option>
                                </select>
                            </section>

                            {selectedValue !== "user" && (
                                <section className="w-full items-center">
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        placeholder="역할을 입력하세요"
                                        rows="10"
                                        value={oldRole}
                                        onChange={handleOldRoleChange}
                                    ></textarea>
                                </section>
                            )}
                            <section className="w-full items-center">
                                <textarea
                                    className="w-full p-2 border rounded"
                                    placeholder="내용을 입력하세요"
                                    rows="20"
                                    value={oldPrompt} // 상태 값 연결
                                    onChange={handleOldPromptChange} // 입력 값 변경 처리
                                ></textarea>
                            </section>

                            <section className="w-full items-center">
                                <button
                                    onClick={onOldGenerate}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    disabled={oldResultLoding}
                                >
                                    {oldResultLoding ? (
                                        <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "생성"
                                    )}
                                </button>
                            </section>
                        </div>

                        {/* 중앙 영역 */}
                        <div className="flex-1 flex flex-col gap-2">
                        <section>
                                <h4 className='font-bold text-2xl'>매장 데이터 예시</h4>
                            </section>

                            <section className="w-full items-center">
                                <p>매장명 : 일차3.5숙성고기</p>
                                <p>주소 : 서울특별시 영등포구 국회대로53길 30</p>
                                <p>업종 : 돼지고기 구이/찜</p>
                                <p>주 고객층 : 남자 40대, 여자 40대</p>
                                <p>오늘 날씨 : 비, 19도</p>
                                <p>오늘 날짜 : 2025년 05월 28일</p>
                                <p>홍보 채널 : 문자메시지, 인스타그램 스토리, 인스타그램 피드, 네이버 블로그,카카오톡, 네이버 밴드</p>
                                <p>디자인 스타일 : 3D감성, 포토실사, 캐릭터/만화, 레트로, AI모델, 예술</p>
                                <p></p>
                                <p></p>
                            </section>
                            {/* 생성된 답변 */}
                            <section className="w-full items-center pt-24">
                                <h4>생성된 결과</h4>
                                <div className="p-4 border rounded bg-gray-100">
                                    {oldResult ? (
                                        <p>{oldResult}</p>
                                    ) : (
                                        <p className="text-gray-500">결과가 없습니다. 내용을 입력하고 생성 버튼을 클릭하세요.</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>

            </div>
        </div >
    );
}

export default TestNewGptModel;
