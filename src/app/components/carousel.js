"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CardHouse from "./card";

export default function Carousel({ houseDetails }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
    >
      {houseDetails.map((house) => (
        <SwiperSlide key={house.key}>
          <CardHouse houseDetails={house} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
