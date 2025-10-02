import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addAppMessageListener, postToApp } from "../bridges/appBridge";

const LS_AUTH = "auth.session.v1";

export default function useAuth() {
    const [session, setSession] = useState(() => {
        try { return JSON.parse(localStorage.getItem(LS_AUTH) || "null"); } catch { return null; }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const expireTimerRef = useRef(null);

    const isAuthed = !!session?.user;

    const saveSession = useCallback((s) => {
        setSession(s);
        try { localStorage.setItem(LS_AUTH, JSON.stringify(s)); } catch { }
    }, []);

    const clearSession = useCallback(() => {
        setSession(null);
        try { localStorage.removeItem(LS_AUTH); } catch { }
        if (expireTimerRef.current) clearTimeout(expireTimerRef.current);
    }, []);

    // 토큰 만료 타이머 (있을 때만)
    useEffect(() => {
        if (expireTimerRef.current) clearTimeout(expireTimerRef.current);
        if (!session?.expires_at) return;
        const ms = session.expires_at - Date.now();
        if (ms > 0) {
            expireTimerRef.current = setTimeout(() => clearSession(), ms);
        } else {
            clearSession();
        }
    }, [session?.expires_at, clearSession]);

    // App → Web 결과 수신
    useEffect(() => {
        const unbind = addAppMessageListener((msg, raw) => {
            if (!msg || typeof msg.type !== "string") return;
            if (raw?.data?.source === "react-devtools-content-script") return;

            if (msg.type === "SIGNIN_RESULT") {
                const p = msg.payload || {};
                setLoading(false);
                if (p.success) {
                    // 서버 없는 로컬 세션 모델 (필요 필드만 저장)
                    saveSession({
                        provider: p.provider,
                        user: p.user, // { id, nickname, avatar ... }
                        access_token: p.access_token,
                        id_token: p.id_token,
                        refresh_token: p.refresh_token,
                        expires_at: p.expires_at || null,
                        scopes: p.scopes || [],
                        at: Date.now(),
                    });
                    setError(null);
                } else {
                    setError(p.message || p.error_code || "signin_failed");
                }
            }

            if (msg.type === "SIGNOUT_RESULT") {
                setLoading(false);
                clearSession();
            }
        });
        return () => unbind?.();
    }, [saveSession, clearSession]);

    // Web → App 전송
    const startSignin = useCallback((provider) => {
        setLoading(true);
        setError(null);
        postToApp({ type: "START_SIGNIN", payload: { provider } });
    }, []);

    const startSignout = useCallback(() => {
        setLoading(true);
        setError(null);
        postToApp({ type: "START_SIGNOUT" });
    }, []);

    const value = useMemo(() => ({
        session, isAuthed, loading, error,
        startSignin, startSignout,
        saveSession, clearSession,
    }), [session, isAuthed, loading, error, startSignin, startSignout, saveSession, clearSession]);

    return value;
}
