// components/GlobalModal.tsx
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { useGlobalModalStore } from "../stores/useGlobalModalStore";

export default function GlobalModal() {
  const {
    show,
    mainTitle,
    subTitle,
    imageUrl,
    onConfirm,
    onClose,
    close,
    confirmText,
    cancelText,
  } = useGlobalModalStore();

  const navigate = useNavigate();

  if (!show) return null;

  const handleConfirm = () => {
    close();
    if (onConfirm) {
      onConfirm();
    } else {
      navigate("/lib"); // 기본 행동: 캐릭터 탭으로 이동
    }
  };

  return (
    <ConfirmModal
      mainTitle={mainTitle}
      subTitle={subTitle}
      imageUrl={imageUrl}
      onClose={() => {
        close();
        onClose?.();
      }}
      onConfirm={handleConfirm}
      confirmText={confirmText || "확인"}
      cancelText={cancelText || "닫기"}
    />
  );
}
