const GuideChageImage = () => (
    <div className="">
        <div className="pb-4">
            <p className="">1. 이미지 속 찾을 객체 작성</p>
            <p className="">ex) tiger</p>
            <p className="">2. 해당 객체 무엇으로 바꿀 지 작성</p>
            <p className="">ex) golden retriever in a field</p>
        </div>
        <div className="">
            <p className="pb-4">결과물 예시</p>
            <img className='max-w-80' src={require("../../../assets/guide/guide_change_image.png")} alt="user-img" />
        </div>
    </div>
  );
  
  export default GuideChageImage;
  