import { Attend } from "../lib/api";

type Props = {
  open: boolean;
  attend: Attend | null;
  onClose: () => void;
};

export default function ParticipantsModal({ open, attend, onClose }: Props) {
  if (!open || !attend) return null;

  const list = attend.participants ?? [];

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">참가자 명단</h2>
        <p style={{ fontSize: 14, marginBottom: 10 }}>{attend.title}</p>
        {list.length === 0 ? (
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            아직 참가자가 없습니다.
          </p>
        ) : (
          <ul style={{ paddingLeft: 18, fontSize: 13 }}>
            {list.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        )}
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
