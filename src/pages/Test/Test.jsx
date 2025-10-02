import Aside from '../../components/Aside';
import Header from '../../components/Header';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KCB_COMMONSVL_URL = 'https://safe.ok-name.co.kr/CommonSvl';
const KCB_TC = 'kcb.oknm.online.main.popup.cmd.P941_CertChoiceCmd';

const Test = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);   // start 응답(= svc_tkn 등)
  const [finalRes, setFinalRes] = useState(null);   // popup-result 응답(암호화 원문)

  const START_API = `${process.env.REACT_APP_FASTAPI_BASE_URL}/test/kcb/start`;
  const RESULT_API = `${process.env.REACT_APP_FASTAPI_BASE_URL}/test/kcb/result`;

  // ✅ 3단계: return_url로 복귀했을 때 URL의 svc_tkn을 읽어 즉시 결과조회
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const svcTkn = q.get('svc_tkn') || q.get('SVC_TKN');
    if (!svcTkn) return;

    // ✅ 중복 호출 방지 (새로고침/이중 마운트 보호)
    if (sessionStorage.getItem('kcb_done') === '1') return;

    const encJson = sessionStorage.getItem('kcb_enc');
    if (!encJson) return; // 개발 단계: enc_key 없으면 스킵
    const enc = JSON.parse(encJson);

    (async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.post(
          `${process.env.REACT_APP_FASTAPI_BASE_URL}/test/kcb/decrypt`,
          {
            svc_tkn: svcTkn,
            enc_key: enc.enc_key,
            enc_algo_cd: enc.enc_algo_cd, // 반드시 1331(AES)
            enc_iv: enc.enc_iv,
          },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        // 평문 결과(data.user) 사용
        console.log('복호화 결과:', data);
        // TODO: 여기서 회원가입/로그인 처리 등

        // ✅ 한 번만 실행되도록 마킹
        sessionStorage.setItem('kcb_done', '1');

        // (선택) URL 정리: 토큰 파라미터 제거
        window.history.replaceState({}, '', window.location.pathname);
      } catch (e) {
        const msg = e?.response?.data?.detail || e?.message || '복호화 중 오류가 발생했습니다.';
        setError(msg);
      } finally {
        setLoading(false);
        // 키는 사용 후 폐기
        sessionStorage.removeItem('kcb_enc');
      }
    })();
  }, []);


  // 1단계: 시작(서비스토큰 발급)
  const handleStartVerification = async () => {
    try {
      setLoading(true);
      setError('');
      const payload = {
        // ✅ 고정 IP로 설정 (요청대로)
        return_url: `http://192.168.0.239:3000/test`,
      };
      const { data } = await axios.post(START_API, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setResult(data);
      // ✅ 개발용: 페이지 이동 전에 enc 정보를 세션에 잠깐 저장
      if (data?.enc_key) {
        sessionStorage.setItem(
          'kcb_enc',
          JSON.stringify({
            enc_key: data.enc_key,
            enc_algo_cd: data.enc_algo_cd,
            enc_iv: data.enc_iv,
          })
        );
      }
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || '요청 중 오류가 발생했습니다.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2단계: 표준창 열기
  const handleOpenKCBPopup = () => {
    if (!result?.svc_tkn || !result?.idcf_mbr_com_cd) {
      setError('svc_tkn이 없습니다. 먼저 "본인인증 시작"을 눌러주세요.');
      return;
    }

    const popupName = 'kcb_popup';
    const popup = window.open('', popupName, 'width=430,height=660,menubar=no,toolbar=no,location=no,status=no');

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://safe.ok-name.co.kr/CommonSvl';
    form.style.display = 'none';
    form.target = '_self'; // ✅ 같은 창으로 이동

    [
      { name: 'tc', value: KCB_TC },
      { name: 'idcf_mbr_com_cd', value: String(result.idcf_mbr_com_cd) },
      { name: 'svc_tkn', value: String(result.svc_tkn) },
    ].forEach(({ name, value }) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div>
      <Header />
      <div className="flex">
        <div className="mb:hidden"><Aside /></div>
        <main className="flex flex-col gap-4 h-full w-full p-4 overflow-y-auto">
          <div className="flex flex-col pt-2 gap-4">
            <button
              onClick={handleStartVerification}
              disabled={loading}
              className="w-[220px] h-12 rounded-xl border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? '요청 중…' : '본인인증 시작'}
            </button>

            <button
              onClick={handleOpenKCBPopup}
              disabled={!result?.svc_tkn}
              className="w-[220px] h-12 rounded-xl border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              본인인증 창 열기
            </button>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            {result && (
              <div className="text-sm bg-gray-50 border border-gray-200 rounded-lg p-3 w-full max-w-xl">
                <div className="font-semibold mb-2">START 응답</div>
                <div>rsp_cd: <b>{result.rsp_cd || '-'}</b></div>
                <div>idcf_mbr_com_cd: {result.idcf_mbr_com_cd || '-'}</div>
                <div>svc_tkn: {result.svc_tkn ? `${String(result.svc_tkn).slice(0, 8)}…` : '-'}</div>
                <div>rqst_svc_tx_seqno: {result.rqst_svc_tx_seqno || '-'}</div>
              </div>
            )}

            {finalRes && (
              <div className="text-sm bg-gray-50 border border-gray-200 rounded-lg p-3 w-full max-w-xl">
                <div className="font-semibold mb-2">RESULT 응답(암호화 원문)</div>
                <div>rsp_cd: <b>{finalRes.rsp_cd || '-'}</b></div>
                <div className="text-xs text-gray-500 mb-2">has_enc_key(서버보관여부): {String(finalRes.has_enc_key)}</div>
                <pre className="text-xs bg-white border rounded p-2 max-h-[320px] overflow-auto">
                  {JSON.stringify(finalRes.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Test;
