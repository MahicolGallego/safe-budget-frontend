import React, { useState } from "react";
import { onboardingViewed } from "../../actions/users.actions";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import "./styles.css";

// Import required modules
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./styles.css";

// Imports
import { Button, Image, Typography } from "antd";
import { CheckOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { LocalStorage } from "../../adapters/local-storage/LocalStorage";
import moneyImg from "../../assets/imgs/money.png";
import manBudgetImg from "../../assets/imgs/man-budget.png";
import chartsCheckImg from "../../assets/imgs/charts-check.png";
import clockImg from "../../assets/imgs/clock.png";

const { Title, Paragraph } = Typography;

export const Onboarding = () => {
  const [hiddenError, setHiddenError] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0); // index of the active page.
  const totalSlides = 4; // total pages.

  const handleConfirmOnboarding = async () => {
    const updatedUser = await onboardingViewed();
    if (!updatedUser) {
      setHiddenError(false);
    } else {
      LocalStorage.setItem("user", JSON.stringify(updatedUser));
      // Force reload the page to be detected
      // the change in the updated onboarding property
      // in the local storage user on the Auth Store when
      // verifying theLog in again
      window.location.reload();
    }
  };

  return (
    <div className="containerOnboarding">
      <Swiper
        pagination={true}
        modules={[Pagination]}
        className="mySwiper"
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        <SwiperSlide>
          <div className="onboardingImageContainer">
            <Image
              className="onboardingImage"
              preview={false}
              src={moneyImg}
              width={"100%"}
              height={"100%"}
            />
          </div>
          <Title level={2}>Welcome to Safe Budget</Title>
          <Paragraph className="onboardingParagraph">
            A simple and user-friendly tool designed to help you manage your
            monthly budgets efficiently.
          </Paragraph>
          <Paragraph className="onboardingParagraph">
            <strong>Start by creating your first budget!</strong>
          </Paragraph>
        </SwiperSlide>
        <SwiperSlide>
          <div className="onboardingImageContainer">
            <Image
              className="onboardingImage"
              preview={false}
              src={manBudgetImg}
              width={"100%"}
              height={"100%"}
            />
          </div>
          <Title level={2}>Transactions</Title>
          <Paragraph className="onboardingParagraph">
            By clicking on a budget, you can easily add and manage its expenses.
          </Paragraph>
        </SwiperSlide>
        <SwiperSlide>
          <div className="onboardingImageContainer">
            <Image
              className="onboardingImage"
              preview={false}
              src={chartsCheckImg}
              width={"100%"}
              height={"100%"}
            />
          </div>
          <Title level={2}>Charts</Title>
          <Paragraph className="onboardingParagraph">
            As you manage your expenses, you'll also receive real-time graphical
            reports showing how your spending is progressing.
          </Paragraph>
        </SwiperSlide>
        <SwiperSlide>
          <div className="onboardingImageContainer">
            <Image
              className="onboardingImage"
              preview={false}
              src={clockImg}
              width={"100%"}
              height={"100%"}
            />
          </div>
          <Title level={2}>Schedules</Title>
          <Paragraph className="onboardingParagraph">
            Schedules in the app automatically update the status of your
            budgets—Pending, <strong>Active</strong> , or
            <strong> Completed</strong>—on the first day of each month at 00:00
            UTC. Please make sure to check your device's local time zone to
            understand when these updates occur. This is important because
            certain actions, like adding transactions, are restricted based on
            the budget's status.
          </Paragraph>
        </SwiperSlide>
      </Swiper>
      <Paragraph className="errorMessage" hidden={hiddenError}>
        ¡Error to confirm onboarding!
      </Paragraph>
      <Button
        onClick={handleConfirmOnboarding}
        type="primary"
        icon={
          activeIndex === totalSlides - 1 ? (
            <CheckOutlined />
          ) : (
            <DoubleRightOutlined />
          )
        }
        iconPosition="start"
        style={{ display: "flex", marginLeft: "auto" }}
      >
        {activeIndex === totalSlides - 1 ? "Finish" : " Skip"}
      </Button>
    </div>
  );
};
