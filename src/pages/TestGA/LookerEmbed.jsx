// src/components/LookerEmbed.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * Looker Studio 보고서를 iframe으로 임베드하는 심플 컴포넌트
 * - src: Looker Studio "임베드" URL (https://lookerstudio.google.com/embed/...)
 * - title: 접근성/탭 제목
 * - lang: UI 언어 강제 (예: 'ko'). null이면 원본 유지
 */
export default function LookerEmbed({ src, title="Analytics", lang="ko", height=1000 }) {
  // 언어 강제 적용 (?hl=ko)
  const url = React.useMemo(() => {
    if (!lang) return src;
    try {
      const u = new URL(src);
      if (!u.searchParams.get("hl")) u.searchParams.set("hl", lang);
      return u.toString();
    } catch {
      // src가 절대 URL이 아니면 그대로 사용
      return src.includes("?") ? `${src}&hl=${lang}` : `${src}?hl=${lang}`;
    }
  }, [src, lang]);

  return (
    <div className="w-full" style={{ height }}>
      <iframe
        title={title}
        src={url}
        style={{ width: "400%", height: "100%", border: 0, display: "block" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

LookerEmbed.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  lang: PropTypes.string,
};
