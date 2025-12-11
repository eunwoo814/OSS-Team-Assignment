import { FormEvent, useState } from "react";
import { Attend, createAttend } from "../lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (attend: Attend) => void;
};

export default function CreateAttendModal({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [maxPeople, setMaxPeople] = useState(6);
  const [host, setHost] = useState("");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      });
      onCreated(newAttend);
      setTitle("");
      setDate("");
      setTime("");
      setPlace("");
      setMaxPeople(6);
      setHost("");
      setMemo("");
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
        <h2 className="modal-title">새 아침식사 일정 만들기</h2>
        <form onSubmit={handleSubmit} className="modal-form">
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
