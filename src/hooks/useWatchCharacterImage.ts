import { useEffect } from "react";
import { useGeneratedCharacterStore } from "../stores/useGeneratedCharacterStore";
import { useGlobalModalStore } from "../stores/useGlobalModalStore";

const LOADING_URL = "https://cdn.example.com/loading.png";

export function useWatchCharacterImage() {
  const characterId = useGeneratedCharacterStore((s) => s.characterId);
  const isGenerating = useGeneratedCharacterStore((s) => s.isGenerating);
  const clear = useGeneratedCharacterStore((s) => s.clear);

  useEffect(() => {
    if (!isGenerating || !characterId) return;

    // 테스트용 모달: 10초 뒤에 강제로 띄우기
    const testTimer = setTimeout(() => {
      useGlobalModalStore.getState().open({
        mainTitle: "테스트 모달",
        subTitle: "10초가 지나 테스트 모달이 떴습니다.",
        imageUrl: "",
        onConfirm: () => {
          alert("확인 버튼이 눌렸습니다!");
        },
        confirmText: "이미지 보러 가기",
      });

      clear();
    }, 10000);

    /*
    const interval = setInterval(async () => {
      const res = await fetch(`/api/characters/${characterId}`);
      const data = await res.json();

      if (data.imageUrl && data.imageUrl !== LOADING_URL) {
        clear(); // 더 이상 감시 안 함
        clearInterval(interval);

        useGlobalModalStore.getState().open({
          mainTitle: "캐릭터 생성 완료!",
          subTitle: `${data.name} 캐릭터가 저장되었습니다.`,
          imageUrl: data.imageUrl,
        });
      }
    }, 5000);
    */

    return () => {
      //clearInterval(interval);
      clearTimeout(testTimer);
    };
  }, [characterId]);
}
