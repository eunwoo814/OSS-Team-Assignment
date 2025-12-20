import { useState, useEffect } from "react";
import { Attend, getParticipantContacts, ParticipantContact } from "@/lib/api";
import { getUser } from "@/lib/auth";

type Props = {
  open: boolean;
  attend: Attend | null;
  onClose: () => void;
};

export default function ParticipantsModal({ open, attend, onClose }: Props) {
  const user = getUser();
  const [contacts, setContacts] = useState<ParticipantContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isHost = user && attend && user.name === attend.host;

  useEffect(() => {
    if (open && attend && isHost) {
      setLoading(true);
      setError("");
      getParticipantContacts(attend.id, attend.host)
        .then(setContacts)
        .catch((err) => {
          setError("연락처를 불러오지 못했습니다.");
          console.error(err);
        })
        .finally(() => setLoading(false));
    } else {
      setContacts([]);
    }
  }, [open, attend, isHost]);

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
          <div>
            <ul style={{ paddingLeft: 18, fontSize: 13, marginBottom: 16 }}>
              {list.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
            {isHost && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                  참가자 연락처 (호스트 전용)
                </h3>
                {loading ? (
                  <p style={{ fontSize: 13, color: "#6b7280" }}>불러오는 중...</p>
                ) : error ? (
                  <p style={{ fontSize: 13, color: "#dc2626" }}>{error}</p>
                ) : contacts.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#6b7280" }}>연락처 정보가 없습니다.</p>
                ) : (
                  <ul style={{ paddingLeft: 18, fontSize: 13 }}>
                    {contacts.map((contact, idx) => (
                      <li key={idx}>
                        {contact.name} - {contact.phone || "연락처 없음"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
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
