import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Briefcase, ExternalLink, MapPin, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import vietnamMapSvgRaw from '../../assets/vietnam-map.svg?raw';
import Button from '../ui/Button';
import './VietnamJobsMap.css';

const provinceData = [
  { id: 'lao-cai', name: 'Lào Cai', region: 'Miền Bắc', x: 35, y: 9, jobCount: 780, svgIds: ['VN-02', 'VN-06'], roles: ['Giúp việc homestay', 'Chăm bé theo ca', 'Dọn nhà phố'] },
  { id: 'cao-bang', name: 'Cao Bằng', region: 'Miền Bắc', x: 63, y: 7, jobCount: 220, svgIds: ['VN-04'], roles: ['Giúp việc gia đình', 'Chăm người cao tuổi', 'Phụ bếp quán ăn'] },
  { id: 'lang-son', name: 'Lạng Sơn', region: 'Miền Bắc', x: 67, y: 11, jobCount: 310, svgIds: ['VN-09'], roles: ['Giúp việc ở lại', 'Dọn nhà cuối tuần', 'Chăm bé theo giờ'] },
  { id: 'quang-ninh', name: 'Quảng Ninh', region: 'Miền Bắc', x: 72, y: 15, jobCount: 970, svgIds: ['VN-13'], roles: ['Tạp vụ khách sạn', 'Giúp việc biệt thự', 'Chăm người bệnh'] },
  { id: 'tuyen-quang', name: 'Tuyên Quang', region: 'Miền Bắc', x: 44, y: 12, jobCount: 690, svgIds: ['VN-07', 'VN-03'], roles: ['Giúp việc gia đình', 'Chăm ông bà', 'Nấu ăn theo buổi'] },
  { id: 'thai-nguyen', name: 'Thái Nguyên', region: 'Miền Bắc', x: 56, y: 16, jobCount: 1080, svgIds: ['VN-69', 'VN-53'], roles: ['Giúp việc theo giờ', 'Tạp vụ nhà máy', 'Giữ trẻ sau giờ học'] },
  { id: 'phu-tho', name: 'Phú Thọ', region: 'Miền Bắc', x: 42, y: 20, jobCount: 1530, svgIds: ['VN-68', 'VN-70', 'VN-14'], roles: ['Giúp việc gia đình', 'Nấu ăn gia đình', 'Chăm bé ban ngày'] },
  { id: 'bac-ninh', name: 'Bắc Ninh', region: 'Miền Bắc', x: 60, y: 20, jobCount: 1880, svgIds: ['VN-56', 'VN-54'], roles: ['Tạp vụ văn phòng', 'Giúp việc căn hộ', 'Trông trẻ theo ca'] },
  { id: 'hanoi', name: 'Hà Nội', region: 'Miền Bắc', x: 50, y: 15, jobCount: 3240, svgIds: ['VN-HN'], roles: ['Giúp việc theo giờ', 'Tạp vụ văn phòng', 'Chăm bé ban ngày'] },
  { id: 'hung-yen', name: 'Hưng Yên', region: 'Miền Bắc', x: 61, y: 25, jobCount: 1460, svgIds: ['VN-66', 'VN-20'], roles: ['Giúp việc nhà riêng', 'Chăm em bé sơ sinh', 'Dọn nhà theo tuần'] },
  { id: 'hai-phong', name: 'Hải Phòng', region: 'Miền Bắc', x: 69, y: 22, jobCount: 1740, svgIds: ['VN-HP', 'VN-61'], roles: ['Giúp việc nhà phố', 'Phụ việc quán ăn', 'Tạp vụ khách sạn'] },
  { id: 'dien-bien', name: 'Điện Biên', region: 'Miền Bắc', x: 15, y: 18, jobCount: 200, svgIds: ['VN-71'], roles: ['Giúp việc theo ngày', 'Phụ quán ăn', 'Chăm trẻ cuối tuần'] },
  { id: 'lai-chau', name: 'Lai Châu', region: 'Miền Bắc', x: 24, y: 13, jobCount: 180, svgIds: ['VN-01'], roles: ['Giúp việc ở lại', 'Chăm người già', 'Dọn dẹp cửa hàng'] },
  { id: 'son-la', name: 'Sơn La', region: 'Miền Bắc', x: 26, y: 23, jobCount: 360, svgIds: ['VN-05'], roles: ['Giúp việc nhà vườn', 'Chăm người lớn tuổi', 'Dọn căn hộ'] },
  { id: 'ninh-binh', name: 'Ninh Bình', region: 'Miền Bắc', x: 56, y: 31, jobCount: 1850, svgIds: ['VN-18', 'VN-63', 'VN-67'], roles: ['Tạp vụ resort', 'Giúp việc nhà dân', 'Chăm người già'] },
  { id: 'thanh-hoa', name: 'Thanh Hóa', region: 'Bắc Trung Bộ', x: 56, y: 37, jobCount: 1420, svgIds: ['VN-21'], roles: ['Giúp việc theo giờ', 'Chăm người bệnh', 'Nấu ăn gia đình'] },
  { id: 'nghe-an', name: 'Nghệ An', region: 'Bắc Trung Bộ', x: 59, y: 45, jobCount: 1310, svgIds: ['VN-22'], roles: ['Giúp việc ở lại', 'Dọn nhà cuối tuần', 'Chăm trẻ nhỏ'] },
  { id: 'ha-tinh', name: 'Hà Tĩnh', region: 'Bắc Trung Bộ', x: 60, y: 52, jobCount: 620, svgIds: ['VN-23'], roles: ['Giúp việc nhà phố', 'Chăm người lớn tuổi', 'Phụ bếp'] },
  { id: 'quang-tri', name: 'Quảng Trị', region: 'Miền Trung', x: 61, y: 59, jobCount: 880, svgIds: ['VN-24', 'VN-25'], roles: ['Giúp việc gia đình', 'Tạp vụ cửa hàng', 'Chăm em bé'] },
  { id: 'hue', name: 'Huế', region: 'Miền Trung', x: 63, y: 66, jobCount: 970, svgIds: ['VN-26'], roles: ['Giúp việc nhà vườn', 'Chăm người bệnh', 'Dọn homestay'] },
  { id: 'da-nang', name: 'Đà Nẵng', region: 'Miền Trung', x: 64, y: 72, jobCount: 2210, svgIds: ['VN-DN', 'VN-27'], roles: ['Tạp vụ khách sạn', 'Giúp việc căn hộ', 'Chăm bé theo giờ'] },
  { id: 'quang-ngai', name: 'Quảng Ngãi', region: 'Miền Trung', x: 60, y: 77, jobCount: 990, svgIds: ['VN-28', 'VN-29'], roles: ['Giúp việc gia đình', 'Dọn nhà nghỉ', 'Phụ việc quán cơm'] },
  { id: 'gia-lai', name: 'Gia Lai', region: 'Tây Nguyên', x: 54, y: 79, jobCount: 1610, svgIds: ['VN-30', 'VN-31'], roles: ['Giúp việc nhà phố', 'Chăm người già', 'Nấu ăn buổi tối'] },
  { id: 'dak-lak', name: 'Đắk Lắk', region: 'Tây Nguyên', x: 54, y: 86, jobCount: 1650, svgIds: ['VN-33', 'VN-32'], roles: ['Giúp việc theo giờ', 'Chăm bé', 'Dọn dẹp cửa hàng'] },
  { id: 'khanh-hoa', name: 'Khánh Hòa', region: 'Nam Trung Bộ', x: 66, y: 83, jobCount: 1680, svgIds: ['VN-34', 'VN-36'], roles: ['Tạp vụ khách sạn', 'Giúp việc biệt thự', 'Chăm người bệnh'] },
  { id: 'lam-dong', name: 'Lâm Đồng', region: 'Tây Nguyên', x: 58, y: 90, jobCount: 2030, svgIds: ['VN-35', 'VN-40', 'VN-72'], roles: ['Giúp việc villa', 'Chăm trẻ theo buổi', 'Dọn homestay'] },
  { id: 'dong-nai', name: 'Đồng Nai', region: 'Đông Nam Bộ', x: 66, y: 95, jobCount: 2410, svgIds: ['VN-39', 'VN-58'], roles: ['Tạp vụ khu công nghiệp', 'Giúp việc nhà riêng', 'Chăm bé theo ca'] },
  { id: 'tay-ninh', name: 'Tây Ninh', region: 'Đông Nam Bộ', x: 57, y: 97, jobCount: 1540, svgIds: ['VN-37', 'VN-41'], roles: ['Giúp việc nhà phố', 'Chăm người lớn tuổi', 'Phụ bếp'] },
  { id: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', region: 'Đông Nam Bộ', x: 68, y: 98, jobCount: 6520, svgIds: ['VN-SG', 'VN-43', 'VN-57'], roles: ['Giúp việc theo giờ', 'Tạp vụ văn phòng', 'Chăm bé sơ sinh'] },
  { id: 'dong-thap', name: 'Đồng Tháp', region: 'Đồng bằng sông Cửu Long', x: 56, y: 100, jobCount: 1480, svgIds: ['VN-45', 'VN-46'], roles: ['Giúp việc nhà dân', 'Nấu ăn gia đình', 'Chăm ông bà'] },
  { id: 'an-giang', name: 'An Giang', region: 'Đồng bằng sông Cửu Long', x: 47, y: 103, jobCount: 1680, svgIds: ['VN-44', 'VN-47'], roles: ['Giúp việc theo ngày', 'Chăm bé', 'Dọn dẹp cửa hàng'] },
  { id: 'can-tho', name: 'Cần Thơ', region: 'Đồng bằng sông Cửu Long', x: 61, y: 103, jobCount: 1870, svgIds: ['VN-CT', 'VN-52', 'VN-73'], roles: ['Giúp việc nhà phố', 'Tạp vụ spa', 'Chăm người bệnh'] },
  { id: 'vinh-long', name: 'Vĩnh Long', region: 'Đồng bằng sông Cửu Long', x: 66, y: 104, jobCount: 1560, svgIds: ['VN-49', 'VN-50', 'VN-51'], roles: ['Giúp việc gia đình', 'Phụ quán ăn', 'Chăm bé ban ngày'] },
  { id: 'ca-mau', name: 'Cà Mau', region: 'Đồng bằng sông Cửu Long', x: 61, y: 109, jobCount: 1100, svgIds: ['VN-59', 'VN-55'], roles: ['Giúp việc nhà dân', 'Chăm người già', 'Dọn nhà cuối tuần'] },
];

const provinceIdBySvgId = provinceData.reduce((accumulator, province) => {
  province.svgIds.forEach((svgId) => {
    accumulator[svgId] = province.id;
  });
  return accumulator;
}, {});

const initialProvinceId = 'ho-chi-minh';

const buildSvgMarkup = (activeProvinceId) => {
  const activeProvince = provinceData.find((province) => province.id === activeProvinceId);
  const activeSet = new Set(activeProvince?.svgIds || []);

  return vietnamMapSvgRaw
    .replace(/<\?xml[\s\S]*?\?>/, '')
    .replace(/<!--[\s\S]*?-->/, '')
    .replace(
      /<svg\b/,
      '<svg class="vietnam-real-map" role="img" aria-label="Bản đồ Việt Nam theo tỉnh thành" viewBox="0 0 381.07504 800.61719" preserveAspectRatio="xMidYMid meet"'
    )
    .replace(/\swidth="[^"]+"/, '')
    .replace(/\sheight="[^"]+"/, '')
    .replace(/id="([^"]+)"\s*\/>/g, (match, svgId) => {
      const provinceId = provinceIdBySvgId[svgId];
      const classes = ['mapsvg-region'];

      if (provinceId) {
        classes.push('is-interactive');
      }

      if (activeSet.has(svgId)) {
        classes.push('active');
      }

      const replacement = [
        `id="${svgId}"`,
        `class="${classes.join(' ')}"`,
        provinceId ? `data-province-id="${provinceId}"` : '',
      ]
        .filter(Boolean)
        .join(' ');

      return match.replace(`id="${svgId}"`, replacement);
    });
};

