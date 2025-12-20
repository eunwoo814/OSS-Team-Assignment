import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { Attend, fetchAttendList, updateAttend, MealType } from "@/lib/api";
import { getUser, removeUser } from "@/lib/auth";
import CreateAttendModal from "@/components/CreateAttendModal";
import JoinAttendModal from "@/components/JoinAttendModal";
import ParticipantsModal from "@/components/ParticipantsModal";
import WeatherCard from "@/components/WeatherCard";

type SortOption = "최신순" | "인원수별";
type FilterOption = "전체" | MealType;

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const [attendList, setAttendList] = useState<Attend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("최신순");
  const [filterBy, setFilterBy] = useState<FilterOption>("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedForJoin, setSelectedForJoin] = useState<Attend | null>(null);

  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [selectedForParticipants, setSelectedForParticipants] =
  useState<Attend | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    fetchAttendList()
      .then(setAttendList)
      .catch(() => setError("일정 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(newAttend: Attend) {
    setAttendList((prev) => [...prev, newAttend]);
  }

  function openJoin(attend: Attend) {
    setSelectedForJoin(attend);
    setJoinModalOpen(true);
  }

  function openParticipants(attend: Attend) {
    setSelectedForParticipants(attend);
    setParticipantsModalOpen(true);
  }

  async function handleJoinWithName(name: string) {
    if (!selectedForJoin || !selectedForJoin.id) return;
    const target = selectedForJoin;
    const currentCount = target.attendCount ?? 0;
    if (currentCount >= target.maxPeople) {
      alert("이미 정원이 가득 찼습니다.");
      return;
    }
    const currentList = target.participants ?? [];
    const updated = await updateAttend(target.id, {
      ...target,
      attendCount: currentCount + 1,
      participants: [...currentList, name],
    });
    setAttendList((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    setSelectedForJoin(updated);
  }

  const filteredAndSortedList = useMemo(() => {
    let filtered = attendList;

    // 검색 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter((attend) =>
        attend.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 식사 종류 필터링
    if (filterBy !== "전체") {
      filtered = filtered.filter((attend) => attend.mealType === filterBy);
    }

    // 정렬
    const sorted = [...filtered];
    if (sortBy === "최신순") {
      sorted.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (sortBy === "인원수별") {
      sorted.sort((a, b) => {
        const capacityA = (a.attendCount ?? 0) / a.maxPeople;
        const capacityB = (b.attendCount ?? 0) / b.maxPeople;
        return capacityB - capacityA;
      });
    }

    return sorted;
  }, [attendList, searchQuery, filterBy, sortBy]);

  if (loading) return <div className="main-page">불러오는 중...</div>;
  if (error) return <div className="main-page">{error}</div>;

  function handleLogout() {
    removeUser();
    setUser(null);
    router.push("/login");
  }

  if (!user) return null;

  return (
    <main className="main-page">
      <header className="app-header">
        <h1 className="app-title">식사 출석 관리</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            {user.name}님
          </span>
          <button
            onClick={() => setOpenCreateModal(true)}
            className="btn-primary"
          >
            일정 생성
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <WeatherCard lat={36.1037} lon={129.3876} title="포항 현재 날씨" />
      <div style={{ height: 12 }} />

      {/* 검색 및 필터 UI */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* 검색 바 */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="제목으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>

        {/* 필터 및 정렬 */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* 식사 종류 필터 */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              flex: 1,
              minWidth: "200px",
            }}
          >
            {(["전체", "아침", "점심", "저녁"] as FilterOption[]).map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilterBy(option)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: `1px solid ${
                      filterBy === option ? "#3b82f6" : "#e5e7eb"
                    }`,
                    borderRadius: "6px",
                    backgroundColor:
                      filterBy === option ? "#eff6ff" : "white",
                    color: filterBy === option ? "#3b82f6" : "#6b7280",
                    fontWeight: filterBy === option ? 600 : 400,
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "all 0.2s",
                  }}
                >
                  {option}
                </button>
              )
            )}
          </div>

          {/* 정렬 옵션 */}
          <div style={{ display: "flex", gap: "6px" }}>
            {(["최신순", "인원수별"] as SortOption[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSortBy(option)}
                style={{
                  padding: "8px 16px",
                  border: `1px solid ${sortBy === option ? "#3b82f6" : "#e5e7eb"}`,
                  borderRadius: "6px",
                  backgroundColor: sortBy === option ? "#eff6ff" : "white",
                  color: sortBy === option ? "#3b82f6" : "#6b7280",
                  fontWeight: sortBy === option ? 600 : 400,
                  cursor: "pointer",
                  fontSize: "13px",
                  transition: "all 0.2s",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredAndSortedList.length === 0 ? (
        <div className="empty-text">
          {searchQuery || filterBy !== "전체"
            ? "검색 조건에 맞는 일정이 없습니다."
            : "등록된 식사 일정이 없습니다."}
          <br />
          {!searchQuery && filterBy === "전체" && (
            <>상단의 일정 생성 버튼을 눌러 첫 모임을 만들어보세요.</>
          )}
        </div>
      ) : (
        <ul className="attend-list">
          {filteredAndSortedList.map((a) =>
            !a.id ? null : (
              <li
                key={a.id}
                className="attend-card"
                onClick={() => openParticipants(a)}
              >
                <div className="attend-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div className="attend-title">{a.title}</div>
                    <span
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#eff6ff",
                        color: "#3b82f6",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {a.mealType}
                    </span>
                  </div>
                  <div className="attend-datetime">
                    {a.date} · {a.time}
                  </div>
                </div>
                <div className="attend-meta">
                  <span>장소: {a.place}</span>
                  <span className="badge-capacity">
                    {a.attendCount} / {a.maxPeople}
                  </span>
                  <span className="badge-host">호스트: {a.host}</span>
                </div>
                {a.memo && (
                  <div className="attend-memo">메모: {a.memo}</div>
                )}
                <div className="attend-actions">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openJoin(a);
                    }}
                    className="btn-join"
                    disabled={(a.attendCount ?? 0) >= a.maxPeople}
                  >
                    {(a.attendCount ?? 0) >= a.maxPeople ? "정원 마감" : "참가"}
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}

      <CreateAttendModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreated={handleCreated}
      />

      <JoinAttendModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onSubmit={handleJoinWithName}
      />

      <ParticipantsModal
        open={participantsModalOpen}
        attend={selectedForParticipants}
        onClose={() => setParticipantsModalOpen(false)}
      />
    </main>
  );
}
