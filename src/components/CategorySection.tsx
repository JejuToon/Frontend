import { useSwipeable } from "react-swipeable";
import { useCategoryTalesStore } from "../stores/useCategoryTalesStore";
import { IoLocationSharp } from "react-icons/io5";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import CustomButton from "../components/CustomButton";
import TaleCard from "../components/TaleCard";
import styled from "styled-components";
import { TaleContent } from "../types/tale";

export default function CategorySection({
  category,
  onTaleClick,
  onViewLocation,
}: {
  category: string;
  onTaleClick: (id: number) => void;
  onViewLocation: (t: TaleContent) => void;
}) {
  const {
    talesByCategory,
    currentPageByCategory,
    totalPagesByCategory,
    fetchTalesForCategory,
    loadingByCategory,
  } = useCategoryTalesStore();

  const tales = talesByCategory[category] || [];
  const currentPage = currentPageByCategory[category] || 0;
  const totalPages = totalPagesByCategory[category] || 1;
  const isLoading = loadingByCategory[category];

  const pageSize = 10;
  const paginatedTales = tales.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handlePageChange = (direction: "next" | "prev") => {
    const newPage =
      direction === "next"
        ? Math.min(currentPage + 1, totalPages - 1)
        : Math.max(currentPage - 1, 0);
    if (newPage !== currentPage) {
      fetchTalesForCategory(category, newPage);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handlePageChange("next"),
    onSwipedRight: () => handlePageChange("prev"),
  });

  if (tales.length === 0 && !isLoading) return null;

  return (
    <Section>
      <SectionHeader>
        <span>{category}</span>
      </SectionHeader>

      <SwipeWrapper {...swipeHandlers}>
        <TaleList>
          {paginatedTales.map((t) => (
            <TaleCard
              key={t.id}
              id={t.id}
              title={t.title}
              description={t.description}
              thumbnailUrl={t.thumbnail}
              onClick={() => onTaleClick(t.id)}
            >
              <CustomButton
                label="위치 보기"
                icon={<IoLocationSharp />}
                size="small"
                variant="filled"
                onClick={() => onViewLocation(t)}
              />
            </TaleCard>
          ))}
        </TaleList>

        <Pagination>
          <NavButton
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 0}
          >
            <FaAngleLeft />
          </NavButton>
          <PageText>
            {currentPage + 1} / {totalPages}
          </PageText>
          <NavButton
            onClick={() => handlePageChange("next")}
            disabled={currentPage + 1 >= totalPages}
          >
            <FaAngleRight />
          </NavButton>
        </Pagination>
      </SwipeWrapper>
    </Section>
  );
}

const Section = styled.section`
  padding: 16px;
`;

const SectionHeader = styled.div`
  margin-bottom: 12px;
  font-weight: 500;
`;

const TaleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SwipeWrapper = styled.div`
  touch-action: pan-y;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const PageText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;
