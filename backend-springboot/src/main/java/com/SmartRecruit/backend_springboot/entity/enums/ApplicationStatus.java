package com.SmartRecruit.backend_springboot.entity.enums;

public enum ApplicationStatus {
    APPLIED,      // Vừa nộp đơn
    SCREENING,    // Đang lọc hồ sơ
    INTERVIEWING, // Đang phỏng vấn
    OFFERED,      // Đã gửi lời mời làm việc
    REJECTED,     // Từ chối
    HIRED         // Đã tuyển thành công
}
