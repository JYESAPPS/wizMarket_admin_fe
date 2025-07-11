import React, { useEffect, useState, useRef } from 'react';
import Header from '../../components/Header';
import Aside from '../../components/Aside';
import SectionHeader from '../../components/SectionHeader';
import KakaoMap from '../../components/KakaoMap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import dfs_xy_conv from '../../utils/transCoordinateKMA';
import getCurrentDate from '../../utils/getCurrentDate';
import LocContextSearchForm from './components/LocContextSearchForm';
import { useCities } from '../../hooks/useCities';
import { useKakaoAddressUpdate } from '../../hooks/useKakaoAddressUpdate';
import LocContextList from './components/LocContextList';

const LocContext = () => {
    const kakaoAddressResult = useSelector((state) => state.address.kakaoAddressResult);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isList, setIsList] = useState(false);

    const [weatherData, setWeatherData] = useState(null);
    const [caiData, setCaiData] = useState(null);
    const [riseData, setRiseData] = useState(null);

    const prevKakaoAddressResult = useRef(null);
    const { region_1depth_name: cityName, region_2depth_name: fullDistrict, region_3depth_name: subDistrictName } = kakaoAddressResult;

    let districtName = ""
    if (fullDistrict) {
        districtName = fullDistrict.split(' ')[0];
    }



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



    useKakaoAddressUpdate({
        kakaoAddressResult,
        cities,
        districts,
        subDistricts,
        setCity,
        setDistrict,
        setSubDistrict,
    });

    const handleToggle = () => {
        setIsList(!isList);
    };



    const handleSearch = () => {
        console.log("handle")

        // const fetchData = async () => {
        //     setLoading(true);
        //     setError(null);

        //     try {
        //         const response = await axios.get(`${process.env.REACT_APP_FASTAPI_BASE_URL}/rising/rb`, {
        //             headers: {
        //                 'Content-Type': 'application/json; charset=UTF-8',
        //             },
        //             params: {
        //                 search_cate: searchCate || undefined,
        //                 city_id: parseInt(city) || undefined,
        //                 district_id: parseInt(district) || undefined,
        //                 sub_district_id: parseInt(subDistrict) || undefined,
        //                 biz_main_category_id: parseInt(mainCategory) || undefined,
        //                 biz_sub_category_id: parseInt(subCategory) || undefined,
        //                 biz_detail_category_id: parseInt(detailCategory) || undefined,
        //                 growth_rate_min: parseFloat(increaseRateMin) || undefined,
        //                 growth_rate_max: parseFloat(increaseRateMax) || undefined,
        //                 rank_min: parseInt(rankMin) || undefined,
        //                 rank_max: parseInt(rankMax) || undefined
        //             },
        //         });
        //         setData(response.data);
        //     } catch (error) {
        //         console.error('Error fetching data from FastAPI', error);
        //         setError('Failed to fetch data');
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // fetchData();
    };

    const handleReset = () => {
        setCity(null);
        setDistrict(null);
        setSubDistrict(null);
    };

    // 기존
    useEffect(() => {
        if (!kakaoAddressResult) return;

        let { x, y } = kakaoAddressResult;
        const formatCurrentDate = getCurrentDate();

        const fetchWeaherData = async () => {
            const rs = dfs_xy_conv("toXY", y, x);
            const weatherApiUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.REACT_APP_DATA_GO_KR_API_KEY}&pageNo=1&numOfRows=1000&dataType=json&base_date=${formatCurrentDate}&base_time=0200&nx=${rs.x}&ny=${rs.y}`;

            try {
                const response = await axios.get(weatherApiUrl);
                if (response.status === 200) {
                    const { body } = response.data.response;
                    if (body && body.items && body.items.item) {
                        setWeatherData(body.items.item);
                    } else {
                        console.warn('API 응답에 예상된 데이터 구조가 없습니다.');
                        setWeatherData([]);
                    }
                } else {
                    setWeatherData([]);
                }
            } catch (error) {
                console.error('Error fetching weather data', error);
                setError('Failed to fetch weather data');
            } finally {
                setLoading(false);
            }

        };

        const fetchCAIData = async () => {

            let caseCity = kakaoAddressResult.region_1depth_name;

            switch (caseCity) {
                case '서울특별시':
                    caseCity = '서울';
                    break;
                case '부산광역시':
                    caseCity = '부산';
                    break;
                case '대구광역시':
                    caseCity = '대구';
                    break;
                case '인천광역시':
                    caseCity = '인천';
                    break;
                case '광주광역시':
                    caseCity = '광주';
                    break;
                case '대전광역시':
                    caseCity = '대전';
                    break;
                case '울산광역시':
                    caseCity = '울산';
                    break;
                case '세종특별자치시':
                    caseCity = '세종';
                    break;
                case '경기도':
                    caseCity = '경기';
                    break;
                case '충청북도':
                    caseCity = '충북';
                    break;
                case '충청남도':
                    caseCity = '충남';
                    break;
                case '전라남도':
                    caseCity = '전남';
                    break;
                case '경상북도':
                    caseCity = '경북';
                    break;
                case '경상남도':
                    caseCity = '경남';
                    break;
                case '제주특별자치도':
                    caseCity = '제주';
                    break;
                case '강원특별자치도':
                    caseCity = '강원';
                    break;
                case '전북특별자치도':
                    caseCity = '전북';
                    break;
                default:
                    caseCity = '시도명err';
                    break;
            }

            const caiApiUrl = `${process.env.REACT_APP_FASTAPI_BASE_URL}/cai?city=${caseCity}`;

            try {
                const response = await axios.get(caiApiUrl);
                if (response.status === 200) {
                    const { body } = response.data.response;
                    if (body && body.items && body.items) {
                        setCaiData(body.items);
                    } else {
                        console.warn('API 응답에 예상된 데이터 구조가 없습니다.');
                        setCaiData([]);
                    }
                } else {
                    setCaiData([]);
                }
            } catch (error) {
                console.error('Error fetching weather data', error);
                setError('Failed to fetch weather data');
            } finally {
                setLoading(false);
            }
        };

        const fetchRiseData = async () => {

            let city = kakaoAddressResult.region_1depth_name;

            // console.log("위도 : " + y)
            // console.log("경도 : " + x)
            // console.log(formatCurrentDate)

            if (city === "서울특별시") {
                x = 127.01337714858089
                y = 37.53462985578658
            }

            const riseApiUrl = `http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getLCRiseSetInfo?serviceKey=${process.env.REACT_APP_DATA_GO_KR_API_KEY}&locdate=${formatCurrentDate}&longitude=${x}&latitude=${y}&dnYn=Y`;

            try {
                const response = await axios.get(riseApiUrl);
                // console.log(response)

                if (response.status === 200) {
                    const { body } = response.data.response;
                    if (body && body.items && body.items.item) {
                        setRiseData(body.items.item);
                    } else {
                        console.warn('API 응답에 예상된 데이터 구조가 없습니다.');
                        setRiseData("");
                    }
                } else {
                    setRiseData("");
                }
            } catch (error) {
                console.error('Error fetching weather data', error);
                setError('Failed to fetch weather data');
            } finally {
                setLoading(false);
            }

        }



        if (
            !prevKakaoAddressResult.current ||
            prevKakaoAddressResult.current.region_3depth_name !== kakaoAddressResult.region_3depth_name ||
            prevKakaoAddressResult.current.x !== kakaoAddressResult.x ||
            prevKakaoAddressResult.current.y !== kakaoAddressResult.y
        ) {
            fetchWeaherData();
            fetchRiseData()
        }

        if (
            !prevKakaoAddressResult.current ||
            prevKakaoAddressResult.current.region_1depth_name !== kakaoAddressResult.region_1depth_name
        ) {
            fetchCAIData();
        }

        prevKakaoAddressResult.current = kakaoAddressResult;

    }, [kakaoAddressResult]);



    return (
        <div>
            <Header />
            <div className="flex">
                <Aside />
                <main className="gap-2 pr-10 w-full">
                    <section>
                        <SectionHeader title="날씨정보" isList={isList} handleToggle={handleToggle} />
                    </section>
                    <section className="flex gap-4 py-4 ">
                        {!isList && (
                            <div className='flex-1 min-h-96'>
                                <div className="min-w-full h-full">
                                    <KakaoMap />
                                </div>
                            </div>
                        )}
                        <div className='flex-1 min-h-full'>
                            <LocContextSearchForm
                                city={city}
                                district={district}
                                subDistrict={subDistrict}

                                cities={cities}
                                districts={districts}
                                subDistricts={subDistricts}

                                setCity={setCity}
                                setDistrict={setDistrict}
                                setSubDistrict={setSubDistrict}

                                handleSearch={handleSearch}
                                handleReset={handleReset}
                            />
                        </div>
                    </section>

                    <section className='pb-10'>
                        {loading && <p>Loading...</p>}
                        {error && <p>Error: {error}</p>}
                        {weatherData && !loading && !error && (
                            <LocContextList
                                loading={loading}
                                error={error}
                                weatherData={weatherData}
                                caiData={caiData}
                                riseData={riseData}
                                city={city}
                                district={district}
                                subDistrict={subDistrict}
                                cityName={cityName}
                                districtName={districtName}
                                subDistrictName={subDistrictName}
                            />
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default LocContext;
