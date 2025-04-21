import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import "./banner.css";

export default function Banner() {
  return (
    <div className="banner-brackground">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        loop={true}
        navigation
      >
        <SwiperSlide>
          <div className="slide-content-1"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content-2"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content-3">
            <h3>
              {" "}
              "Não espere mais, adote agora e transforme uma vida – incluindo a
              sua!"
            </h3>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
