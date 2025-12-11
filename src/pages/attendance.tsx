import { useEffect, useState } from "react";
import { Attend, fetchAttendList, updateAttend } from "../lib/api";
import CreateAttendModal from "../components/CreateAttendModal";
import JoinAttendModal from "../components/JoinAttendModal";
import ParticipantsModal from "../components/ParticipantsModal";

export default function HomePage() {
  const [attendList, setAttendList] = useState<Attend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedForJoin, setSelectedForJoin] = useState<Attend | null>(null);

  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [selectedForParticipants, setSelectedForParticipants] =
    useState<Attend | null>(null);

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

  if (loading) return <div className="main-page">불러오는 중...</div>;
  if (error) return <div className="main-page">{error}</div>;

  return (
    <main className="main-page">
      <header className="app-header">
        <h1 className="app-title">아침식사 출석 관리</h1>
        <button
          onClick={() => setOpenCreateModal(true)}
          className="btn-primary"
        >
          일정 생성
        </button>
      </header>

      {attendList.length === 0 ? (
        <div className="empty-text">
          등록된 아침식사 일정이 없습니다.
          <br />
          상단의 일정 생성 버튼을 눌러 첫 모임을 만들어보세요.
        </div>
      ) : (
        <ul className="attend-list">
          {attendList.map((a) =>
            !a.id ? null : (
              <li
                key={a.id}
                className="attend-card"
                onClick={() => openParticipants(a)}
              >
                <div className="attend-card-header">
                  <div className="attend-title">{a.title}</div>
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
