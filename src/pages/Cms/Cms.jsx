import React, { useEffect, useState } from "react";
import axios from "axios";

const Cms = () => {
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_FASTAPI_ADS_URL}/ads/get/category`);
                console.log(response.data.category_list);
                setCategoryList(response.data.category_list || []);
            } catch (error) {
                console.error("카테고리 불러오기 실패:", error);
            }
        };

        fetchNotices();
    }, []);

    return (
        <div className="mx-auto p-6">
            <h2 className="text-2xl font-bold pb-6">썸네일 등록</h2>

            <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2 text-left">소분류</th>
                        <th className="border p-2 text-left">스타일</th>
                        <th className="border p-2 text-left">넘버링</th>
                        <th className="border p-2 text-left">프롬프트</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryList.map((category, index) => (
                        <tr key={index}>
                            <td className="border p-2">{category}</td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    className="w-full border px-2 py-1"
                                    placeholder="스타일 번호"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    className="w-full border px-2 py-1"
                                    placeholder="넘버링"
                                />
                            </td>
                            <td className="border p-2">
                                <textarea
                                    rows={2}
                                    className="w-full border px-2 py-1 resize-none"
                                    placeholder="프롬프트 입력"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default Cms;
