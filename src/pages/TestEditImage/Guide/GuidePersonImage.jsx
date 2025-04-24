const GuidePersonImage = () => (
    <div className="">
        <div className="pb-4">
            <p className="">1. 인물 사진 업로드</p>
            <p className="">2. 스타일 선택</p>
            <p className="">3. 참조 사이트에 다양한 API 기능 지원</p>
        </div>
        <div className="">
            <p className="pb-4">결과물 예시</p>
            <img className='max-w-80' src={require("../../../assets/guide/guide_person_image.png")} alt="user-img" />
        </div>
    </div>
  );
  
  export default GuidePersonImage;
  