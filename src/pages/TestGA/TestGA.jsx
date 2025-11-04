import Aside from '../../components/Aside';
import Header from '../../components/Header';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import LookerEmbed from './LookerEmbed'

const TestGA = () => {

    const REPORT_URL = "https://lookerstudio.google.com/embed/reporting/dc900c67-a976-491f-ae19-84dd27a7103c/page/kIV1C";


    return (
        <div>
            <Header />
            <div className="flex">
                <dir className="mb:hidden">
                    <Aside />
                </dir>
                <div className="p-6">
                    <h1 className="text-xl font-bold mb-4">트래픽 대시보드</h1>
                    <LookerEmbed src={REPORT_URL} title="테스트 GA 대시보드" lang="ko" height={1200} />
                </div>
            </div>
        </div >
    );
}

export default TestGA;
