package com.example.Gateway.service.fillters;

import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import com.example.Gateway.service.utilities.JwtUtils;

@Component
public class JwtValidationFilter implements GlobalFilter, Ordered {

    @Autowired
    JwtUtils jwtUtils;

    @Override
    public int getOrder() {
        return -1; // High precedence
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        MultiValueMap<String, HttpCookie> cookies = exchange.getRequest().getCookies();
        String path = exchange.getRequest().getPath().toString();
        if (path.startsWith("/auth/")
                || path.startsWith("/api/doctor/specialization")
                || path.startsWith("/api/doctor/career-level")) {
            return chain.filter(exchange);
        }
        if (cookies.isEmpty() || cookies.get("jwt") == null || cookies.get("jwt").isEmpty()) {
            return setUnauthorizedResponse(exchange);
        }

        String jwt = cookies.get("jwt").get(0).getValue();
        try {
            if (!jwtUtils.validateJwtToken(jwt)) {
                return setUnauthorizedResponse(exchange);
            }
        } catch (JwtException e) {
            return setUnauthorizedResponse(exchange);
        }

        return chain.filter(exchange); // Continue if valid
    }

    private Mono<Void> setUnauthorizedResponse(ServerWebExchange exchange) {
        System.out.println("Unauthorized access attempt: " + exchange.getRequest().getURI());
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
