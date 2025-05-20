import React, { useCallback, useEffect, useRef } from "react";
import { colors } from "../constants/colors";
import styled from "styled-components";
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";

import { TaleContent } from "../types/tale";

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

type PropType = {
  slides: TaleContent[];
  options?: EmblaOptionsType;
  onNextRef?: (fn: () => void) => void;
  onUserInteraction?: () => void;
  onSlideClick?: (slide: TaleContent) => void;
};

const EmblaCarousel: React.FC<PropType> = ({
  slides,
  options,
  onNextRef,
  onUserInteraction,
  onSlideClick,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<(HTMLElement | null)[]>([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const currentSlide = slides[selectedIndex];

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, onUserInteraction);

  // 슬라이드 DOM 요소 저장
  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi
      .slideNodes()
      .map((slideNode) => slideNode.querySelector(".embla__slide__card"));
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const scale = numberWithinRange(tweenValue, 0, 1).toString();
          const tweenNode = tweenNodes.current[slideIndex];
          if (tweenNode) {
            tweenNode.style.transform = `scale(${scale})`;
          }
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale)
      .on("pointerDown", () => onUserInteraction?.());
  }, [emblaApi, tweenScale, onUserInteraction, setTweenNodes]);

  useEffect(() => {
    if (onNextRef) onNextRef(onNextButtonClick);
  }, [onNextButtonClick, onNextRef]);

  return (
    <EmblaRoot>
      <EmblaViewport ref={emblaRef}>
        <EmblaContainer>
          {slides.map((slide) => (
            <EmblaSlide key={slide.id}>
              <EmblaSlideCard
                className="embla__slide__card"
                onClick={() => onSlideClick?.(slide)} //클릭 시 slide 객체 전달
                style={{ cursor: "pointer" }}
              >
                <img
                  src={slide.thumbnail}
                  alt={slide.title}
                  className="embla__slide__image"
                />
              </EmblaSlideCard>
            </EmblaSlide>
          ))}
        </EmblaContainer>
      </EmblaViewport>

      <EmblaControls>
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
        <EmblaTitle
          onClick={() => currentSlide && onSlideClick?.(currentSlide)}
          style={{ cursor: "pointer" }}
        >
          {currentSlide?.title}
        </EmblaTitle>

        <EmblaDots>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={
                "embla__dot" +
                (index === selectedIndex ? " embla__dot--selected" : "")
              }
            />
          ))}
        </EmblaDots>
      </EmblaControls>
    </EmblaRoot>
  );
};

export default EmblaCarousel;

const EmblaRoot = styled.div`
  position: relative;
  padding-top: 20px;
  --slide-height: 19rem;
  --slide-spacing: 0rem;
  --slide-size: 45%;
  background-color: ${({ theme }) =>
    theme.mode == "dark" ? colors.BLACK : colors.WHITE};
`;

const EmblaViewport = styled.div`
  overflow: hidden;
  z-index: 1;
`;

const EmblaContainer = styled.div`
  display: flex;
  touch-action: pan-y pinch-zoom;
`;

const EmblaSlide = styled.div`
  transform: translate3d(0, 0, 0);
  flex: 0 0 80%;
  min-width: 0;
  padding-left: 0rem;
  margin-bottom: 10px;
`;

const EmblaSlideCard = styled.div`
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.15);
  background: ${({ theme }) => theme.background};
  cursor: pointer;
`;

const EmblaControls = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 2.4rem;
  gap: 0.8rem;
  margin-top: 1rem;
  z-index: 1;
`;

const EmblaTitle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const EmblaDots = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.4rem;
  padding-right: 10px;
`;
