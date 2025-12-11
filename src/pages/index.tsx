import Link from "next/link";

export default function Home() {
  return (
    <main className="home-main">
      <div className="home-hero">
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>
          한동의 든든한 아침을 함께 만드는
          <br />
          아침식사 출석 관리 서비스
        </h1>
        <p style={{ fontSize: 15, color: "#4b5563" }}>
          아침마다 누가 함께 밥을 먹는지, 몇 명이 모일지 쉽게 관리해 보세요.
          <br />
          일정 생성, 참가 신청, 참가자 명단까지 한 번에 확인할 수 있습니다.
        </p>
        <Link href="/attendance">
          <button className="btn-primary" style={{ padding: "10px 22px" }}>
            아침식사 일정 보러 가기
          </button>
        </Link>
      </div>
    </main>
  );
}
