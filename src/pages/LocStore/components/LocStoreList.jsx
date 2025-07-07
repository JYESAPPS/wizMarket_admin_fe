import React, { useState } from 'react';
import LocStoreContentModal from './LocStoreContentModal';
import DataLengthDown from '../../../components/DataLengthDown';
import Pagination from '../../../components/Pagination';
import axios from 'axios';


const LocStoreList = ({ data }) => {

    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
    const pageSize = 20;  // 한 페이지에 보여줄 리스트 개수
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });  // 정렬 상태 관리

    // 정렬 함수 (전체 데이터에 대해 적용)
    const sortedData = [...data].sort((a, b) => {
        if (sortConfig.key) {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;

            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (sortConfig.direction === 'asc') {
                // 오름차순: null -> 0 -> 값
                if (aValue === null && bValue !== null) return -1;
                if (aValue !== null && bValue === null) return 1;
                if (aValue === 0 && bValue !== 0) return -1;
                if (aValue !== 0 && bValue === 0) return 1;
            } else {
                // 내림차순: 값 -> 0 -> null
                if (aValue !== null && bValue === null) return -1;
                if (aValue === null && bValue !== null) return 1;
                if (aValue !== 0 && bValue === 0) return -1;
                if (aValue === 0 && bValue !== 0) return 1;
            }

            // 일반적인 값 비교
            if (aValue < bValue) return -1 * direction;
            if (aValue > bValue) return 1 * direction;
            return 0;
        }
        return 0;
    });


    // 페이징 처리
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);  // 정렬된 데이터에서 페이징 적용

    const totalPages = Math.ceil(data.length / pageSize);  // 전체 페이지 수 계산

    // 페이지 변경 함수
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 정렬 버튼 클릭 시 호출될 함수
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // 리포트 페이지 열기 새 기능
    const handleReportClick = async (event, store_business_id) => {
        event.preventDefault();

        try {
            // ✅ 건물관리번호를 서버로 전송 (예: FastAPI 엔드포인트)
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_REPORT_URL}/report/get/store/uuid`,  // 예시 엔드포인트
                { store_business_id },  // JSON 바디
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            // ✅ 서버에서 UUID나 기타 식별자 응답받기
            const { uuid } = response.data;  // 예시: { "uuid": "123e4567..." }

            // ✅ 받은 UUID로 새창 열기
            const REPORT_URL = `${process.env.REACT_APP_REPORT}/wizmarket/report/${uuid}`;
            const width = 412;
            const height = 900;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            window.open(
                REPORT_URL,
                "_blank",
                `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no`
            );
        } catch (error) {
            console.error("서버 요청 중 오류:", error);
            alert("서버 오류! 다시 시도해보세요.");
        }
    };

    const handleModalClick = (event, storeBusinessNumber) => {
        event.preventDefault();

        const ADS_URL = `${process.env.REACT_APP_ADS_LOGIN}/ads/login/${storeBusinessNumber}`;

        // 현재 브라우저 크기 기준 비율로 팝업 크기 설정
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // 원하는 비율 (예: 폭 80%, 높이 90%)
        const width = Math.min(450, Math.floor(screenWidth * 0.8));   // 최대 400px 제한
        const height = Math.min(800, Math.floor(screenHeight * 0.9)); // 최대 874px 제한

        const left = window.screenX + (screenWidth - width) / 2;
        const top = window.screenY + (screenHeight - height) / 2;

        window.open(
            ADS_URL,
            "_blank",
            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
        );
    };


    // 옛날 버전
    const handleTemplateClick = (event, storeBusinessNumber) => {
        event.preventDefault();

        const ADS_URL = `${process.env.REACT_APP_ADS}/ads/temp2/${storeBusinessNumber}`;
        const width = 393;
        const height = 900;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        window.open(
            ADS_URL,
            "_blank",
            `width=${width},height=${height},top=${top},left=${left}`
        );
    };


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStoreBusinessNumber, setSelectedStoreBusinessNumber] = useState(null);

    const handleClick = (storeBusinessNumber) => {
        setSelectedStoreBusinessNumber(storeBusinessNumber);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStoreBusinessNumber(null);
    };

    // 데이터가 없는 경우 처리
    if (!data || data.length === 0) {
        return <p>데이터가 없습니다.</p>;
    }
    // 테스트 주석
    return (
        <div>
            <div className="w-full overflow-x-auto">
                <div className="w-full hidden sm:block">
                    <DataLengthDown data={data} filename="loc_store.xlsx" />
                </div>
                <p className='pb-4'>기준 : {data[0]?.local_year || "정보 없음"}년 {data[0]?.local_quarter || "정보 없음"}분기</p>
                <table className="min-w-full border-collapse border border-gray-200 text-sm truncate p-4">
                    <thead className="sm:bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                코드
                            </th>
                            <th className="border border-gray-300 p-4 ">
                                <div className="flex justify-center items-center">
                                    매장명 / 지점명
                                    <button onClick={() => handleSort('store_name')} className="ml-2 flex flex-col items-center justify-center p-2">
                                        <span className="text-xs">▲</span>
                                        <span className="text-xs">▼</span>
                                    </button>
                                </div>
                            </th>
                            <th className="border border-gray-300 p-4">
                                wizAd
                            </th>
                            {/* <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                임시
                            </th> */}
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                지점명
                            </th>
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                <div className="flex justify-center items-center">
                                    시/도
                                    <button onClick={() => handleSort('city_name')} className="ml-2 flex flex-col items-center justify-center p-2">
                                        <span className="text-xs">▲</span>
                                        <span className="text-xs">▼</span>
                                    </button>
                                </div>
                            </th>
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                <div className="flex justify-center items-center">
                                    시/군/구
                                    <button onClick={() => handleSort('district_name')} className="ml-2 flex flex-col items-center justify-center p-2">
                                        <span className="text-xs">▲</span>
                                        <span className="text-xs">▼</span>
                                    </button>
                                </div>
                            </th>
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                <div className="flex justify-center items-center">
                                    읍/면/동
                                    <button onClick={() => handleSort('sub_district_name')} className="ml-2 flex flex-col items-center justify-center p-2">
                                        <span className="text-xs">▲</span>
                                        <span className="text-xs">▼</span>
                                    </button>
                                </div>
                            </th>
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">출처</th>
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                대분류
                            </th>
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                중분류
                            </th>
                            <th className="border border-gray-300 p-4 ">
                                소분류
                            </th>
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                표준산업분류명
                            </th>
                            <th className="border border-gray-300 p-4 hidden sm:table-cell ">
                                제휴사
                            </th>
                            {/* <th className="border border-gray-300 p-4 hidden sm:table-cell">
                            평점
                        </th> */}
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                건물명
                            </th>
                            <th className="border border-gray-300 p-4 hidden sm:table-cell">
                                주소
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index} className="border-t ">
                                <td className="border border-gray-300 p-4 text-cente  hidden sm:table-cell">{item.store_business_number}</td>
                                <td className="border border-gray-300 p-4">
                                    <p
                                        className="cursor-pointer hover:text-blue-600 inline-block"
                                        onClick={(e) => handleReportClick(e, item.store_business_number)}
                                    >
                                        {item.store_name}
                                    </p>
                                </td>
                                <td className="border border-gray-300 p-4 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <button
                                            onClick={() => handleClick(item.store_business_number)}
                                            className="hidden sm:block bg-blue-300 text-white p-2 rounded border border-gray-300 hover:border-gray-400"
                                        >
                                            정보 등록
                                        </button>
                                        <button
                                            onClick={(e) => handleModalClick(e, item.store_business_number)}
                                            className="hidden sm:block bg-blue-300 text-white p-2 rounded border border-gray-300 hover:border-gray-400"
                                        >
                                            wizAD
                                        </button>
                                        {/* ✅ 아래 두 줄의 td → div 로 변경 */}
                                        <div
                                            className="block sm:hidden bg-blue-300 text-white p-2 rounded border border-gray-300 hover:border-gray-400 cursor-pointer"
                                            onClick={(e) => handleModalClick(e, item.store_business_number)}
                                        >
                                            wizAD
                                        </div>
                                        <div
                                            className="block sm:hidden bg-blue-300 text-white p-2 rounded border border-gray-300 hover:border-gray-400 cursor-pointer"
                                            onClick={(e) => handleTemplateClick(e, item.store_business_number)}
                                        >
                                            AD
                                        </div>
                                    </div>
                                </td>

                                <td className="border border-gray-300 p-4 hidden sm:table-cell"
                                    onClick={(e) => handleTemplateClick(e, item.store_business_number)}
                                >
                                    {item.branch_name}
                                </td>
                                <td className="border border-gray-300 p-4 hidden sm:table-cell">{item.city_name}</td>
                                <td className="border border-gray-300 p-4 hidden sm:table-cell">{item.district_name}</td>
                                <td className="border border-gray-300 p-4 hidden sm:table-cell">{item.sub_district_name}</td>
                                <td className="border border-gray-300 p-4 hidden sm:table-cell">
                                    {item.source === 1 ? "나이스 비즈맵" : "상권정보분류표"}
                                </td>
                                <td className="border border-gray-300 p-4 hidden sm:table-cell">
                                    {item.source === 1 ? item.BIZ_MAIN_CATEGORY_NAME : item.large_category_name}
                                </td>
                                <td className="border border-gray-300 p-4 hidden sm:table-cell">
                                    {item.source === 1 ? item.BIZ_SUB_CATEGORY_NAME : item.medium_category_name}
                                </td>
                                <td className="border border-gray-300 p-4">
                                    {item.source === 1 ? item.BIZ_DETAIL_CATEGORY_NAME : item.small_category_name}
                                </td>
                                <td className="border border-gray-300 p-4 hidden sm:table-cell">{item.industry_name}</td>
                                <td className="border border-gray-300 p-4 hidden sm:table-cell">
                                    {(() => {
                                        const labels = [];
                                        if (item.jsam === 1) {
                                            labels.push("JSAM");
                                        }
                                        if (item.ktmyshop === 1) {
                                            labels.push("가게정보");
                                        }
                                        return labels.length > 0 ? labels.join(", ") : ""; // 조건에 맞는 텍스트 표시
                                    })()}
                                </td>
                                <td
                                    className="border border-gray-300 p-4 hidden sm:table-cell"

                                >
                                    {item.building_name}

                                </td>
                                <td className="border border-gray-300 p-4 hidden sm:table-cell">
                                    {item.road_name_address && (
                                        <>
                                            {item.road_name_address}
                                            {item.new_postal_code && ` (${item.new_postal_code})`}
                                            {item.dong_info && ` ${item.dong_info}동`}
                                            {item.floor_info && ` ${item.floor_info}층`}
                                            {item.unit_info && ` ${item.unit_info}호`}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* 모달 컴포넌트 */}
                <LocStoreContentModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    storeBusinessNumber={selectedStoreBusinessNumber}
                />
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default LocStoreList;
