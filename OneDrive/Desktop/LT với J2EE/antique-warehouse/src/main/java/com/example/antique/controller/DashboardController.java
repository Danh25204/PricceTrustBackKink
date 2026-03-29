package com.example.antique.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller cho trang Dashboard (trang chính sau khi đăng nhập).
 * Các phase sau sẽ bổ sung thêm dữ liệu thống kê ở đây.
 */
@Controller
public class DashboardController {

    /**
     * Hiển thị trang dashboard với các thống kê tổng quan.
     * TODO Phase 8: Inject các Service và truyền dữ liệu thống kê vào model
     */
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        // Placeholder - sẽ được bổ sung ở Phase 8 (Báo cáo)
        model.addAttribute("totalAntiques", 0);
        model.addAttribute("monthlyImports", 0);
        model.addAttribute("monthlyExports", 0);
        model.addAttribute("totalValue", 0);

        return "dashboard/index"; // → templates/dashboard/index.html
    }

    /**
     * Redirect từ root URL "/" về dashboard
     */
    @GetMapping("/")
    public String root() {
        return "redirect:/dashboard";
    }

    /**
     * Controller xử lý URL /error/403 (trang từ chối truy cập)
     * Spring Security forward đến URL này khi gặp accessDenied
     */
    @GetMapping("/error/403")
    public String forbidden() {
        return "error/403";
    }

}
