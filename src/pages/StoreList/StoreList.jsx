import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import './StoreList.css';

const StoreList = () => {
  const { category } = useParams(); // URL에서 카테고리를 가져옴
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const serverURL = process.env.REACT_APP_SERVER_URL;

  // 중복된 가게를 필터링하는 함수
  const removeDuplicateStores = (newStores, existingStores) => {
    const existingStoreIds = new Set(existingStores.map(store => store.storeSeq)); // 기존 데이터의 storeSeq Set
    return newStores.filter(store => !existingStoreIds.has(store.storeSeq)); // 새로운 데이터 중복 제거
  };

  // 가게의 사진 데이터를 가져오는 함수
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
        return []; // 에러가 발생한 경우 빈 배열 반환
      });
  };

  // 카테고리별로 데이터를 가져오는 함수
  const fetchStores = (category, page) => {
    fetch(`${serverURL}/store/category/${category}?page=${page}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then(async (data) => {
        const updatedStores = await Promise.all(
          data.map(async (store) => {
            const photos = await fetchRestaurantPhotos(store.storeSeq);
            return { ...store, photos };
          })
        );

        // 기존 stores와 새로운 stores 간 중복 제거
        const uniqueStores = removeDuplicateStores(updatedStores, stores);

        // 새로운 stores만 추가
        setStores((prevStores) => {
          const combinedStores = [...prevStores, ...uniqueStores];
          return Array.from(new Set(combinedStores.map(store => store.storeSeq))) // storeSeq 기준으로 중복 제거
            .map(id => combinedStores.find(store => store.storeSeq === id)); // 중복되지 않은 storeSeq들로 store 리스트 갱신
        });
      })
      .catch((error) => console.error(`Error fetching ${category}:`, error));
  };

  useEffect(() => {
    fetchStores(category, page); // 컴포넌트가 로드되면 카테고리와 페이지를 기준으로 데이터를 가져옴
  }, [category, page]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1); // 페이지 번호 증가
  };

  // 가게 클릭 시 store 경로로 이동하는 함수
  const navigateToStoreDetail = (storeSeq) => {
    navigate(`/store/${storeSeq}`); // store 경로로 이동 (예: /store/17)
  };

  return (
    <div className="store-list-page">
      <h2>{category} 가게 리스트</h2>
      <div className="store-list">
        {stores.map((store) => (
          <article
            key={store.storeSeq} // storeSeq를 고유 key로 사용하여 중복 방지
            className="saved-restaurant-list-item"
            onClick={() => navigateToStoreDetail(store.storeSeq)}  // 클릭 시 /store/{storeSeq}로 이동
            style={{ padding: '0px 20px 20px', cursor: 'pointer' }} // 커서 포인터 스타일 추가
          >
            <div className="restaurant-info __a-center mb-0">
              <div className="tb __lg">
                <div
                  className="img"
                  style={{
                    backgroundImage: `url(${store.photos.length > 0 ? store.photos[0].imageUrl : 'defaultImageUrl.jpg'})`,
                    width: '100px',
                    height: '100px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    marginTop: '20px' // 이 부분을 camelCase로 수정
                  }}
                ></div>
              </div>
              <div className="detail">
                <div className="detail-header">
                  <h4 className="name __sm">{store.name}</h4> {/* 가게 이름 */}
                  <div className="txt">
                    <p className="__meta">{store.category}</p> {/* 카테고리 */}
                    <p className="__desc">{store.description}</p> {/* 가게 설명 */}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <button onClick={handleLoadMore}>더보기</button>
    </div>
  );
};

export default StoreList;
