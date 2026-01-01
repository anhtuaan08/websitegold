// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for menu links
    document.querySelectorAll('.menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active menu item
            document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll to section
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            const offset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Update active menu on scroll
    window.addEventListener('scroll', updateActiveMenu);
    
    // Animate user count
    animateUserCount();
    
    // Add touch support for buttons
    document.querySelectorAll('button, .dns-option, .contact-card').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        el.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
});

// ===== ANIMATE USER COUNT =====
function animateUserCount() {
    const userCountElement = document.getElementById('userCount');
    let count = 0;
    const target = 12547;
    const duration = 2000;
    const increment = target / (duration / 30);
    
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        userCountElement.textContent = Math.floor(count).toLocaleString() + '+';
    }, 30);
}

// ===== UPDATE ACTIVE MENU =====
function updateActiveMenu() {
    const sections = document.querySelectorAll('.card');
    const menuItems = document.querySelectorAll('.menu a');
    const scrollPosition = window.scrollY + 100;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.id;
        }
    });
    
    if (currentSection) {
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === currentSection) {
                item.classList.add('active');
            }
        });
    }
}

// ===== COPY LINK FUNCTION =====
function copyLink(inputId) {
    const input = document.getElementById(inputId);
    const button = event.currentTarget;
    const spinner = button.querySelector('.spinner');
    const icon = button.querySelector('i');
    const text = button.querySelector('span');
    
    // Show loading
    icon.style.display = 'none';
    spinner.style.display = 'block';
    text.textContent = 'ĐANG SAO CHÉP...';
    button.disabled = true;
    
    // Select text
    input.select();
    input.setSelectionRange(0, 99999);
    
    // Copy to clipboard
    setTimeout(() => {
        navigator.clipboard.writeText(input.value).then(() => {
            // Show success notification
            showNotification('Đã sao chép link thành công! ✨', 'success');
            
            // Update button state
            icon.className = 'fas fa-check';
            icon.style.display = 'block';
            spinner.style.display = 'none';
            text.textContent = 'ĐÃ COPY!';
            button.style.background = 'linear-gradient(135deg, #00C9A7, #00A88B)';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                icon.className = 'fas fa-copy';
                text.textContent = 'SAO CHÉP LINK';
                button.style.background = 'var(--gradient-primary)';
                button.disabled = false;
            }, 2000);
            
        }).catch(err => {
            // Show error notification
            showNotification('Không thể sao chép. Vui lòng thử lại.', 'error');
            
            // Reset button
            icon.style.display = 'block';
            spinner.style.display = 'none';
            text.textContent = 'SAO CHÉP LINK';
            button.disabled = false;
        });
    }, 300);
}

