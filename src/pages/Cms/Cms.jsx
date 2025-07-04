import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from '../../components/Header';
import Aside from '../../components/Aside';

const Cms = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [styleInputs, setStyleInputs] = useState(
        Array.from({ length: 6 }, (_, i) => ({
            designId: i + 1,
            prompts: [],
            rawInput: ""
        }))
    );

    // useEffect 내부 수정: 가나다순 정렬
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/get/category`);
                const sorted = (response.data.category_list || []).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
                setCategoryList(sorted);
            } catch (error) {
                console.error("카테고리 불러오기 실패:", error);
            }
        };
        fetchCategories();
    }, []);


    const handlePromptChange = (idx, value) => {
        const updated = [...styleInputs];
        updated[idx].rawInput = value;
        // 수정된 코드 (세미콜론 기준 분리)
        updated[idx].prompts = value
            .split(";")
            .map(p => p.trim())
            .filter(p => p.length > 0);
        setStyleInputs(updated);
    };

    const handleSubmit = async () => {
        if (!selectedCategoryId) {
            alert("소분류를 선택해주세요.");
            return;
        }

        const payload = {
            categoryId: parseInt(selectedCategoryId, 10),
            styles: styleInputs.map(({ designId, prompts }) => ({
                designId,
                prompts
            }))
        };

        try {
            await axios.post(`${process.env.REACT_APP_FASTAPI_BASE_URL}/cms/thumbnail/insert`, payload);
            alert("등록 완료");

            // ✅ 프롬프트 입력값 초기화
            setStyleInputs(
                Array.from({ length: 6 }, (_, i) => ({
                    designId: i + 1,
                    prompts: [],
                    rawInput: ""
                }))
            );
        } catch (err) {
            console.error("등록 실패:", err);
            alert("등록 실패");
        }
    };


    return (
        <div>
            <Header />
            <div className="flex">
                <Aside />
                <main className="flex-1 flex flex-col gap-2 min-h-screen p-4">

                    <div className="flex justify-between items-center pb-6">
                        <h2 className="text-2xl font-bold">썸네일 작업</h2>
                        <button onClick={handleSubmit} className="text-2xl font-bold border px-3 py-2">
                            썸네일 등록
                        </button>
                    </div>

                    {/* padding으로 변경 */}
                    <div className="pb-6">
                        <label className="block pb-2 text-lg font-semibold">소분류 선택</label>
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className="w-full border px-4 py-2"
                        >
                            <option value="">-- 소분류 선택 --</option>
                            {categoryList.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} 의 id 값 : {cat.id}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCategoryId && (
                        <div className="space-y-4">
                            {styleInputs.map((style, idx) => (
                                <div key={idx}>
                                    <label className="block font-semibold pb-1">스타일 {style.designId}</label>
                                    <textarea
                                        rows={3}
                                        className="w-full border px-2 py-1 resize-none"
                                        placeholder="프롬프트 입력 (세미콜론 ; 으로 구분)"
                                        value={style.rawInput}
                                        onChange={(e) => handlePromptChange(idx, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Cms;
