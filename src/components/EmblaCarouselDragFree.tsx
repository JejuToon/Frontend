import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import TaleCardSimple from "../components/TaleCardSimple";

interface Slide {
  id: number;
  title: string;
  thumbnailUrl: string;
}

type PropType = {
  slides: Slide[];
  options?: EmblaOptionsType;
  onTaleClick?: (tale: Slide) => void;
};

const EmblaCarouselDragFree: React.FC<PropType> = (props) => {
  const { slides, options, onTaleClick } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  return (
    <div className="embla-drag">
      <div className="embla-drag__viewport" ref={emblaRef}>
        <div className="embla-drag__container">
          {slides.map((slide) => (
            <div className="embla-drag__slide" key={slide.id}>
              <TaleCardSimple
                title={slide.title}
                thumbnailUrl={slide.thumbnailUrl}
                onClick={() => onTaleClick?.(slide)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarouselDragFree;