// ===== SHOW NOTIFICATION TOAST =====
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('i');
    const title = notification.querySelector('.notification-title');
    const msg = notification.querySelector('.notification-message');
    
    // Set notification content
    title.textContent = type === 'success' ? 'Thành công!' : 'Có lỗi!';
    msg.textContent = message;
    
    // Set icon and color
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        notification.style.borderLeftColor = 'var(--success)';
        icon.style.color = 'var(--success)';
        notification.classList.remove('error');
    } else {
        icon.className = 'fas fa-exclamation-circle';
        notification.style.borderLeftColor = 'var(--danger)';
        icon.style.color = 'var(--danger)';
        notification.classList.add('error');
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== HIDE NOTIFICATION =====
function hideNotification() {
    document.getElementById('notification').classList.remove('show');
}

// ===== DOWNLOAD DNS FILE =====
function downloadDNS(type) {
    const dnsConfigs = {
        basic: `# Locket Hub - DNS Cơ Bản
# Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}

# DNS chính:
8.8.8.8
8.8.4.4

# DNS phụ:
1.1.1.1
1.0.0.1`,

        advanced: `# Locket Hub - DNS Nâng Cao
# Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}

# DNS tốc độ cao:
185.228.168.168
185.228.169.168

# DNS dự phòng:
76.76.19.19
76.223.122.150`
    };
    
    const config = dnsConfigs[type];
    const filename = `locket-hub-dns-${type}.txt`;
    
    // Create download link
    const element = document.createElement('a');
    const file = new Blob([config], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    
    // Trigger download
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Show notification
    showNotification(`Đã tải DNS ${type} thành công! 📁`, 'success');
}

// ===== DOWNLOAD ALL DNS =====
function downloadAllDNS() {
    const allDNS = `# Locket Hub - Tất cả cấu hình DNS
# Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}

======================
1. DNS CƠ BẢN
======================
8.8.8.8
8.8.4.4
1.1.1.1
1.0.0.1

======================
2. DNS NÂNG CAO
======================
185.228.168.168
185.228.169.168
76.76.19.19
76.223.122.150

======================
3. HƯỚNG DẪN SỬ DỤNG
======================
1. Chọn 1 bộ DNS phù hợp
2. Thay đổi DNS trong cài đặt mạng
3. Khởi động lại ứng dụng
4. Kiểm tra kết nối`;
    
    const element = document.createElement('a');
    const file = new Blob([allDNS], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = 'locket-hub-all-dns-config.txt';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showNotification('Đã tải tất cả DNS thành công! 📚', 'success');
}

// ===== PLAY VIDEO TUTORIAL =====
function playVideo() {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    
    // Use YouTube tutorial video (replace with your actual video)
    const videoUrl = 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&rel=0';
    
    videoFrame.src = videoUrl;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ===== CLOSE VIDEO MODAL =====
function closeVideo() {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    
    videoFrame.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// ===== SCROLL TO CONTACT SECTION =====
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    const offset = 80;
    const elementPosition = contactSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
    
    // Highlight contact section
    contactSection.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.3)';
    setTimeout(() => {
        contactSection.style.boxShadow = '';
    }, 3000);
    
    // Update active menu
    document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
    document.querySelector('a[href="#contact"]').classList.add('active');
}

// ===== CONTACT VIA SPECIFIC CHANNEL =====
function contactVia(channel) {
    let url, message;
    
    switch(channel) {
        case 'telegram':
            url = 'https://t.me/anhtuaan08';
            message = 'Xin chào, tôi muốn mua Locket locket Pro với giá 70.000đ. Vui lòng tư vấn giúp tôi.';
            window.open(`${url}?text=${encodeURIComponent(message)}`, '_blank');
            break;
            
        case 'zalo':
            url = 'https://zalo.me/0898376962';
            window.open(url, '_blank');
            break;
            
        case 'phone':
            window.location.href = 'tel:0335980310';
            break;
            
        case 'email':
            url = 'mailto:tranvananhtuan08@gmail.com?subject=Yêu cầu mua Locket gold Pro&body=Xin chào, tôi muốn mua Locket gold Pro với giá 70.000đ. Vui lòng tư vấn giúp tôi.';
            window.location.href = url;
            break;
    }
    
    showNotification(`Đang mở ${channel.toUpperCase()}...`, 'success');
    
    // Track conversion
    console.log(`User contacted via ${channel} for premium purchase`);
    
    // Show confirmation modal after 1 second
    setTimeout(() => {
        Swal.fire({
            title: '📞 Đang kết nối...',
            html: `
                <div style="text-align: center; padding: 1rem;">
                    <div style="font-size: 4rem; color: #6C63FF; margin-bottom: 1rem;">
                        <i class="fas fa-comments"></i>
                    </div>
                    <h3 style="margin-bottom: 1rem; color: #333;">Đang kết nối với hỗ trợ viên</h3>
                    <p style="color: #666; margin-bottom: 1.5rem;">
                        Vui lòng chờ trong giây lát...
                    </p>
                    <div class="spinner" style="margin: 0 auto; width: 3rem; height: 3rem;"></div>
                </div>
            `,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Đóng',
            width: 400,
            backdrop: 'rgba(0,0,0,0.5)'
        });
    }, 1000);
}

// ===== TOGGLE FAQ =====
function toggleFAQ(id) {
    const faqItem = event.currentTarget.closest('.faq-item');
    const answer = document.getElementById(`faq-answer-${id}`);
    const icon = faqItem.querySelector('.faq-question i');
    
    // Close other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            item.querySelector('.faq-question i').className = 'fas fa-chevron-down';
        }
    });
    
    // Toggle current FAQ
    faqItem.classList.toggle('active');
    
    if (faqItem.classList.contains('active')) {
        icon.className = 'fas fa-chevron-up';
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
        icon.className = 'fas fa-chevron-down';
        if (answer) answer.style.maxHeight = '0';
    }
}

// ===== HANDLE BACK BUTTON ON MOBILE =====
window.addEventListener('popstate', function() {
    const modal = document.getElementById('videoModal');
    if (modal.style.display === 'flex') {
        closeVideo();
        history.pushState(null, null, window.location.pathname);
    }
});

// ===== PREVENT ACCIDENTAL REFRESH DURING VIDEO PLAYBACK =====
window.addEventListener('beforeunload', function(e) {
    const modal = document.getElementById('videoModal');
    if (modal.style.display === 'flex') {
        e.preventDefault();
        e.returnValue = 'Bạn có chắc muốn rời đi? Video đang được phát.';
    }
});

// ===== ADD CUSTOM STYLES FOR SWEETALERT2 =====
(function() {
    const style = document.createElement('style');
    style.textContent = `
        .swal2-popup {
            border-radius: 1rem !important;
        }
        
        @media (max-width: 400px) {
            .swal2-popup {
                width: 95% !important;
                margin: 0 auto !important;
            }
        }
        
        .swal2-confirm {
            font-weight: 700 !important;
        }
        
        .spinner {
            width: 1.5rem;
            height: 1.5rem;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
})();

// ===== AUTO-SHOW WELCOME MESSAGE =====
setTimeout(() => {
    if (!localStorage.getItem('welcomeShown')) {
        Swal.fire({
            title: '👋 Chào mừng đến với Locket Hub!',
            text: 'Trải nghiệm dịch vụ truy cập tốt nhất với giá ưu đãi',
            icon: 'info',
            timer: 3000,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
        localStorage.setItem('welcomeShown', 'true');
    }
}, 1000);