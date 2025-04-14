const GuideInsta = () => (
    <div className="">
        <div className="pb-4">
            <p className="pb-4">1. 원하는 사용자의 인스타 계정 입력</p>
            <img className='' src={require("../../../assets/guide/guide_1.png")} alt="user-img" />
        </div>
        <div className="pb-4">
            <p>2. 원하는 게시물 번호 입력</p>
            <img className='' src={require("../../../assets/guide/guide_2.png")} alt="user-img" />
        </div>
        <div>
            <p className="">* 게시물 번호 가져오는 방법 (앱으로는 번호가 안보임)</p>
            <p className="pb-4">업로드 후 바로 크롤링으로 해당 사용자의 가장 최근 게시물 번호 가져오기</p>
        </div>
    </div>
  );
  
  export default GuideInsta;
  