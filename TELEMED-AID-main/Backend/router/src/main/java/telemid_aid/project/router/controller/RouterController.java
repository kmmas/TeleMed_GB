package telemid_aid.project.router.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import telemid_aid.project.router.dto.UserRequest;
import telemid_aid.project.router.service.RouterService;

@RestController
@RequestMapping("/api/router")
public class RouterController {

    private final RouterService routerService;

    @Autowired
    public RouterController(RouterService routerService) {
        this.routerService = routerService;
    }

    @PostMapping("/route")
    public ResponseEntity<String> routeUserData(@RequestBody UserRequest userData) {
        routerService.routeUserData(userData);
        return ResponseEntity.ok("Data routed successfully");
    }
}