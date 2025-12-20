import { FormEvent, useState, useEffect } from "react";
import { Attend, createAttend, MealType } from "@/lib/api";
import { getUser } from "@/lib/auth";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (attend: Attend) => void;
};

export default function CreateAttendModal({ open, onClose, onCreated }: Props) {
  const user = getUser();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [maxPeople, setMaxPeople] = useState(6);
  const [host, setHost] = useState("");
  const [memo, setMemo] = useState("");
  const [mealType, setMealType] = useState<MealType>("아침");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && open) {
      setHost(user.name);
    }
  }, [user, open]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newAttend = await createAttend({
        title,
        date,
        time,
        place,
        maxPeople,
        host,
        memo,
        attendCount: 0,
        participants: [],
        mealType,
      });
      onCreated(newAttend);
      setTitle("");
      setDate("");
      setTime("");
      setPlace("");
      setMaxPeople(6);
      setHost("");
      setMemo("");
      setMealType("아침");
      onClose();
    } catch {
      alert("일정 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">새 식사 일정 만들기</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <span className="input-label">식사 종류</span>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["아침", "점심", "저녁"] as MealType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: `2px solid ${mealType === type ? "#3b82f6" : "#e5e7eb"}`,
                    borderRadius: "6px",
                    backgroundColor: mealType === type ? "#eff6ff" : "white",
                    color: mealType === type ? "#3b82f6" : "#6b7280",
                    fontWeight: mealType === type ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <span className="input-label">제목</span>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-label">날짜</span>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-label">시간</span>
            <input
              className="input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-label">장소</span>
            <input
              className="input"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="학생식당 1층"
              required
            />
          </div>

          <div className="input-group">
            <span className="input-label">최대 인원 수</span>
            <input
              className="input"
              type="number"
              min={1}
              value={maxPeople}
              onChange={(e) => setMaxPeople(Number(e.target.value))}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-label">호스트</span>
            <input
              className="input"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="정은우"
              required
              readOnly
              style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
            />
          </div>

          <div className="input-group">
            <span className="input-label">메모</span>
            <textarea
              className="textarea"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              placeholder="간단한 메모를 적어주세요."
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-ghost"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? "생성 중..." : "일정 생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
