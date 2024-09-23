import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PopularRestaurants.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark as regularBookmark,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBookmark as solidBookmark,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { api } from '../../../config/config';
import { useAuthStore } from '../../../utils/store';
import defaultImage from '../../../img/store.png';

const PopularRestaurants = () => {
  const [koreanRestaurants, setKoreanRestaurants] = useState([]);
  const [chineseRestaurants, setChineseRestaurants] = useState([]);
  const [westernRestaurants, setWesternRestaurants] = useState([]);
  const [japaneseRestaurants, setJapaneseRestaurants] = useState([]);

  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);

  const serverURL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  const fetchRestaurantPhotos = (storeSeq) => {
    return fetch(`${serverURL}/photos/store/${storeSeq}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching photos');
        }
        return response.json();
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
        return [];
      });
  };

  const removeDuplicateNames = (restaurants) => {
    const uniqueRestaurants = [];
    const namesSet = new Set();

    restaurants.forEach((restaurant) => {
      if (!namesSet.has(restaurant.name)) {
        uniqueRestaurants.push(restaurant);
        namesSet.add(restaurant.name);
      }
    });

    return uniqueRestaurants;
  };

  const fetchRestaurants = (category, setRestaurants) => {
    fetch(`${serverURL}/store/category/${category}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(async (data) => {
        const updatedData = await Promise.all(
          data.map(async (restaurant) => {
            const photos = await fetchRestaurantPhotos(restaurant.storeSeq);
            const isBookmarked = await checkBookmark(restaurant.storeSeq); // 북마크 상태 확인
            return { ...restaurant, photos, isBookmarked };
          })
        );

        const filteredData = removeDuplicateNames(updatedData);
        setRestaurants(filteredData);
      })
      .catch((error) => console.error(`Error fetching ${category}:`, error));
  };

  const checkBookmark = async (storeSeq) => {
    const { userId } = useAuthStore.getState();
    try {
      const response = await api.get(`/bookmark/check/${storeSeq}`, {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchRestaurants('한식', setKoreanRestaurants);
    fetchRestaurants('중식', setChineseRestaurants);
    fetchRestaurants('카페,디저트', setWesternRestaurants);
    fetchRestaurants('일식', setJapaneseRestaurants);
  }, [serverURL]);

  const scrollLeft = (scrollRef) => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (scrollRef) => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleCardClick = (storeSeq) => {
    navigate(`/store/${storeSeq}`);
  };

  const toggleBookmark = async (e, restaurantId, setRestaurants, restaurants) => {
    e.stopPropagation();
    const { userId } = useAuthStore.getState();

    // 북마크 추가/삭제를 위한 bookmark 객체 생성
    const bookmark = {
      userId,
      storeSeq: restaurantId,
    };

    try {
      // API 호출: 북마크 추가/삭제
      const response = await api.post(`/bookmark/toggle`, bookmark);

      if (response.status === 200) {
        // 성공적으로 북마크 상태가 변경된 경우
        const updatedRestaurants = restaurants.map((restaurant) =>
          restaurant.storeSeq === restaurantId
            ? { ...restaurant, isBookmarked: !restaurant.isBookmarked }
            : restaurant
        );
        setRestaurants(updatedRestaurants);
      } else {
        console.error('Failed to toggle bookmark:', response.status);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const renderRestaurantCard = (restaurant, restaurants, setRestaurants) => (
    <div
      key={restaurant.storeSeq}
      className="restaurant-list-item restaurant-card"
      role="button"
      tabIndex={0}
      onClick={() => handleCardClick(restaurant.storeSeq)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleCardClick(restaurant.storeSeq);
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="tb">
        <div
          className="img"
          style={{
            backgroundImage: `url(${restaurant.photos && restaurant.photos.length > 0 ? restaurant.photos[0].imageUrl : defaultImage})`,
          }}
        ></div>
      </div>
      <div className="detail">
        <button
          className="btn-bookmark"
          onClick={(e) => toggleBookmark(e, restaurant.storeSeq, setRestaurants, restaurants)}
        >
          <FontAwesomeIcon
            icon={restaurant.isBookmarked ? solidBookmark : regularBookmark}
            className="faBookmark1"
          />
        </button>
        <div>
          <h3 className="name">{restaurant.name}</h3>
          <div className="meta">
            <span className="score">{restaurant.score}</span>
            <span className="tags">{restaurant.description}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const handleMoreClick = (category) => {
    navigate(`/storeList/${category}`);
  };

  return (
    <div>
      {/* 한식 섹션 */}
      <div id="korean" className="popular-restaurants container gutter-sm">
        <div className="section-header-wrap">
          <h2 className="section-header">한식</h2>
          <button className="btn-more" onClick={() => handleMoreClick('한식')}>
            더보기
          </button>
        </div>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef1)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="v-scroll-inner" ref={scrollRef1}>
            <div className="restaurant-list restaurant-list-sm">
              {koreanRestaurants.map((restaurant) =>
                renderRestaurantCard(restaurant, koreanRestaurants, setKoreanRestaurants)
              )}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef1)}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* 중식 섹션 */}
      <div id="chinese" className="popular-restaurants container gutter-sm">
        <div className="section-header-wrap">
          <h2 className="section-header">중식</h2>
          <button className="btn-more" onClick={() => handleMoreClick('중식')}>
            더보기
          </button>
        </div>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef2)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="v-scroll-inner" ref={scrollRef2}>
            <div className="restaurant-list restaurant-list-sm">
              {chineseRestaurants.map((restaurant) =>
                renderRestaurantCard(restaurant, chineseRestaurants, setChineseRestaurants)
              )}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef2)}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* 카페 섹션 */}
      <div id="western" className="popular-restaurants container gutter-sm">
        <div className="section-header-wrap">
          <h2 className="section-header">카페</h2>
          <button className="btn-more" onClick={() => handleMoreClick('카페,디저트')}>
            더보기
          </button>
        </div>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef3)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="v-scroll-inner" ref={scrollRef3}>
            <div className="restaurant-list restaurant-list-sm">
              {westernRestaurants.map((restaurant) =>
                renderRestaurantCard(restaurant, westernRestaurants, setWesternRestaurants)
              )}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef3)}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* 일식 섹션 */}
      <div id="japanese" className="popular-restaurants container gutter-sm">
        <div className="section-header-wrap">
          <h2 className="section-header">일식</h2>
          <button className="btn-more" onClick={() => handleMoreClick('일식')}>
            더보기
          </button>
        </div>
        <div className="section-body">
          <button className="scroll-button left" onClick={() => scrollLeft(scrollRef4)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="v-scroll-inner" ref={scrollRef4}>
            <div className="restaurant-list restaurant-list-sm">
              {japaneseRestaurants.map((restaurant) =>
                renderRestaurantCard(restaurant, japaneseRestaurants, setJapaneseRestaurants)
              )}
            </div>
          </div>
          <button className="scroll-button right" onClick={() => scrollRight(scrollRef4)}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularRestaurants;
