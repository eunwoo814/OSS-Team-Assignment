import { FormEvent, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void> | void;
};

export default function JoinAttendModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit(name.trim());
      setName("");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">참가자 이름 입력</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <span className="input-label">이름</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              required
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-ghost"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "처리 중..." : "참가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
