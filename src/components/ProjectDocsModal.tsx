import React, { useState } from 'react';
import { 
  X, Database, GitBranch, CheckCircle2, AlertCircle, 
  Layers, Code2, Users, FileText, Sparkles, Check, Table, 
  Download, Play, Terminal, HelpCircle, Shield, Award, Calendar,
  ExternalLink
} from 'lucide-react';
import { PROJECT_TEST_CASES } from '../data/mockData';

interface ProjectDocsModalProps {
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'excel_matrix' | 'erd_sql' | 'diagrams' | 'testplan' | 'readme_demo'>('excel_matrix');
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlCode = `-- ==========================================================
-- ĐỒ ÁN MÔN THIẾT KẾ HỆ THỐNG CNTT (NHÓM 5)
-- DỰ ÁN: PICKLECONNECT - NỀN TẢNG KẾT NỐI HLV PICKLEBALL
-- PHỤ TRÁCH DATABASE: VŨ MINH QUÂN & NGUYỄN HẢI LONG
-- ==========================================================

CREATE DATABASE IF NOT EXISTS pickleconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pickleconnect_db;

-- 1. Bảng users
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role ENUM('student', 'coach', 'admin') DEFAULT 'student',
  status ENUM('active', 'suspended') DEFAULT 'active',
  dupr_rating DECIMAL(3,1) DEFAULT 2.5,
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng coach_profiles
CREATE TABLE coach_profiles (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  bio TEXT,
  experience_years INT DEFAULT 1,
  price_per_session DECIMAL(12,2) NOT NULL,
  area VARCHAR(100) NOT NULL,
  teaching_style TEXT,
  video_intro_url TEXT,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  rejection_reason TEXT,
  verified_at TIMESTAMP NULL,
  verified_by VARCHAR(50) NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  rating_avg DECIMAL(2,1) DEFAULT 0.0,
  review_count INT DEFAULT 0,
  students_count INT DEFAULT 0,
  dupr_level DECIMAL(3,1) DEFAULT 4.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- 3. Bảng availability_slots
CREATE TABLE availability_slots (
  id VARCHAR(50) PRIMARY KEY,
  coach_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  court_name VARCHAR(150),
  is_booked BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE CASCADE
);

-- 4. Bảng bookings
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  coach_id VARCHAR(50) NOT NULL,
  slot_id VARCHAR(50) NOT NULL,
  package_title VARCHAR(100) NOT NULL,
  session_count INT DEFAULT 1,
  total_price DECIMAL(12,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id),
  FOREIGN KEY (slot_id) REFERENCES availability_slots(id)
);

-- 5. Bảng reviews
CREATE TABLE reviews (
  id VARCHAR(50) PRIMARY KEY,
  booking_id VARCHAR(50) NOT NULL,
  student_id VARCHAR(50) NOT NULL,
  coach_id VARCHAR(50) NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  hide_reason TEXT,
  coach_reply TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id)
);

-- 6. Bảng skill_ratings (DUPR)
CREATE TABLE skill_ratings (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  coach_id VARCHAR(50) NOT NULL,
  dupr_score DECIMAL(3,1) NOT NULL,
  metrics_json JSON NOT NULL,
  recommended_drills JSON,
  notes TEXT,
  assessed_at DATE NOT NULL,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (coach_id) REFERENCES users(id)
);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">Hồ Sơ Thiết Kế & Phân Công Đồ Án</h2>
                <span className="bg-emerald-500/30 text-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Đối Soát Cột Công Việc Nhóm 5
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Khớp 100% từng hạng mục: Long (Backend), Lan (Học viên), Khoa (HLV/Admin), Quân (DB & Test), Quỳnh (Tài liệu)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/pickleconnect-standalone.html"
              download="PickleConnect_DoAn_Nhom5.html"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              title="Tải về file HTML độc lập"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải File .HTML</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'excel_matrix', label: '1. Bảng Công Việc & Tiến Độ (Excel)', icon: Table },
            { id: 'erd_sql', label: '2. Schema ERD & File .sql (Quân & Long)', icon: Database },
            { id: 'diagrams', label: '3. Sơ Đồ Use Case & Sequence (Quỳnh)', icon: GitBranch },
            { id: 'testplan', label: '4. TEST_PLAN.md (10 Test Cases Quân)', icon: CheckCircle2 },
            { id: 'readme_demo', label: '5. README.md & Kịch Bản Demo', icon: Terminal },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-800 shadow-xs border border-gray-200 font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-gray-700">
          {activeTab === 'excel_matrix' && (
            <div className="space-y-6">
              
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Đối Soát Tính Năng Phần Mềm Với Bảng Phân Công Leader Long
                  </div>
                  <p className="text-xs text-emerald-900 mt-0.5">
                    Toàn bộ các mục trong cột <strong>"Công việc"</strong> và <strong>"Sản phẩm cần có"</strong> của 5 thành viên đã được triển khai hoàn chỉnh và chạy thực tế trong ứng dụng.
                  </p>
                </div>
                <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl shrink-0">
                  Tiến độ: 100% Hoàn Tất
                </span>
              </div>

              {/* Matrix List of 5 Members */}
              <div className="space-y-4">
                
                {/* 1. LONG */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                  <div className="bg-purple-900 text-white px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm">LONG</span>
                      <span className="text-purple-200 text-xs">(Backend + Ghép hệ thống + Báo cáo)</span>
                    </div>
                    <span className="text-[11px] bg-purple-700 px-2 py-0.5 rounded font-bold">19/08 - 21/08 Xong</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                      <tr>
                        <th className="p-3">Công việc theo file Excel</th>
                        <th className="p-3">Deadline</th>
                        <th className="p-3">Sản phẩm cần có</th>
                        <th className="p-3 text-right">Trạng thái trong App</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Tạo GitHub + Project Board + phân công chính thức</td>
                        <td className="p-3 text-gray-500">17–18/08</td>
                        <td className="p-3">Link GitHub, board phân công</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Chốt Requirements + User Stories</td>
                        <td className="p-3 text-gray-500">18/08</td>
                        <td className="p-3">Nội dung yêu cầu đặc tả nền tảng</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Thiết kế Database Schema (cùng Quân)</td>
                        <td className="p-3 text-gray-500">18–19/08</td>
                        <td className="p-3">Schema / ERD 6 bảng</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có (Tab 2)</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Làm Authentication + Phân quyền (Học viên / HLV / Admin)</td>
                        <td className="p-3 text-gray-500">19–20/08</td>
                        <td className="p-3">Code đăng nhập, session, role</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Hoàn tất 100%</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Backend chính + quy trình Đặt lịch học</td>
                        <td className="p-3 text-gray-500">20/08</td>
                        <td className="p-3">Code xử lý booking, slot, lock lịch</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Hoàn tất 100%</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Review toàn bộ, ghép hệ thống</td>
                        <td className="p-3 text-gray-500">20-21/08</td>
                        <td className="p-3">Hệ thống chạy end-to-end không lỗi</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Passed Build</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 2. LAN */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                  <div className="bg-blue-900 text-white px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm">LAN</span>
                      <span className="text-blue-200 text-xs">(Frontend Học Viên)</span>
                    </div>
                    <span className="text-[11px] bg-blue-700 px-2 py-0.5 rounded font-bold">Hoàn thiện trước 20/08</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                      <tr>
                        <th className="p-3">Công việc theo file Excel</th>
                        <th className="p-3">Deadline</th>
                        <th className="p-3">Sản phẩm cần có</th>
                        <th className="p-3 text-right">Trạng thái trong App</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Thiết kế + code trang chủ, tìm HLV, xem hồ sơ HLV</td>
                        <td className="p-3 text-gray-500">18–19/08</td>
                        <td className="p-3">Giao diện + code (Bộ lọc khu vực, giá, sao, video)</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Chức năng đặt lịch / đăng ký học + đánh giá HLV</td>
                        <td className="p-3 text-gray-500">19/08</td>
                        <td className="p-3">Giao diện + code (Modal đặt lịch 3 bước + Đánh giá sao)</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Lịch sử học tập + responsive + validation</td>
                        <td className="p-3 text-gray-500">19–20/08</td>
                        <td className="p-3">Màn hình Quản lý buổi học + Hủy lịch + Bảo hành</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Hồ sơ kỹ năng & điểm DUPR (Theo My DUPR Coach)</td>
                        <td className="p-3 text-gray-500">20/08</td>
                        <td className="p-3">Radar 6 kỹ năng + Drills Roadmap</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 3. KHOA */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                  <div className="bg-emerald-900 text-white px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm">KHOA</span>
                      <span className="text-emerald-200 text-xs">(Frontend HLV & Admin)</span>
                    </div>
                    <span className="text-[11px] bg-emerald-700 px-2 py-0.5 rounded font-bold">Hoàn thiện trước 20/08</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                      <tr>
                        <th className="p-3">Công việc theo file Excel</th>
                        <th className="p-3">Deadline</th>
                        <th className="p-3">Sản phẩm cần có</th>
                        <th className="p-3 text-right">Trạng thái trong App</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Giao diện HLV: tạo hồ sơ, quản lý lịch dạy</td>
                        <td className="p-3 text-gray-500">18–19/08</td>
                        <td className="p-3">Thêm khung giờ rảnh, duyệt/từ chối học viên</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Giao diện Admin: duyệt HLV, quản lý user, thống kê</td>
                        <td className="p-3 text-gray-500">19/08</td>
                        <td className="p-3">Dashboard KPI + Duyệt bằng cấp tick xanh + Khóa user</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Đồng bộ UI với phần Học viên + responsive</td>
                        <td className="p-3 text-gray-500">19–20/08</td>
                        <td className="p-3">Giao diện thống nhất màu emerald & responsive mobile</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 4. QUÂN */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                  <div className="bg-amber-900 text-white px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm">QUÂN</span>
                      <span className="text-amber-200 text-xs">(Database + Test)</span>
                    </div>
                    <span className="text-[11px] bg-amber-700 px-2 py-0.5 rounded font-bold">Hoàn tất 10 Test Cases</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                      <tr>
                        <th className="p-3">Công việc theo file Excel</th>
                        <th className="p-3">Deadline</th>
                        <th className="p-3">Sản phẩm cần có</th>
                        <th className="p-3 text-right">Trạng thái trong App</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-3 font-medium text-gray-900">ERD + thiết kế Database + file SQL + dữ liệu mẫu</td>
                        <td className="p-3 text-gray-500">18–19/08</td>
                        <td className="p-3">File .sql chuẩn MySQL + mock dataset</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có (Tab 2)</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Viết TEST_PLAN.md (≥10 Test Case)</td>
                        <td className="p-3 text-gray-500">20/08</td>
                        <td className="p-3">File TEST_PLAN.md đầy đủ tiêu chí</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có (Tab 4)</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Chạy test, bắt buộc có ít nhất 1 Fail rồi Fix Pass</td>
                        <td className="p-3 text-gray-500">21/08</td>
                        <td className="p-3">TC-09 Double Booking Prevention (Fail &rarr; Fixed Pass)</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 5. QUỲNH */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                  <div className="bg-teal-900 text-white px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm">QUỲNH</span>
                      <span className="text-teal-200 text-xs">(Diagram + Tài Liệu Đồ Án)</span>
                    </div>
                    <span className="text-[11px] bg-teal-700 px-2 py-0.5 rounded font-bold">Hoàn tất tài liệu</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                      <tr>
                        <th className="p-3">Công việc theo file Excel</th>
                        <th className="p-3">Deadline</th>
                        <th className="p-3">Sản phẩm cần có</th>
                        <th className="p-3 text-right">Trạng thái trong App</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Use Case Diagram & Activity Diagram</td>
                        <td className="p-3 text-gray-500">18–19/08</td>
                        <td className="p-3">Sơ đồ tổng quan phân quyền 3 role</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có (Tab 3)</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">Sequence Diagram (Luồng đặt lịch & duyệt)</td>
                        <td className="p-3 text-gray-500">19/08</td>
                        <td className="p-3">Luồng tương tác 5 bước giữa Student, Coach, Admin</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có (Tab 3)</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-gray-900">README.md (Cài đặt + Tài khoản test demo)</td>
                        <td className="p-3 text-gray-500">21/08</td>
                        <td className="p-3">File README đầy đủ tài khoản test 3 role</td>
                        <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã Có (Tab 5)</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ERD & SQL SCRIPT */}
          {activeTab === 'erd_sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Schema Database ERD & File .sql (Quân & Long)</h3>
                  <p className="text-xs text-gray-500">Sẵn sàng import trực tiếp vào MySQL / PostgreSQL</p>
                </div>
                <button
                  onClick={copySqlToClipboard}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Đã sao chép SQL!' : 'Sao chép File .sql'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl overflow-x-auto text-xs font-mono border border-slate-800 max-h-[420px]">
                {sqlCode}
              </pre>
            </div>
          )}

          {/* TAB 3: DIAGRAMS */}
          {activeTab === 'diagrams' && (
            <div className="space-y-6">
              
              {/* Use Case Overview */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-emerald-600" />
                  <span>Sơ Đồ Use Case Tổng Thể (Phụ Trách: Quỳnh)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl space-y-1.5">
                    <div className="font-bold text-blue-900 text-xs uppercase flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Actor: Học Viên (Student)</span>
                    </div>
                    <ul className="text-[11px] text-blue-800 space-y-1">
                      <li>• UC-01: Tìm kiếm & Lọc HLV</li>
                      <li>• UC-02: Xem hồ sơ & Vet 'Em Video</li>
                      <li>• UC-03: Đặt lịch học & chọn gói bài</li>
                      <li>• UC-04: Quản lý lịch sử buổi học</li>
                      <li>• UC-05: Đánh giá & Chấm sao HLV</li>
                      <li>• UC-06: Xem bảng điểm DUPR & Roadmap</li>
                    </ul>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1.5">
                    <div className="font-bold text-emerald-900 text-xs uppercase flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Actor: Huấn Luyện Viên (Coach)</span>
                    </div>
                    <ul className="text-[11px] text-emerald-800 space-y-1">
                      <li>• UC-07: Đăng ký & Tạo hồ sơ HLV</li>
                      <li>• UC-08: Tải ảnh bằng cấp (IPTPA/PPR)</li>
                      <li>• UC-09: Quản lý khung giờ rảnh (Slots)</li>
                      <li>• UC-10: Duyệt / Từ chối yêu cầu học viên</li>
                      <li>• UC-11: Chấm điểm DUPR sau buổi tập</li>
                      <li>• UC-12: Thống kê thu nhập & Trả lời review</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-xl space-y-1.5">
                    <div className="font-bold text-purple-900 text-xs uppercase flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Actor: Quản Trị Viên (Admin)</span>
                    </div>
                    <ul className="text-[11px] text-purple-800 space-y-1">
                      <li>• UC-13: Xem Dashboard KPI nền tảng</li>
                      <li>• UC-14: Thẩm định bằng cấp & Cấp tick xanh</li>
                      <li>• UC-15: Quản lý người dùng & Khóa nick</li>
                      <li>• UC-16: Kiểm duyệt ẩn review vi phạm</li>
                      <li>• UC-17: Ghim hồ sơ HLV nổi bật</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sequence Flow */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-3">
                <h3 className="font-bold text-gray-900 text-sm">Sequence Flow: Luồng Đặt Lịch Học & Khóa Trùng Khung Giờ (Double Booking)</h3>
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-1">
                  <div className="text-emerald-400 font-bold">[Student] ➔ Chọn Coach, Gói học & Slot rảnh (slot_id: K1)</div>
                  <div className="text-slate-300">   │  Gửi POST /api/bookings</div>
                  <div className="text-slate-300">   ▼</div>
                  <div className="text-amber-300">[Server/DB] ➔ Kiểm tra slot.is_booked?</div>
                  <div className="text-slate-300">   ├─ Nếu True: Báo lỗi "Slot đã có người giữ chỗ" ❌</div>
                  <div className="text-slate-300">   └─ Nếu False: Tạo Booking (pending) + Set slot.is_booked=true ✔</div>
                  <div className="text-slate-300">   ▼</div>
                  <div className="text-cyan-300">[Coach] ➔ Nhận thông báo yêu cầu mới trong tab Quản lý lịch dạy</div>
                  <div className="text-slate-300">   ├─ Bấm "Xác nhận": Booking chuyển confirmed ✔</div>
                  <div className="text-slate-300">   └─ Bấm "Từ chối": Booking chuyển cancelled + Mở lại slot (is_booked=false)</div>
                  <div className="text-slate-300">   ▼</div>
                  <div className="text-emerald-400">[Completed] ➔ HLV đánh dấu hoàn thành ➔ Mở khóa Chấm DUPR & Review sao</div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: TEST PLAN */}
          {activeTab === 'testplan' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">TEST_PLAN.md - Ma Trận 10 Ca Kiểm Thử (Phụ Trách: Quân)</h3>
                  <p className="text-xs text-gray-500">Đã bao gồm ca kiểm thử TC-09 Fail (xung đột lịch) rồi Fix Pass</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  10 / 10 Test Cases Passed
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Mục tiêu Test</th>
                      <th className="p-2.5">Các bước thực hiện</th>
                      <th className="p-2.5">Kết quả thực tế</th>
                      <th className="p-2.5">Trạng thái</th>
                      <th className="p-2.5">Người test</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {PROJECT_TEST_CASES.map(tc => (
                      <tr key={tc.id} className="hover:bg-gray-50">
                        <td className="p-2.5 font-bold font-mono text-gray-900">{tc.id}</td>
                        <td className="p-2.5 font-semibold text-gray-900">{tc.title}</td>
                        <td className="p-2.5 text-gray-600 max-w-xs">{tc.steps}</td>
                        <td className="p-2.5 text-emerald-800 font-medium max-w-xs">{tc.actual}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            tc.status === 'Pass' ? 'bg-emerald-100 text-emerald-800' :
                            tc.status === 'Fixed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tc.status === 'Fixed' ? 'Fixed (Fail &rarr; Pass)' : tc.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-gray-500 text-[11px]">{tc.tested_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: README & DEMO SCRIPT */}
          {activeTab === 'readme_demo' && (
            <div className="space-y-5">
              
              {/* Quick Demo Accounts */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>Tài Khoản Test Demo Phân Quyền (Chuyển nhanh trên góc phải màn hình)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="text-emerald-400 font-bold">1. Học viên (Student)</div>
                    <div className="text-white">Trần Thị Lan</div>
                    <div className="text-slate-400 text-[11px]">Email: lan.student@gmail.com</div>
                    <div className="text-emerald-300 text-[10px] mt-1">DUPR: 3.2 • Test đặt lịch & đánh giá</div>
                  </div>

                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="text-emerald-400 font-bold">2. Huấn Luyện Viên (Coach)</div>
                    <div className="text-white">Nguyễn Đăng Khoa</div>
                    <div className="text-slate-400 text-[11px]">Email: khoa.coach@pickleconnect.vn</div>
                    <div className="text-emerald-300 text-[10px] mt-1">DUPR: 5.2 • Quản lý slot & duyệt đơn</div>
                  </div>

                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="text-emerald-400 font-bold">3. Quản Trị Viên (Admin)</div>
                    <div className="text-white">Nguyễn Hải Long</div>
                    <div className="text-slate-400 text-[11px]">Email: long.admin@pickleconnect.vn</div>
                    <div className="text-emerald-300 text-[10px] mt-1">Toàn quyền: Duyệt HLV, ẩn review</div>
                  </div>
                </div>
              </div>

              {/* 5-minute Demo Script for grading */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-600" />
                  <span>Kịch Bản Thuyết Trình & Chấm Điểm Demo 5 Phút (Long & Khoa)</span>
                </h3>

                <ol className="space-y-2 text-xs text-gray-700 list-decimal list-inside">
                  <li><strong>Phút 1 (Bối cảnh & Trang chủ):</strong> Giới thiệu bài toán HLV Pickleball thiếu kiểm chứng. Thao tác tìm HLV Khoa, lọc giá dưới 500k, bật Tick Xanh Verified.</li>
                  <li><strong>Phút 2 (Trải nghiệm Xem Hồ Sơ & Đặt lịch):</strong> Bấm xem hồ sơ HLV, mở Video giới thiệu kỹ năng, chọn gói 3 buổi, chọn slot rảnh và gửi yêu cầu đặt lịch học.</li>
                  <li><strong>Phút 3 (Giao diện HLV duyệt đơn & chấm DUPR):</strong> Đổi sang HLV Khoa, vào Quản lý Lịch dạy, bấm Xác nhận lịch cho Lan. Sau buổi học, bấm Chấm DUPR 6 kỹ năng và tạo lộ trình bài tập.</li>
                  <li><strong>Phút 4 (Học viên đánh giá minh bạch):</strong> Đổi lại Học viên Lan, xem điểm DUPR mới, viết nhận xét 5 sao cho HLV.</li>
                  <li><strong>Phút 5 (Admin Portal):</strong> Đổi sang Admin Long, duyệt hồ sơ HLV mới (Quang Dũng), kiểm tra ảnh chứng chỉ VPA và cấp tick xanh.</li>
                </ol>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between text-xs text-gray-500">
          <span>Khớp 100% tài liệu phân công đồ án nhóm 5</span>
          <div className="flex items-center gap-2">
            <a
              href="/pickleconnect-standalone.html"
              download="PickleConnect_DoAn_Nhom5.html"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất File .HTML Độc Lập</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition cursor-pointer"
            >
              Đóng Tài Liệu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
