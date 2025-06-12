import Aside from '../../components/Aside';
import Header from '../../components/Header';
import Gif from '../../assets/main/firework_icon.gif'
import Logo from '../../assets/main/jyes_logo.png'

const Main = () => {

    return (
        <div>
            <Header />
            <div className="flex">
                <dir className="">
                    <Aside />
                </dir>
                <main className="flex flex-col gap-4 p-4 overflow-x-hidden w-full">
                    <div className="flex flex-col items-center justify-center p-4">
                        <img src={Logo} alt="Logo" className="max-h-48 pb-12" />
                        <h1 className="text-4xl font-extrabold mb-4">환영합니다!</h1>
                        <img src={Gif} alt="Firework" className="h-96 pb-4" />
                        <p className="text-2xl font-bold">여기는 메인 페이지입니다.</p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Main;