const getDefaultCalloutPlacement = () => ({
  className: 'province-callout is-right',
  style: {
    left: '26%',
    top: '48%',
  },
});

const VietnamJobsMap = () => {
  const [activeProvinceId, setActiveProvinceId] = useState(initialProvinceId);
  const [calloutPlacement, setCalloutPlacement] = useState(getDefaultCalloutPlacement);
  const mapWrapRef = useRef(null);
  const sectionRef = useRef(null);

  const activeProvince = useMemo(
    () => provinceData.find((province) => province.id === activeProvinceId) || provinceData[0],
    [activeProvinceId]
  );

  const facebookUrl = useMemo(
    () => `https://www.facebook.com/search/top?q=${encodeURIComponent(`việc làm ${activeProvince.name}`)}`,
    [activeProvince.name]
  );

  const mapMarkup = useMemo(
    () => buildSvgMarkup(activeProvinceId),
    [activeProvinceId]
  );

  useEffect(() => {
    const wrap = mapWrapRef.current;
    if (!wrap) {
      return;
    }

    const svg = wrap.querySelector('svg');
    const activeRegions = [...wrap.querySelectorAll('.mapsvg-region.active')];
    if (!svg || activeRegions.length === 0) {
      setCalloutPlacement(getDefaultCalloutPlacement());
      return;
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    activeRegions.forEach((region) => {
      const box = region.getBBox();
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    });

    const viewBox = svg.viewBox.baseVal;
    const anchorX = ((minX + maxX) / 2 / viewBox.width) * 100;
    const anchorY = ((minY + maxY) / 2 / viewBox.height) * 100;

    const placeLeft = anchorX > 58;
    const horizontalOffset = 18;
    const left = placeLeft
      ? Math.max(anchorX - horizontalOffset, 16)
      : Math.min(anchorX + horizontalOffset, 84);
    const top = Math.min(Math.max(anchorY, 12), 88);

    setCalloutPlacement({
      className: `province-callout ${placeLeft ? 'is-left' : 'is-right'}`,
      style: {
        left: `${left}%`,
        top: `${top}%`,
      },
    });
  }, [activeProvinceId]);

  const handleMapHover = (event) => {
    const provinceId = event.target?.getAttribute?.('data-province-id');
    if (provinceId && provinceId !== activeProvinceId) {
      setActiveProvinceId(provinceId);
    }
  };

  const handleProvinceChipClick = (provinceId) => {
    setActiveProvinceId(provinceId);
    sectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <section ref={sectionRef} className="vietnam-map-section">
      <div className="container vietnam-map-shell">
        <div className="vietnam-map-copy">
          <span className="vietnam-map-kicker">Bản đồ việc làm theo khu vực</span>
          <h2 className="vietnam-map-title">Khám phá nhu cầu tuyển dụng trên toàn Việt Nam</h2>
          <p className="vietnam-map-subtitle">
            Rê chuột trực tiếp vào từng vùng trên bản đồ để làm nổi bật tỉnh, thành sau sáp nhập và
            xem nhanh nhu cầu tuyển dụng theo từng khu vực.
          </p>
        </div>

        <div className="vietnam-map-layout">
          <div className="vietnam-map-canvas">
            <div className="vietnam-map-grid" />
            <div
              className="vietnam-map-svg-wrap"
              ref={mapWrapRef}
              aria-hidden="true"
              onMouseOver={handleMapHover}
              dangerouslySetInnerHTML={{ __html: mapMarkup }}
            />
            <div className={calloutPlacement.className} style={calloutPlacement.style}>
              <span>{activeProvince.name}</span>
            </div>
          </div>

          <div className="vietnam-map-panel">
            <div className="province-panel-header">
              <div>
                <span className="province-panel-region">{activeProvince.region}</span>
                <h3>{activeProvince.name}</h3>
              </div>
              <div className="province-panel-pill">
                <Briefcase size={16} />
                {activeProvince.jobCount.toLocaleString('vi-VN')} việc
              </div>
            </div>

            <div className="province-panel-block">
              <div className="province-panel-block-title">
                <MapPin size={16} />
                Khu vực đang tuyển mạnh
              </div>
              <ul className="province-role-list">
                {activeProvince.roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </div>

            <div className="province-panel-block">
              <div className="province-panel-block-title">
                <Newspaper size={16} />
                Kênh cộng đồng
              </div>
              <p className="province-panel-note">
                Mở nhanh trang Facebook đang có bài đăng tuyển dụng theo từ khóa của tỉnh, thành này.
              </p>
            </div>

            <div className="province-panel-actions">
              <Link to="/tim-viec" className="province-panel-link">
                <Button variant="primary" fullWidth>
                  Xem việc tại {activeProvince.name} <ArrowRight size={16} />
                </Button>
              </Link>
              <a href={facebookUrl} target="_blank" rel="noreferrer" className="province-panel-link">
                <Button variant="outline" fullWidth>
                  Facebook khu vực <ExternalLink size={16} />
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="province-chip-list">
          {provinceData.map((province) => (
            <button
              key={province.id}
              type="button"
              className={`province-chip ${province.id === activeProvince.id ? 'active' : ''}`}
              onClick={() => handleProvinceChipClick(province.id)}
              onMouseEnter={() => setActiveProvinceId(province.id)}
              onFocus={() => setActiveProvinceId(province.id)}
            >
              {province.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VietnamJobsMap;
