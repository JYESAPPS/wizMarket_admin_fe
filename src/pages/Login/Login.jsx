import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header';
import Aside from '../../components/Aside';


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // 테스트 계정: jyes / 0622
        if (username === "jyes" && password === "0622") {
            // ✅ 로그인 성공!
            sessionStorage.setItem("isLoggedIn", "true");
            navigate("/");  // 로그인 후 이동할 페이지
        } else {
            // ❌ 로그인 실패
            setErrorMsg("아이디 또는 비밀번호가 틀렸습니다.");
        }
    };

    return (
        <div>
            <Header />
            <div className="flex">
                <dir className="mb:hidden">
                    <Aside />
                </dir>
                <div className="flex justify-center items-start p-12 w-full min-h-screen ">
                    <div className="bg-white ">
                        <h1 className="text-2xl font-bold pb-4 text-center">로그인</h1>
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="아이디"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 mb-4 border rounded"
                            />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 mb-4 border rounded"
                            />
                            {errorMsg && (
                                <div className="text-red-500 mb-2 text-center">{errorMsg}</div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                                로그인
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
