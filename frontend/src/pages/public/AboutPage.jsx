import React from 'react';
import './AboutPage.css'; // Sẽ tạo file này ngay sau đây

const AboutPage = () => {
    return (
        <div className="about-page-container">
            <div className="about-content">
                <h1>Giới Thiệu Về Toy Store</h1>
                <p>
                    Chào mừng bạn đến với Toy Store! Chúng tôi tự hào là nơi mang đến những món đồ chơi chất lượng cao, an toàn và sáng tạo cho trẻ em ở mọi lứa tuổi. Sứ mệnh của chúng tôi là khơi dậy trí tưởng tượng, khuyến khích sự phát triển và tạo ra những khoảnh khắc vui vẻ cho mọi gia đình.
                </p>
                <p>
                    Được thành lập vào năm 2025, Toy Store khởi đầu từ niềm đam mê mang lại niềm vui cho trẻ thơ. Chúng tôi tin rằng mỗi món đồ chơi không chỉ là một vật giải trí mà còn là một công cụ học tập quý giá, giúp các bé phát triển các kỹ năng cần thiết cho tương lai.
                </p>
                <p>
                    Cảm ơn bạn đã tin tưởng và lựa chọn Toy Store. Hãy cùng chúng tôi xây dựng một tuổi thơ thật ý nghĩa cho các bé!
                </p>
            </div>
        </div>
    );
};

export default AboutPage;