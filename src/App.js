import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from 'react-router-dom'
import Header from 'components/Header/Header.jsx'
import Body from 'components/Body/Body.jsx'
import Footer from 'components/Footer/Footer.jsx'
import Login from 'pages/Login/Index.jsx'
import Alam from 'pages/Alampage/Alam.jsx'
import StoreDetail from 'pages/StoreDetail/StoreDetail.jsx'
import ConfirmReserveModal from 'pages/StoreDetail/ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveModal.jsx'
import Mypage from 'pages/Mypages/Mypage.jsx'
import FinalConfirmReserveModal from 'pages/StoreDetail/ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveButton/FinalConfirmReserveModal/FinalConfirmReserveModal.jsx'
import ReserveDetail from 'pages/StoreDetail/ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveButton/FinalConfirmReserveModal/FinalConfirmReserveButton/ReserveDetail/ReserveDetail.jsx'
import MyDining from 'pages/MyDining/MyDining.jsx'
import StoreManagementPage from 'pages/StoreManagementPage/StoreManagementPage.jsx'
import Header from './components/Header/Header.jsx'
import Body from './components/Body/Body.jsx'
import Footer from './components/Footer/Footer.jsx'
import Login from './components/pages/Login/Index.jsx'
import Alam from './components/pages/Alampage/Alam.jsx'
import StoreDetail from './components/pages/StoreDetail/StoreDetail.jsx'
import Mypage from './components/pages/Mypages/Mypage.jsx'
import ReserveDetail from './components/pages/StoreDetail/ReserveButton/ReserveModal/ConfirmReserveModal/ConfirmReserveButton/FinalConfirmReserveModal/FinalConfirmReserveButton/ReserveDetail/ReserveDetail.jsx'
import MyDining from './components/pages/MyDining/MyDining.jsx'

import StoreManagementPage from './components/pages/StoreManagementPage/StoreManagementPage.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css'
import StoreAddPage from 'pages/StoreAddPage/StoreAddPage.jsx'
import StoreList from 'pages/StoreList/StoreList.jsx' // 추가된 StoreList 컴포넌트
import StoreAddPage from './components/pages/StoreAddPage/StoreAddPage.jsx'
import Review from './components/pages/MyDining/Review/Review.jsx'

const AppContent = () => {
    const location = useLocation() // 현재 경로 확인

    const isStoreManagementPage = location.pathname === '/storemanagementpage' // StoreManagementPage 경로 확인 (작은 따음표기때문에 대소문자 구분 有)

    return (
        <div className="App">
            {/* StoreManagementPage가 아닐 때만 Header와 Footer를 렌더링 */}
            {!isStoreManagementPage && <Header />}
            <Routes>
                <Route path="/" element={<Body />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/store/:storeId" element={<StoreDetail />} />
                <Route path="/alarm" element={<Alam />} />
                <Route path="/confirmReserve" element={<ConfirmReserveModal />} />
                <Route path="/StoreManagementPage" element={<StoreManagementPage />} />
                <Route path="/finalconfirmReserve" element={<FinalConfirmReserveModal />} />
                <Route
                    path="/StoreManagementPage"
                    element={<StoreManagementPage />}
                />
                <Route path="/reserveDetail" element={<ReserveDetail />} />
                <Route path="/storeadd" element={<StoreAddPage />} />
                <Route path="/myDining" element={<MyDining />} />
                <Route path="/storeList/:category" element={<StoreList />} /> {/* 추가된 StoreList 경로 */}
                <Route path="/review" element={<Review />} />
            </Routes>
            {!isStoreManagementPage && <Footer />}
        </div>
    )
}

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    )
}

export default App
