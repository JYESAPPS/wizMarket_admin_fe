import React, { useState } from "react";
import CategorySelect from "../../../components/CategorySelect";
import CitySelect from "../../../components/CitySelect";
import { useCities } from "../../../hooks/useCities";
import { useCategories } from "../../../hooks/useCategories";
import LocStoreDropDown from "../components/LocStoreDropDown"
import axios from 'axios';

const LocStoreAdd = ({ onClose }) => {

    const {
        cities,
        districts,
        subDistricts,
        city,
        district,
        subDistrict,
        setCity,
        setDistrict,
        setSubDistrict
    } = useCities();

    const {
        reference, setReference, references,
        mainCategory, setMainCategory, mainCategories,
        subCategory, setSubCategory, subCategories,
        detailCategory, setDetailCategory, detailCategories
    } = useCategories();

    const [storeName, setStoreName] = useState("")
    const [roadName, setRoadName] = useState("")
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [message, setMessage] = useState("");
    const [storeNum, setStoreNum] = useState("")

    const options = [
        { label: "JSAM", value: "jsam" },
        { label: "가게정보", value: "ktmyshop" },
        { label: "풀무원", value: "PULMUONE" },
    ];

    const addNewStore = async () => {

        if (
            !city || !district || !subDistrict || !reference ||
            !mainCategory || !subCategory || !detailCategory ||
            !storeName || !roadName
        ) {
            alert("반드시 모든 항목을 입력해주세요.");
            return; // 요청 보내지 않음
        }

        const payload = {
            city_id: Number(city),
            district_id: Number(district),
            sub_district_id: Number(subDistrict),
            reference_id: reference,
            large_category_code: mainCategory,
            medium_category_code: subCategory,
            small_category_code: detailCategory,
            store_name: storeName,
            road_name: roadName,
            selected: selectedOptions
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_BASE_URL}/loc/store/add`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMessage(response.data.message); 
            setStoreNum(response.data.number)
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
            }
        } finally {

        }
    }

    const copyData = async () => {

        const payload = {
            store_business_number : storeNum
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_FASTAPI_BASE_URL}/loc/store/copy`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
            }
        } finally {

        }
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
                <h2 className="text-xl font-bold pb-4">매장 수동 추가</h2>
                {/* 여기에 매장 정보 입력 폼 구성 */}
                <div className="pb-4">
                    <input
                        className="border p-2 w-full"
                        placeholder="상호명"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                    />

                </div>

                <div className="w-full flex gap-4 pb-4">
                    <CategorySelect
                        reference={reference}
                        references={references}
                        setReference={setReference}
                        mainCategory={mainCategory}
                        setMainCategory={setMainCategory}
                        mainCategories={mainCategories}
                        subCategory={subCategory}
                        setSubCategory={setSubCategory}
                        subCategories={subCategories}
                        detailCategory={detailCategory}
                        setDetailCategory={setDetailCategory}
                        detailCategories={detailCategories}
                    />
                </div>

                <div className="w-full flex gap-4 pb-4">
                    <CitySelect
                        reference={reference}
                        city={city}
                        district={district}
                        subDistrict={subDistrict}
                        cities={cities}
                        districts={districts}
                        subDistricts={subDistricts}
                        setCity={setCity}
                        setDistrict={setDistrict}
                        setSubDistrict={setSubDistrict}
                    />
                </div>

                <div className="w-full flex gap-4 pb-4">
                    <LocStoreDropDown
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                        options={options}
                    />
                </div>

                <div className="pb-4">
                    <input
                        className="border p-2 w-full"
                        placeholder="도로명주소"
                        value={roadName}
                        onChange={(e) => setRoadName(e.target.value)}
                    />
                </div>

                {message && (
                    <div className="p-4 text-sm text-center text-blue-700">
                        {message}
                    </div>
                )}


                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">닫기</button>
                    <button onClick={addNewStore} className="px-4 py-2 bg-blue-500 text-white rounded">저장</button>
                    <button onClick={copyData} className="px-4 py-2 bg-blue-500 text-white rounded">DB 연동</button>
                </div>
            </div>
        </div>
    );
};

export default LocStoreAdd;
